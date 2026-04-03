import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";

export const addToCart = async (req,res) =>{
    try {
        const {sku,qty} = req.body;
        const userId = req.user._id;

        const variant = await Variant.findOne({ "sizes.sku": sku });

        if (!variant) {
            return res.status(404).json({ 
                success: false,
                message: "Product variant not found" 
            });
        }

        const sizeObj = variant.sizes.find(s => s.sku === sku);
        if (!sizeObj) {
            return res.status(404).json({ 
                success: false,
                message: "Size not found" 
            });
        }

        if (sizeObj.stock <= 0) {
            return res.status(400).json({ 
                success: false,
                message: "Out of stock" 
            });
        }

        const requestedQty = Math.min(qty, sizeObj.stock);

        const product = await Product.findById(variant.productId);

        if (!product || product.isDeleted || !product.isActive) {
            return res.status(400).json({ 
                success: false,
                message: "Product unavailable" 
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingIndex = cart.items.findIndex(i => i.sku === sku);

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += requestedQty;

            const maxQty = Math.min(sizeObj.stock, 5);
            if (cart.items[existingIndex].quantity > maxQty) {
                cart.items[existingIndex].quantity = maxQty;
            }
        } else {
            cart.items.push({
                productId: product._id,
                sku,
                metal: variant.metal,
                size: sizeObj.size,
                price: variant.price,
                quantity: requestedQty,
                total: variant.price * requestedQty
            });
        }

        cart.items.forEach(item => {
            item.total = item.price * item.quantity;
        });

        cart.subtotal = cart.items.reduce((acc, i) => acc + i.total, 0);

        await cart.save();

          const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        return res.json({
            success: true,
            message: "Added to cart",
            qty: requestedQty,
            cartCount:count
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

export const getCart = async (req,res)=>{
    try {
        if (!req.user) {
      return res.render("users/product/shopping-cart-page", {
        title: "Cart | Stylo Fashion",
        cart: { items: [], subtotal: 0 },
        hasOutOfStock: false
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId");


    if (cart && cart.items.length) {
         const skus = cart.items.map(item => item.sku);

         const variants = await Variant.find({
            "sizes.sku":{$in:skus}
         });

         console.log("variants from getcart",variants);
         const variantMap = {};

         variants.forEach(v => {
            v.sizes.forEach(s =>{
                variantMap[s.sku] = v;
            });
         });

         cart.items.forEach(item => {
            const variant = variantMap[item.sku];
            item.image = variant?.images?.[0] || "/images/default.png";
            const sizeObj = variant?.sizes?.find(s => s.sku === item.sku);
            item.stock = sizeObj?.stock || 0;
         })

      }
        console.log("cart from controller=", cart);

        let hasOutOfStock = false;

        for (let item of cart.items) {
            const variant = await Variant.findOne({ "sizes.sku": item.sku });
            const sizeObj = variant?.sizes?.find(s => s.sku === item.sku);
            
            if (!sizeObj) {
                item.warning = "Size or variant unavailable";
                hasOutOfStock = true;
                continue;
            }

            item.stock = sizeObj.stock;

            if (item.quantity > sizeObj.stock) {
                item.warning = `Only ${sizeObj.stock} left`;
                hasOutOfStock = true;
            }
            if (sizeObj.stock === 0) {
                item.warning = "Out of stock";
                hasOutOfStock = true;
            }

            item.total = item.price * item.quantity;
        }

        cart.subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        await cart.save();
        
        res.render("users/product/shopping-cart-page", {
            title: "Cart | Stylo Fashion",
            cart: cart || { items: [], subtotal: 0 },
            hasOutOfStock
        });
    } catch (error) {
        console.error("Error loading cart:", error);
        res.status(500).render("404-page", {
            title: "Error | Stylo fashion",
            layout: "layouts/auth"
        });
    }
};

export const updateCartQuantity = async (req,res) =>{
    try {
        const {sku} = req.params;
        const {action} = req.body;

        const cart = await Cart.findOne({userId:req.user._id});
        const item = cart.items.find(i => i.sku === sku);

        if(!item) {
            return res.status(404).json({message: "Item not found"});
        }
                const variant = await Variant.findOne({"sizes.sku":sku});

                 const sizeObj = variant?.sizes?.find(s=> s.sku === sku);

        if(!sizeObj) {
            return res.status(404).json({
                success:false,
                message:"Size not found"
            });
        }

         if (action === "increase") {

      if (item.quantity >= sizeObj.stock) {
        return res.status(400).json({
          message: "Stock limit reached"
        });
      }

      if (item.quantity >= 5) {
        return res.status(400).json({
          message: "Maximum 5 items allowed"
        });
      }

      item.quantity += 1;

    } else if (action === "decrease") {

      if (item.quantity <= 1) {
        return res.status(400).json({
          message: "Minimum 1 item required"
        });
      }

      item.quantity -= 1;
    }

        item.total = item.price * item.quantity;

        cart.subtotal = cart.items.reduce((sum,i) => sum + i.total,0);

        await cart.save();
          const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            success:true,
            quantity: item.quantity,
            subtotal:cart.subtotal,
            stock: sizeObj.stock,
            cartCount:count
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false});
    }
}; 

