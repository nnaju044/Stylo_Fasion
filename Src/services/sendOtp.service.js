import Otp from "../models/otp.model.js";
import { genarateOTP, hashOTP } from "../utils/otp.utils.js";
import { sendEmail } from "../utils/email.utils.js";

export const sendOtpService = async ({userId,email,purpose}) => {
  console.log("HELLO IAM HERE")
  const otp = genarateOTP();
  console.log(otp)
  const hashedOtp = hashOTP(otp);

  await Otp.deleteMany({ userId, purpose });

  await Otp.create({
    userId,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000),
  });

  await sendEmail({
    to: email,
    subject: "Verify your email - OTP",
    html: `
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 2 minutes.</p>
    `,
  });
  console.log("Email sending started to:",email);
};
