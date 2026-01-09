
/* -------------------- ENV -------------------- */
import dotenv from 'dotenv';
dotenv.config();


/* -------------------- ROUTES -------------------- */
import adminRoutes from './Src/routes/admin.routes.js';
import userRoutes from './Src/routes/user.routes.js';


import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from "path";
import { fileURLToPath } from "url";

/* -------------------- ES MODULE  -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import sessionConfig from "./config/session.js";

/* -------------------- DB -------------------- */
import connectDB from './config/db.js';
connectDB();
const app = express()

/* -------------------- VIEW ENGINE -------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* -------------------- FOR ALERT -------------------- */
app.use((req,res,next) => {
  res.locals.alert = null;
  next();
});

/* -------------------- NO CACHEE -------------------- */
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.disable("etag");



/* -------------------- LAYOUT -------------------- */
app.use(expressLayouts);
app.set('layout', 'layouts/main');

/* -------------------- STATIC FILE -------------------- */
app.use(express.static(path.join(__dirname, 'public')));


/* -------------------- PARSING-------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* -------------------- SESSION -------------------- */
import session from 'express-session';
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge: 100*60*60*24
    }
    
}))

/* -------------------- SESSION MIDDLEWARE -------------------- */
app.use(sessionConfig);


/* -------------------- ROUTES -------------------- */

app.use('/admin',adminRoutes);
app.use('/user',userRoutes)


/* -------------------- LANDING PAGE -------------------- */
app.get('/', (req, res) => {
  res.render('users/home.ejs', {
    title: 'Home | Stylo Fashion'
  });
});

/* -------------------- PORT-------------------- */
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);

});


