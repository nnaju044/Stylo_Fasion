import { title } from "process";
import { adminLoginService } from "../../services/auth.service.js";


export const getAdminLogin=(req,res)=>{
    res.render('admin/login.ejs', {
    title: 'Home | Stylo Fashion',
    layout:'layouts/auth',
    
  });
}

export const postAdminLogin= async (req,res)=>{

    try {
        const {email,password} = req.body;

        if(!email || !password){
             return res.render('admin/login',{
                layout:'layouts/auth',
               alert:{
                mode:'swal',
                 type:"error",
                title:"login Failed",
                message:"Invalid Email or Password"
               }

         })
        }
      const admin = await adminLoginService({email,password});

        req.session.admin = {
            id:admin._id,
            email:admin.email,
            role:admin.role
        };
        res.redirect(303,'/admin/dashboard')
        
    } catch (error) {
        res.render('admin/login',{
        title:"Admin login",
        layout:'layouts/auth',
        alert:{
            mode:'swal',
            type:'error',
            title:'login failed',
            message:'Email and password are Required'
        }

    })
        
    }
    
}

export const getDashboard = (req,res)=>{
     res.locals.alert = {
        type:"success",
        title:"login successful",
        message:"welcome !!"
    }
    res.render('admin/dashboard',{
        error:"working dashboard",
        title:"Admin dashboard"
    })
}

