import express from 'express';
import { getUserLogin , getUserSignup, postUserSignup } from '../Controller/user/auth.Controller.js';

const router = express.Router();

/* -------------------- AUTH -------------------- */

router.get('/login',getUserLogin)
router.get('/signup',getUserSignup)
router.post('/signup',postUserSignup)

export default router