
import {comparePassword} from "../utils/password.utils.js"


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
