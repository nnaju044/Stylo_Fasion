import express from 'express'
import { getAdminLogin , postAdminLogin , getDashboard } from '../Controller/admin/auth.Controller.js';
import { logout } from '../Controller/logout.controller.js';
import { adminAuth, adminGuest , noCache } from '../middlewares/adminAuth.middleware.js';
import { validate } from '../middlewares/validate.js';
import { adminLoginSchema } from '../validators/auth.validator.js';
import { getUserManagment, toggleUserStatus,searchUsers } from '../Controller/admin/users.Controller.js';
import {getCategoryManagment , addCategory , editCategory , softDeleteCategory , searchCategories} from '../Controller/admin/category.controller.js';
import {getProductManagment , getCategoriesForDropdown , getMaterialsForDropdown , addProduct , getProductById, updateProduct, deleteProduct} from "../Controller/admin/product.controller.js";
import upload from "../middlewares/upload.js";


const router = express.Router();

/* -------------------- AUTH -------------------- */

router.get('/login',noCache,adminGuest,getAdminLogin);
router.post('/login',noCache,adminGuest,validate(adminLoginSchema),postAdminLogin);
router.get('/logout',logout)
router.get('/dashboard',adminAuth,getDashboard)

/* -------------------- USER MANAGMENT -------------------- */

router.get('/user-managment',adminAuth,getUserManagment)
router.patch('/users/:userId/toggle-status',toggleUserStatus)
router.get('/users/search',searchUsers);

/* -------------------- CATEGORY MANAGMENT -------------------- */

router.get('/category-managment',adminAuth,getCategoryManagment);
router.post("/category",adminAuth,addCategory);
router.patch("/category/:id",adminAuth,editCategory);
router.patch("/category/delete/:id",adminAuth,softDeleteCategory);
router.get("/categories/search",adminAuth,searchCategories);

/* -------------------- PRODUCT MANAGMENT -------------------- */

router.get('/product-managment',adminAuth,getProductManagment);
router.get("/api/categories", getCategoriesForDropdown);
router.get("/api/materials", getMaterialsForDropdown);
router.post("/products", adminAuth, upload.any(), addProduct);
router.get("/products/:id", adminAuth, upload.any(), getProductById);
router.put("/products/:id", adminAuth, upload.any(), updateProduct);
router.delete("/products/:id",deleteProduct);












export default router 