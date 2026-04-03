import Cart from "../models/cart.model.js";

export const cartCountMiddleware = async (req, res, next) => {
  try {

    if (!req.session.user) {
      res.locals.cartCount = 0;
      return next();
    }

    const userId = req.session.user.id;

    const cart = await Cart.findOne({ userId });

    let count = 0;

    if (cart && cart.items.length >= 0) {
      count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    res.locals.cartCount = count;

    next();

  } catch (err) {
    console.log(err);
    res.locals.cartCount = 0;
    next();
  }
};