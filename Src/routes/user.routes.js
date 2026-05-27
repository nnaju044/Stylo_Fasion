import express from 'express';
import { getUserLogin, getUserSignup, getVerifyOtp, postUserSignup, postVerifyOtp, postUserLogin, getForgetPassword, postForgotPassword, getResetPassword, postResetPassword, postResendOtp, getUserBlocked, throwErrorPage } from "../Controller/user/auth.controller.js";
import { getUserProfile, getUserAddresses, addUserAddress, updateUserAddress, deleteAddress, sendEmailOtp, verifyEmailOtp, updateAllProfile, uploadProfileImage } from '../Controller/user/profile.controller.js';
import { validate } from '../middlewares/validate.js';
import { isAuth, preventAuth } from "../middlewares/userAuth.middleware.js"
import { signupSchema, loginSchema, verifyOtpSchema } from '../validators/auth.validator.js';
import { logout } from '../Controller/logout.controller.js';
import { getProductsByCategory, getProductsByCategoryAPI, getSingleProductPage } from "../Controller/user/product.controller.js";
import { searchProducts } from '../Controller/user/search.controller.js';
import { favorites, getFavorites, toggleFavorite } from '../Controller/user/favorites.controller.js';
import upload from "../middlewares/upload.js";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from '../Controller/user/cart.controller.js';
import { checkVariantStock } from '../middlewares/checkStock.js';
import { getCheckout, placeOrder, getOrderSuccessPage, getUserOrders, getUserSingleOrder, cancelUserOrder, requestReturnUserOrder } from '../Controller/user/order.controller.js';
import { useDeferredValue } from 'react';


const router = express.Router();


/* -------------------- AUTH -------------------- */
router.get('/blocked', getUserBlocked)

/* -------------------- LOGIN AUTH -------------------- */
router.get('/login', preventAuth, getUserLogin)
router.post('/login', validate(loginSchema), postUserLogin)
router.get('/logout', logout)

/* -------------------- FORGET PASS AUTH -------------------- */
router.get('/forgot-password', getForgetPassword)
router.post('/forgot-password-otp', postForgotPassword)


/* -------------------- SIGNUP AUTH -------------------- */
router.get('/signup', preventAuth, getUserSignup)
router.post('/signup', validate(signupSchema), postUserSignup)
router.post('/resend-otp', postResendOtp)

/* -------------------- VERIFY PASSWORD AUTH -------------------- */
router.get('/verify-otp', getVerifyOtp)
router.post('/verify-otp', validate(verifyOtpSchema), postVerifyOtp)

/* -------------------- SEARCH BAR -------------------- */

router.get("/search", searchProducts);

/* -------------------- ADDRESS AUTH -------------------- */

router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);

/* -------------------- PRODUCT LISTING -------------------- */

router.get("/category/:categoryId",isAuth, getProductsByCategory);
router.get("/api/category/:categoryId", getProductsByCategoryAPI);
router.get("/product/:productId", getSingleProductPage);



/* -------------------- ERROR PAGE -------------------- */

router.get("/user/errorPage", throwErrorPage)



/* -------------------- PROTECTED ROUTES -------------------- */


router.use(isAuth);

/* -------------------- PROFILE AUTH -------------------- */
router.get('/profile', isAuth, getUserProfile)

/* -------------------- ADDRESS AUTH -------------------- */
router.get('/addresses', isAuth, getUserAddresses)
router.post("/addresses/add", isAuth, addUserAddress);
router.post("/addresses/:id/update", isAuth, updateUserAddress);
router.post("/addresses/:id/delete", isAuth, deleteAddress);

/* -------------------- USER PROFILE EDIT -------------------- */
router.post('/profile/email/send-otp', isAuth, sendEmailOtp)
router.patch('/profile/email/verify-otp', isAuth, verifyEmailOtp)
router.patch("/profile/update-all", isAuth, updateAllProfile);
router.patch("/profile/upload-image", isAuth, upload.single("profileImage"), uploadProfileImage);

/* -------------------- FAVORITES -------------------- */

router.get('/api/favorites', getFavorites);
router.post('/api/favorites/:productId', toggleFavorite);
router.get('/favorites', favorites);

/* -------------------- CART -------------------- */

router.get('/cart', isAuth, getCart);
router.post('/cart/add', isAuth, addToCart);
router.patch('/cart/:sku', isAuth, checkVariantStock, updateCartQuantity);
router.delete('/cart/:sku', isAuth, removeFromCart);

/* -------------------- CHECKOUT -------------------- */

router.get('/checkout', isAuth, getCheckout);
router.post('/checkout/place-order', isAuth, placeOrder);

/* -------------------- ORDER -------------------- */

router.get('/order-success/:orderId', isAuth, getOrderSuccessPage);
router.get('/orders', isAuth, getUserOrders);
router.get('/orders/:orderId/track', isAuth, getUserSingleOrder);
router.post('/orders/:orderId/cancel', isAuth, cancelUserOrder);
router.post('/orders/:orderId/return', isAuth, requestReturnUserOrder);







export default router