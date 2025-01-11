import Otp from "../models/OTP.js";
import mailSender from "../config/mailSend.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"; 

export const generateAndSendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

    const user = await User.findOne({ email: email })
    if(user){
        return res.status(401).json({
            success : false,
            massage: "user already exist with given email",
        })
    }

  try { 
    const otpValue = Otp.generateOtp();

    // Save the OTP to the database
    const otp = new Otp({
      email,
      otp: otpValue,
    });
    await otp.save();

    // Send OTP via email using mailSender
    const emailTitle = 'Your OTP Code';
    const emailBody = `
      <p>Hello,</p>
      <p>Your OTP code is <strong>${otpValue}</strong>. It will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    const mailInfo = await mailSender(email, emailTitle, emailBody);

    if (mailInfo && mailInfo.response) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        email,
      });
    } else {
      throw new Error('Failed to send OTP email');
    }
  } catch (error) {
    console.error('Error generating or sending OTP:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate or send OTP',
    });
  }
};
