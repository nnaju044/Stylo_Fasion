import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type:String,
        required: true
    },
    purpose: {
        type: String,
        enum:["signup","login","reset-password"],
        required:true
    },
    expiresAt: {
        type:Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
},{timestamps:true}
);

otpSchema.index({expiresAt:1},{expireAfterSeconds:0});

export default mongoose.model("Otp",otpSchema);