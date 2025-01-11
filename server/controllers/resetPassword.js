import User from "../models/User.js";
import Otp from "../models/OTP.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import mailSender from "../config/mailSend.js";
import { verifyToken } from "../utils/jwt.js";

export const sendResetPasswordToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailTitle = 'Reset Your Password';
    const emailBody = `
      <p>Hello ${user.name},</p>
      <p> token: ${resetToken} </p>
      <p>We received a request to reset your password. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    const mailInfo = await mailSender(email, emailTitle, emailBody);

    if (mailInfo && mailInfo.response) {
      return res.status(200).json({
        success: true,
        message: "Password reset link sent successfully to your email.",
      });
    } else {
      throw new Error("Failed to send reset password email");
    }
  } catch (error) {
    console.error("Error generating or sending reset password token:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the reset password email.",
    });
  }
};


export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }
  
    try {
      // Verify the reset password token
      const decoded = verifyToken(token);
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.passwordHash = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
      });
    } catch (error) {
      console.error("Error resetting password:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while resetting the password",
      });
    }
};