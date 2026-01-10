import Otp from "../utils/otp.utils.js";
import { genarateOTP , hashOTP } from "../utils/otp.utils.js";

export const sendOtpService = async ({userId,purpose}) =>{
  try {
      const otp = genarateOTP();
    const hashedOtp = hashOTP(otp);

    await Otp.deleteMany({userId , purpose});

    await Otp.create({
        userId,
        otp:hashedOtp,
        purpose,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000)
    });
    console.log("Otp:",otp);
    return otp;
  } catch (error) {

    if(error){
        throw new Error("OTP Request failed try again");
    }
    
  }
    
}