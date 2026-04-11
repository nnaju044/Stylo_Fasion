import Order from "../../models/order.model.js";
import Variant from "../../models/variant.model.js";
import User from "../../models/user.model.js";

export const getAdminOrders = async (req, res) => {
    try {
        let { page, search, status, sort, clear } = req.query;

        page = parseInt(page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        let query = {};

        if (clear) {
            search = "";
            status = "";
            sort = "date_desc";
        }

        if (status && status !== 'All') {
            query.orderStatus = status;
        }

        if (search && search.trim() !== '') {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } }
            ];
        }

        let sortConfig = { createdAt: -1 };
        if (sort === "date_asc") sortConfig = { createdAt: 1 };
        if (sort === "amount_desc") sortConfig = { 'totalAmount': -1 };
        if (sort === "amount_asc") sortConfig = { 'totalAmount': 1 };

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find(query)
            .populate('user', 'fullName email')
            .sort(sortConfig)
            .skip(skip)
            .limit(limit);

        const returnRequestOrders = await Order.find({ 
            $or: [
                { orderStatus: 'RETURN_REQUESTED' },
                { 'items.itemStatus': 'RETURN_REQUESTED' }
            ]
        })
            .populate('user', 'fullName email')
            .sort({ updatedAt: -1 });

        const returnRequests = [];
        returnRequestOrders.forEach(order => {
            if (order.orderStatus === 'RETURN_REQUESTED') {
                returnRequests.push({
                    type: 'order',
                    order: order,
                    itemId: null,
                    name: 'Entire Order',
                    reason: order.returnReason
                });
            }
            order.items.forEach(item => {
                if (item.itemStatus === 'RETURN_REQUESTED') {
                    returnRequests.push({
                        type: 'item',
                        order: order,
                        itemId: item._id,
                        name: item.name,
                        reason: item.returnReason
                    });
                }
            });
        });

        res.render("admin/order-management-page", {
            title: "Order Management | Stylo Fashion",
            layout: "layouts/auth",
            activePage: "orders",
            orders,
            returnRequests,
            currentPage: page,
            totalPages,
            search: search || "",
            statusFilter: status || "All",
            sortData: sort || "date_desc"
        });

    } catch (error) {
        console.error("Error fetching admin orders:", error);
        res.status(500).send("Server Error");
    }
};

export const getAdminOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('user', 'fullName email phone');

        if (!order) {
            return res.status(404).render("error", { message: "Order not found" });
        }

        res.render("admin/order-details-page", {
            title: "Order Details | Stylo Fashion",
            layout: "layouts/auth",
            activePage: "orders",
            order
        });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).send("Server Error");
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, itemId } = req.body;

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (itemId) {
            const item = order.items.id(itemId);
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found in order." });
            }

            if (['CANCELLED', 'RETURNED'].includes(status) && !['CANCELLED', 'RETURNED'].includes(item.itemStatus)) {
                
                if (status === 'RETURNED' || (status === 'CANCELLED' && order.paymentStatus === 'COMPLETED')) {
                    const refundAmount = item.price * item.quantity;
                    await User.findByIdAndUpdate(order.user, {
                        $inc: { walletBalance: refundAmount }
                    });
                }

                const variant = await Variant.findOne({ productId: item.product });
                if (variant) {
                    const sizeObj = variant.sizes.find(s => s.sku === item.sku); 
                    if (sizeObj) {
                        sizeObj.stock += item.quantity;
                        await variant.save();
                    }
                }
            }
            item.itemStatus = status;

        } else {
            let totalRefundAmount = 0;
            
            for (const item of order.items) {
                // If the item was previously individually cancelled/returned, it stays locked out of global updates!
                if (['CANCELLED', 'RETURNED', 'RETURN_REQUESTED'].includes(item.itemStatus)) continue; 

                // Process stock recovery if global order transitions cleanly into cancelled/returned
                if (['CANCELLED', 'RETURNED'].includes(status) && !['CANCELLED', 'RETURNED'].includes(order.orderStatus)) {
                    totalRefundAmount += (item.price * item.quantity);

                    const variant = await Variant.findOne({ productId: item.product });
                    if (variant) {
                        const sizeObj = variant.sizes.find(s => s.sku === item.sku);
                        if (sizeObj) {
                            sizeObj.stock += item.quantity;
                            await variant.save();
                        }
                    }
                }

                // Propagate the new parent state onto the individual item explicitly
                item.itemStatus = status;
            }

            if (totalRefundAmount > 0 && (status === 'RETURNED' || (status === 'CANCELLED' && order.paymentStatus === 'COMPLETED'))) {
                 await User.findByIdAndUpdate(order.user, {
                    $inc: { walletBalance: totalRefundAmount }
                });
            }

            order.orderStatus = status;
        }

        await order.save();

        res.json({ success: true, message: "Status updated successfully!" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
