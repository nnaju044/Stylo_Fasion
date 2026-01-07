import express from 'express'
import { getAdminLogin , postAdminLogin , getDashboard } from '../Controller/admin/auth.Controller.js';
import { adminAuth } from '../middlewares/adminAuth.middleware.js';


const router = express.Router();

//auth
router.get('/login',getAdminLogin);
router.post('/login',adminAuth,postAdminLogin);
router.get('/dashboard',adminAuth,getDashboard)

export default router 