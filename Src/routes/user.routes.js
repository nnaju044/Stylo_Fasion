import express from 'express';
import { getUserLogin , getUserSignup, getVerifyOtp, postUserSignup, postVerifyOtp , postUserLogin } from '../Controller/user/auth.Controller.js';


const router = express.Router();

/* -------------------- AUTH -------------------- */

router.get('/login',getUserLogin)
router.post('/login',postUserLogin)
router.get('/signup',getUserSignup)
router.post('/signup',postUserSignup)
router.get('/verify-otp',getVerifyOtp)
router.post('/verify-otp',postVerifyOtp)

export default router