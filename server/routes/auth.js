import express from 'express';
import { generateAndSendOtp } from '../controllers/sendOtp.js';
import { registerUser } from '../controllers/register.js';
import { loginUser } from '../controllers/login.js';
import { changePassword } from '../controllers/changePassword.js';
import { auth } from '../middlewares/auth.js';
import { sendResetPasswordToken , resetPassword } from '../controllers/resetPassword.js';

const router = express.Router();

router.post('/generate-otp', generateAndSendOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", auth, changePassword);
router.post("/reset-password-token", sendResetPasswordToken);
router.post("/reset-password", resetPassword);


export default router;
