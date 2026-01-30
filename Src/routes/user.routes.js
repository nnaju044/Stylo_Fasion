import express from 'express';
import upload from "../middlewares/upload.js";
import { getUserLogin , getUserSignup, getVerifyOtp, postUserSignup, postVerifyOtp , postUserLogin , getForgetPassword, postForgotPassword , getResetPassword , postResetPassword, postResendOtp, getUserBlocked } from '../Controller/user/auth.Controller.js';
import { getUserProfile , getUserAddresses ,addUserAddress ,updateUserAddress ,deleteAddress , sendEmailOtp, verifyEmailOtp,updateAllProfile, uploadProfileImage} from '../Controller/user/profile.controller.js';
import { validate } from '../middlewares/validate.js';
import {isAuth} from "../middlewares/userAuth.middleware.js"
import { signupSchema , loginSchema ,verifyOtpSchema } from '../validators/auth.validator.js';
import { logout } from '../Controller/logout.controller.js';


const router = express.Router();

/* -------------------- AUTH -------------------- */
router.get('/blocked',getUserBlocked)

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
router.post('/resend-otp', postResendOtp)

/* -------------------- VERIFY PASSWORD AUTH -------------------- */
router.get('/verify-otp',getVerifyOtp)
router.post('/verify-otp',validate(verifyOtpSchema),postVerifyOtp)

/* -------------------- PROFILE AUTH -------------------- */
router.get('/profile',isAuth,getUserProfile)

/* -------------------- ADDRESS AUTH -------------------- */
router.get('/addresses',isAuth,getUserAddresses)
router.post("/addresses/add",isAuth,addUserAddress);
router.post("/addresses/:id/update",isAuth,updateUserAddress);
router.post("/addresses/:id/delete",isAuth,deleteAddress);

/* -------------------- ADDRESS AUTH -------------------- */

router.get("/reset-password",isAuth, getResetPassword);
router.post("/reset-password",isAuth, postResetPassword);

/* -------------------- USER PROFILE EDIT -------------------- */
router.post('/profile/email/send-otp',isAuth,sendEmailOtp)
router.patch('/profile/email/verify-otp',isAuth,verifyEmailOtp)
router.patch("/profile/update-all",isAuth,updateAllProfile);
router.patch("/profile/upload-image",isAuth,upload.single("profileImage"),uploadProfileImage);





export default router