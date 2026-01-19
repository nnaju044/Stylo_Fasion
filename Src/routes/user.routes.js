import express from 'express';
import { getUserLogin , getUserSignup, getVerifyOtp, postUserSignup, postVerifyOtp , postUserLogin , getForgetPassword } from '../Controller/user/auth.Controller.js';
import { getUserProfile , getUserAddresses ,addUserAddress } from '../Controller/user/profile.Controller.js';
import { validate } from '../middlewares/validate.js';
import { signupSchema , loginSchema ,verifyOtpSchema } from '../validators/auth.validator.js';
import isAuth from '../middlewares/userAuth.middleware.js';


const router = express.Router();

/* -------------------- AUTH -------------------- */

/* -------------------- LOGIN AUTH -------------------- */
router.get('/login',getUserLogin)
router.post('/login',validate(loginSchema),postUserLogin)

/* -------------------- SIGNUP AUTH -------------------- */
router.get('/signup',getUserSignup)
router.post('/signup',validate(signupSchema),postUserSignup)

/* -------------------- VERIFY PASSWORD AUTH -------------------- */
router.get('/verify-otp',getVerifyOtp)
router.post('/verify-otp',isAuth,validate(verifyOtpSchema),postVerifyOtp)

/* -------------------- PROFILE AUTH -------------------- */
router.get('/profile',getUserProfile)

/* -------------------- ADDRESS AUTH -------------------- */
router.get('/addresses',getUserAddresses)
router.post("/addresses", isAuth, addUserAddress);
// router.post("/addresses/:id/delete", isAuth, deleteAddress);
// router.post("/addresses/:id/update", isAuth, updateAddress);

/* -------------------- FORGET PASSWORD AUTH -------------------- */
router.get('/forget-password',getForgetPassword)

export default router