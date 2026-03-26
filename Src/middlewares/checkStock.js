import Variant from "../models/variant.model.js";
import Cart from "../models/cart.model.js";

export const checkVariantStock = async (req, res, next) => {
  try {
    const { sku } = req.params;
    const { action } = req.body;

    const variant = await Variant.findOne({
      "sizes.sku": sku
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    const sizeObj = variant.sizes.find(s => s.sku === sku);

    if (!sizeObj) {
      return res.status(404).json({
        success: false,
        message: "Size not found"
      });
    }

    const cart = await Cart.findOne({ userId: req.session.user.id });
    console.log("cart finded",cart);
    const item = cart.items.find(i => i.sku === sku);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not in cart"
      });
    }

    if (action === "increase" && item.quantity >= sizeObj.stock) {
      return res.status(400).json({
        success: false,
        message: "Stock limit reached"
      });
    }

    next();

  } catch (error) {
    console.error("Stock middleware error:", error);
    res.status(500).json({ success: false });
  }
};