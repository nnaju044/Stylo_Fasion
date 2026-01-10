
import dotenv from "dotenv";
import User from "../models/user.model.js";
import {comparePassword , hashPassword} from "../utils/password.utils.js";


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
            message: "ILnvalid email or password"
        }
    }
    return {
        success:true,
        data:role
    }
}

export const registerService = async ({email,password,confirmPassword,phone,firstName,lastName,provider = "local",
  googleId = null}) =>{

   
  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    throw new Error("All fields are required")
  }

  if(password !== confirmPassword){
    throw new Error("Passwords do not match");
  }

  const existEmail = await User.findOne({email});
if(existEmail){
        throw new Error("Email already exists");
}

const existPhone = await User.findOne({phone});
if(existPhone){
        throw new Error("Phone number already exists");

}


        const hashedPassword = await hashPassword(password);

        const user =  User.create({
            firstName,
            lastName,
            email,
            phone,
            password:hashedPassword,
            provider,
            googleId
        })
        return user;

}

