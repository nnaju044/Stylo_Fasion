import mongoose from "mongoose";
import dotenv from "dotenv"
import Admin from "../Src/models/admin.model.js"
import { hashPassword } from "../Src/utils/password.utils.js";

dotenv.config();

const createAdmin = async ()=>{
    
   try {
    await mongoose.connect(process.env.MONGO_URI)
     const existingAdmin = await Admin.findOne({
        email:"admin@stylofasion.com"
    });

    if(existingAdmin){
        console.log("Admin already exist...")
        process.exit();
    }

    const hashedPassword = await hashPassword("admin123");

    const admin = new Admin({
        email:"admin@stylofasion.com",
        password:hashedPassword
    });

    await admin.save();

     console.log(" Admin created");
    console.log("Email: admin@stylofashion.com");
    console.log("Password: Admin123");

    process.exit();
    
   } catch (error) {
    console.error("Error creating admin", err);
    process.exit(1);
    
   }

   
   
}
createAdmin();