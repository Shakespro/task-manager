import { loginLimiter, accountLimiter } from "../middleware/rateLimits.js";
import express from "express";
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", accountLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// email verification
router.post("/verify-email", protect, accountLimiter, verifyEmail);

// veriify user --> email verification
router.post("/verify-user/:verificationToken", accountLimiter, verifyUser);

// forgot password
router.post("/forgot-password", accountLimiter, forgotPassword);

//reset password
router.post(
  "/reset-password/:resetPasswordToken",
  accountLimiter,
  resetPassword,
);

// change password ---> user must be logged in
router.patch("/change-password", protect, accountLimiter, changePassword);

export default router;
