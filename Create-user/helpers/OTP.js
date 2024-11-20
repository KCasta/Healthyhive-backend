import Otp from "../models/OTP.model.js";
// function random numbers
const generateOtp = async (userId, otpType) => {
  // clear existing otp assocaite with the user
  await Otp.deleteMany({ user: userId, otpType });
  // proceed to generate new otp
  const min = 100000; // minimum 6 digit number
  const max = 999999; // maximum 6 digit number
  const otp = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  // putting a data of expiration time
  const currentDate = new Date(Date.now());
  // expiration time is 5 minutes
  currentDate.setMinutes(currentDate.getMinutes() + 5);
  // save the new time
  const expiresIn = currentDate.getTime();
  try {
    const newOTP = await Otp.create({
      user: userId,
      otp: otp,
      expiresIn: expiresIn,
      otpType: otpType,
    });
    return otp;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export { generateOtp };
