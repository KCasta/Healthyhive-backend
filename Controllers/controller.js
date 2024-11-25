import User from "../models/model.js";
import bcrypt from "bcryptjs";
import { SendVerificationMail } from "../helpers/nodemailer.js";
import { generateToken, generateAccessToken } from "../helpers/token.js";
import jwt from "jsonwebtoken";
import Otp from "../models/OTP.model.js";

// create user
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    // checking if password and confirm password are same
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password are not same" });
    }
    // checking if user already exist
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // save user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    // send verification email
    if (user) {
      await SendVerificationMail(user);
      // Generate and send verificaation token
      const userPayload = {
        _id: user._id,
      };
      // generate token
      const verificationToken = generateToken(userPayload);
      res
        .status(200)
        .json({ message: "verification email sent", verificationToken });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  // check if user exists
  console.log(otp);
  // extract the token from the header
  let token = null;
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "auth token is required" });
  }
  // verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    console.log(payload);

    const userOtp = await Otp.findOne({
      user: payload._id,
      otpType: "email-verify",
    });
    if (!userOtp) {
      return res.status(404).json({ message: "user token is invaild" });
    }
    if (userOtp.expiresIn < Date.now()) {
      return res.status(401).json({ message: "otp has expired" });
    }
    if (userOtp.otp === otp) {
      const user = await User.findByIdAndUpdate(payload._id, {
        isEmailVerified: true,
      });

      // Generate userpayload and send token
      const userpayload = {
        _id: user._id,
        email: user.email,
      };
      const accessToken = generateAccessToken(userpayload);
      return res.status(200).json({
        message: "Email verified",
        accessToken,
        userInfo: {
          _id: user._id,
          fullName: user.fullName,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user's email is verified
    if (!user.isEmailVerified) {
      // Send verification email again
      await SendVerificationMail(user);

      // Generate and send verification token
      const userPayload = {
        _id: user._id,
        email: user.email,
      };

      const verificationToken = generateToken(userPayload);

      return res.status(200).json({
        message: "Verification email sent. Please verify your email.",
        verificationToken,
      });
    }

    // User is verified, generate and send access token
    const userPayload = {
      _id: user._id,
      email: user.email,
    };
    const accessToken = generateAccessToken(userpayload);
    return res.status(200).json({
      message: "login successful",
      accessToken,
      userInfo: { _id: user._id, fullName: user.fullName },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createUser, verifyEmail, loginUser };
