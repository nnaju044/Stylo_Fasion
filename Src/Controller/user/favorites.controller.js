import User from "../../models/user.model.js";
import Variant from "../../models/variant.model.js";

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get favorites",
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const user = await User.findById(userId).select("favorites");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exists = user.favorites.some((fav) => fav.toString() === productId);

    if (exists) {
      await User.updateOne(
        { _id: userId },
        { $pull: { favorites: productId } },
      );
    } else {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { favorites: productId } },
      );
    }

    return res.json({
      success: true,
      isFavorite: !exists,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle favorite",
    });
  }
};

export const favorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    const products = user.favorites;

    const favoritesWithData = await Promise.all(
      products.map(async (product) => {
        const variant = await Variant.findOne({
          productId: product._id,
          isDeleted: false,
          isActive: true,
        });

        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: variant?.price || 0,
          images: variant?.images || [],
        };
      }),
    );

    console.log("user.favorites", favoritesWithData);

    res.render("users/product/favorites-page", {
      title: "Favorites | Stylo fashion",
      favorites: favoritesWithData,
    });
  } catch (error) {
    console.error("Error loading favorites page:", error);
    res.status(500).render("404-page", {
      title: "Error | Stylo fashion",
      layout:"layouts/auth"
    });
  }
};
