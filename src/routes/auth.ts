import express from "express";
import { registerController, loginController } from "../controller/auth";
import { verifyToken } from "../middleware/middleware";
const router = express.Router();

router.post("/register", registerController);

router.post("/login", verifyToken, loginController);

export default router;
