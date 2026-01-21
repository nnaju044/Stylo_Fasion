import express from 'express';
import { getUserLogin , getUserSignup, getVerifyOtp, postUserSignup, postVerifyOtp , postUserLogin , getForgetPassword, postForgotPassword , getResetPassword , postResetPassword } from '../Controller/user/auth.Controller.js';
import { getUserProfile , getUserAddresses ,addUserAddress ,updateUserAddress ,deleteAddress } from '../Controller/user/profile.Controller.js';
import { validate } from '../middlewares/validate.js';
import { signupSchema , loginSchema ,verifyOtpSchema } from '../validators/auth.validator.js';
import isAuth from '../middlewares/userAuth.middleware.js';
import { logout } from '../Controller/logout.controller.js';


const router = express.Router();

/* -------------------- AUTH -------------------- */

/* -------------------- LOGIN AUTH -------------------- */
router.get('/login',getUserLogin)
router.post('/login',validate(loginSchema),postUserLogin)
router.get('/logout',logout)

/* -------------------- FORGET PASS AUTH -------------------- */
router.get('/forgot-password',getForgetPassword)
router.post('/forgot-password-otp',postForgotPassword)


/* -------------------- SIGNUP AUTH -------------------- */
router.get('/signup',getUserSignup)
router.post('/signup',validate(signupSchema),postUserSignup)

/* -------------------- VERIFY PASSWORD AUTH -------------------- */
router.get('/verify-otp',getVerifyOtp)
router.post('/verify-otp',validate(verifyOtpSchema),postVerifyOtp)

/* -------------------- PROFILE AUTH -------------------- */
router.get('/profile',getUserProfile)

/* -------------------- ADDRESS AUTH -------------------- */
router.get('/addresses',getUserAddresses)
router.post("/addresses/add", addUserAddress);
router.post("/addresses/:id/update",updateUserAddress);
router.post("/addresses/:id/delete",deleteAddress);

/* -------------------- ADDRESS AUTH -------------------- */

router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);


export default router