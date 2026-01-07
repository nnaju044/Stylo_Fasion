import Admin from "../models/admin.model.js";
import {comparePassword} from "../utils/password.utils.js"

export const adminLoginService = async ({email,password}) =>{

    const admin = await Admin.findOne({email});
    if(!admin){
        throw new Error("Invalid Email or Password")
    }

    const isMatch = await comparePassword(password,admin.password);
    if(!isMatch){
        throw new Error("Invalid Email or Password")
    }
    return admin
}
