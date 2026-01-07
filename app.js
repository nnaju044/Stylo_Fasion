// env
import dotenv from 'dotenv';
dotenv.config();

//Routes
import adminRoutes from './Src/routes/admin.routes.js'


import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from "path";
import { fileURLToPath } from "url";
//ES Modules replace 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import sessionConfig from "./config/session.js"
//DB
import connectDB from './config/db.js';
connectDB();
const app = express()
// view 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//layout 
app.use(expressLayouts);
app.set('layout', 'layouts/main');
//static File
app.use(express.static(path.join(__dirname, 'public')));

// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session 
import session from 'express-session';
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false

}))
// Session middleware 
app.use(sessionConfig);

app.use('/admin',adminRoutes)

// Landing Page 
app.get('/', (req, res) => {
  res.render('users/home.ejs', {
    title: 'Home | Stylo Fashion'
  });
});

app.get('/user/login', (req, res) => {
  res.render('users/auth/login.ejs', {
    title: 'Home | Stylo Fashion',
    layout:'layouts/auth'
  });
});



app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);

});


