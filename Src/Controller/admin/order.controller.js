import Order from "../../models/order.model.js";
import Variant from "../../models/variant.model.js";

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

        res.render("admin/order-management-page", {
            title: "Order Management | Stylo Fashion",
            layout: "layouts/auth",
            activePage: "orders",
            orders,
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
        const { status } = req.body;

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (status === 'CANCELLED' && order.orderStatus !== 'CANCELLED') {

            for (const item of order.items) {

                const variant = await Variant.findOne({
                    productId: item.product
                });

                if (!variant) continue;

                const sizeObj = variant.sizes.find(
                    s => s.size === item.size
                );

                if (!sizeObj) continue;

                sizeObj.stock += item.quantity;

                await variant.save();
            }
        }

        order.orderStatus = status;
        await order.save();

        res.json({ success: true, message: "Order status updated successfully!" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
