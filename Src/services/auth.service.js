
import dotenv from "dotenv";
import User from "../models/user.model.js";
import {comparePassword , hashPassword} from "../utils/password.utils.js";
import { resetPasswordSchema } from "../validators/auth.validator.js";
import { success } from "zod";


dotenv.config();

export const loginService = async ({model,email,password}) =>{

  
  const role = await model.findOne({email});
  

    if(!role){
         return {
            success:false,
            message: "Invalid email or password"
         }

         }

    const isMatch = await comparePassword(password,role.password);
    
    if(!isMatch){
     
        return {
            success:false,
            message: "Invalid email or password"
        }
    }

    return {
        success:true,
        data:role,
        message:"successfully checked"
    }
};

export const registerService = async ({email,password,phone,firstName,lastName,provider = "local",googleId = null}) =>{


  const existEmail = await User.findOne({email});
 if(existEmail){
        throw new Error("Email already exists");
}

const existPhone = await User.findOne({phone});
if(existPhone){
        throw new Error("Phone number already exists");

}


        const hashedPassword = await hashPassword(password);

        const user =  await User.create({
            firstName,
            lastName,
            email,
            phone,
            password:hashedPassword,
            provider,
            googleId
        })
        return user;

};

export const resetPasswordService = async ({userId,passwordData}) =>{
   
     const parsed = resetPasswordSchema.safeParse(passwordData);
     console.log("this is parced",parsed)
    if(!parsed.success){
        console.log("!parsed.success")
         const errors = parsed.error.issues.map(err => err.message);
        return {
      success: false,
      errors,
    };
    }
    const hashedPassword = await hashPassword(parsed.data?.password);
    console.log("password hashed",hashedPassword)

    const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
  console.log("user updated",updatedUser)

  if (!updatedUser) {
    console.log("!updatedUser")
    return {
        success:false,
        errors:"Update user failed"
    }
     
  }
  console.log("service success returned true")
  return {
    success: true,
  };
    
   
   
    
   
};



