import nodemailer from "nodemailer";
import { generateOtp } from "./OTP.js";

const SendVerificationMail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  // Call Generate Otp Function
  const returnedOtp = await generateOtp(user._id, "email-verify");
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "One-time verfication code",
    text: `IT WORKED${returnedOtp}`,
  };
  try {
    const emailInfo = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error sending email");
    throw err;
  }
};

export { SendVerificationMail };
