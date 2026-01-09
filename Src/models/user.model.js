import mongoose from "mongoose";

const usesrSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true,

        },
        profilePicture:{
            type:String
        },
        referredBy:{
            type:String
        },
        referralCode:{
            type:String
        },
        isActive:{
            type:Boolean,
            default:true
        },
        role:{
            type:String,
            default:"user"
        }
    },
    {timestamps:true}
);



export default mongoose.model("User",usesrSchema)