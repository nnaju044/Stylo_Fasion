import express from 'express'
import { getAdminLogin , postAdminLogin , getDashboard } from '../Controller/admin/auth.Controller.js';
import { logout } from '../Controller/logout.controller.js';
import { adminAuth, adminGuest , noCache } from '../middlewares/adminAuth.middleware.js';
import { validate } from '../middlewares/validate.js';
import { adminLoginSchema } from '../validators/auth.validator.js';


const router = express.Router();

/* -------------------- AUTH -------------------- */

router.get('/login',noCache,adminGuest,getAdminLogin);
router.post('/login',noCache,adminGuest,validate(adminLoginSchema),postAdminLogin);
router.get('/logout',logout)
router.get('/dashboard',adminAuth,getDashboard)

export default router 