import { generateToken } from "../lib/utils.js"
import { getStreamToken } from "../lib/stream.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { OAuth2Client } from "google-auth-library";
import { ENV } from "../lib/env.js";


export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const client = new OAuth2Client(ENV.GOOGLE_AUTH_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: ENV.GOOGLE_AUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    generateToken(user._id, res);

    const profile = await Profile.findOne({ user: user._id });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: profile?.profilePicture || "",
      plan: user.plan,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStreamTokenForUser = async (req, res) => {
  try {
    const user = req.user;
    const streamToken = getStreamToken(user._id.toString());

    if (!streamToken) {
      return res.status(500).json({ message: "Error generating Stream token" });
    }
    res.status(200).json({ streamToken });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  } 
}

export const login = async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.findOne({ email });

    if (!newUser) return res.status(400).json({ message: "Invalid Credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, newUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(newUser._id, res);

    const profile = await Profile.findOne({ user: newUser._id });

    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePicture: profile?.profilePicture || "",
      plan: newUser.plan,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}


export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {

    console.log("Registering user:", email);

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    console.log("Checking if user exists:", email);


    const user = await User.findOne({ email });
    console.log(user)
    if (user) return res.status(400).json({ message: "User already exists in database" })

    console.log("Creating new user:", email);
    const newUser = new User({
      fullName,
      email,
      password
    });

    if (newUser) {

      await newUser.save();
      const newProfile = new Profile({
        user: newUser._id,
        fullName,
        email,
      });

      await newProfile.save();

      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: "",
        plan: newUser.plan,
        isNewUser: true
      });
    }
    else {
      console.log("Error creating user:", email);
      res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.log("Registration Error:", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" })
  }
}

export const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged Out Successfully" })
}

export const deleteUser = async (req, res) => {
  try {
    const user = req.user;

    await User.findByIdAndDelete(user._id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" })
  }
}
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate Token
    const token = crypto.randomBytes(20).toString("hex");

    // Save token to DB (valid for 1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Send Email (Using Gmail for dev - Google "Gmail App Password" to get a password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your App Password
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'CollabSpace Support',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://localhost:5173/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });

  } catch (error) {
    res.status(500).json({ message: "Error sending email" });
  }
};

// 2. RESET PASSWORD (Verify Token & Change Password)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) return res.status(400).json({ message: "Password reset token is invalid or has expired." });

    // Hash new password using your existing bcrypt logic (Assuming you have a pre-save hook or manual hashing)
    // If you use bcrypt manually here: const salt = await bcrypt.genSalt(10); user.password = await bcrypt.hash(password, salt);
    user.password = password; // Make sure your User model has a .pre('save') hook to hash this!

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated!" });

  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    const profile = await Profile.findOne({ user: user._id });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: profile?.profilePicture || "",
      plan: user.plan,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};