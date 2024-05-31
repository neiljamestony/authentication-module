import express from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controller/auth";
import { verifyToken } from "../middleware/middleware";
const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", verifyToken, logoutController);

export default router;
