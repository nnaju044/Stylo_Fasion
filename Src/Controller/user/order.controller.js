import Cart from "../../models/cart.model.js";
import Variant from "../../models/variant.model.js";
import Address from "../../models/address.model.js";
import Order from "../../models/order.model.js";

export const getCheckout = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const addresses = await Address.find({ userId });
                console.log("Asdess",addresses);


        const cart = await Cart.findOne({ userId }).populate('items.productId');
        let cartData = [];
        let subtotal = 0;
        let shippingAmount = 40;
        let finalAmount = 0;
        let discount = 0;

        if (cart && cart.items.length > 0) {
            const skus = cart.items.map(item => item.sku);
            const variants = await Variant.find({ "sizes.sku": { $in: skus } });

            cartData = cart.items.map(item => {
                const variant = variants.find(v => v.sizes.some(s => s.sku === item.sku));

                if (!variant) return null;

                return {
                    productName: item.productId.name || item.productId.productName || 'Product',
                    productImages: variant.images,
                    quantity: item.quantity,
                    total: item.total,
                    price: item.price,
                };
            }).filter(Boolean);

            subtotal = cartData.reduce((sum, item) => sum + item.total, 0);

            finalAmount = subtotal > 0 ? subtotal + shippingAmount : 0;
        }
        console.log("ADDRESSES:", addresses);
        res.render("users/product/checkout", {
            title: "Checkout | Stylo Fashion",
            addresses,
            cartData,
            subtotal,
            shippingAmount,
            finalAmount,
            discount,
            user: req.user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Please select a delivery address."
      });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty."
      });
    }

    const address = await Address.findById(addressId);

    if (!address || address.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Invalid address selected."
      });
    }


    const skus = cart.items.map(i => i.sku);

    const variants = await Variant.find({
      "sizes.sku": { $in: skus }
    });

    const variantMap = {};

    variants.forEach(v => {
      v.sizes.forEach(s => {
        variantMap[s.sku] = v;
      });
    });

    for (const item of cart.items) {
      const variant = variantMap[item.sku];

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Variant not found"
        });
      }

      const sizeObj = variant.sizes.find(s => s.sku === item.sku);

      if (!sizeObj || item.quantity > sizeObj.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.productId.name} is out of stock`
        });
      }
    }


    const orderItems = cart.items.map(item => {
      const variant = variantMap[item.sku];

      return {
        product: item.productId._id,
        sku: item.sku,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity,
        image: variant?.images?.[0] || ""
      };
    });


    const shippingAmount = 40;
    const subtotal = cart.subtotal;
    const finalAmount = subtotal + shippingAmount;


    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: subtotal,
      shippingAmount,
      finalAmount,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country
      },
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "PENDING"
    });

    await order.save();


    for (const item of cart.items) {
      const variant = variantMap[item.sku];

      const sizeObj = variant.sizes.find(s => s.sku === item.sku);

      sizeObj.stock -= item.quantity;

      await variant.save();
    }


    cart.items = [];
    cart.subtotal = 0;
    await cart.save();

    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id
    });

  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order."
    });
  }
};

export const orderSuccess = async (req, res) => {
  const order = await Order.findById(req.params.id);

  res.render("users/product/order-success", { order });
};

export const getOrderSuccessPage = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.redirect('/user/errorPage');
        }

        res.render('users/product/order-success', {
            title: "Order Success | Stylo Fashion",
            user: req.user,
            order
        });
    } catch (error) {
        res.redirect('/user/errorPage');
    }
};
