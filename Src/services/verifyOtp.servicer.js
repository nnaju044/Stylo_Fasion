import Otp from "../models/otp.model.js";
import { hashOTP } from "../utils/otp.utils.js";

export const verifyOtpService = async ({userId,otp,purpose}) =>{

        const record = await Otp.findOne({userId,purpose,isUsed:false});
    if(!record) throw new Error("OTP not found");

    if(record.expiresAt < Date.now()){
        throw new Error("OTP Expired");
    }

     if (hashOTP(otp) !== record.otp) {
    throw new Error("Invalid OTP");
  }
  record.isUsed = true;
  await record.save();

  return true;
}