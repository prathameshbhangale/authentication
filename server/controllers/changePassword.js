import User from "../models/User.js";
import bcrypt from "bcrypt";


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user; // Assuming the user is authenticated and `userId` is added to `req.user` by a middleware

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Old and new passwords are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing the password",
    });
  }
};
