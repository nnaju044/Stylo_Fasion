import Admin from "../models/admin.model.js";
import {comparePassword} from "../utils/password.utils.js"

export const adminLoginService = async ({email,password}) =>{

    const admin = await Admin.findOne({email});
    if(!admin){
         return res.render('admin/login',{
                layout:'layout/auth',
               alert:{
                mode:'swal',
                 type:"error",
                title:"login Failed",
                message:"Invalid Email or Password"
               }

         })
    }

    const isMatch = await comparePassword(password,admin.password);
    if(!isMatch){
        return res.render('admin/login',{
                layout:'layout/auth',
               alert:{
                mode:'swal',
                 type:"error",
                title:"login Failed",
                message:"Invalid Email or Password"
               }

         })
    }
    return admin
}
