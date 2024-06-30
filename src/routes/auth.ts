import express from "express";
import { verifyToken } from "../middleware/middleware";
import {
  registerController,
  loginController,
  logoutController,
  verifyIfEmailExists,
  forgotPassword,
} from "../controller/auth";
const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/verify", verifyIfEmailExists);

router.post("/forgotPassword", verifyToken, forgotPassword);

router.post("/logout", logoutController);

export default router;
