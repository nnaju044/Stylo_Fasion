import express from 'express';
import { getUserLogin , getUserSignup } from '../Controller/user/auth.Controller.js';

const router = express.Router();

/* -------------------- AUTH -------------------- */

router.get('/login',getUserLogin)
router.get('/signup',getUserSignup)

export default router