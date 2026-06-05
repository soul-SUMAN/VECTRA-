import { Router } from "express";
import { sendOtp, verifyOtp, resetPassword } from "../controllers/otp.controllers.js";

const router = Router();

router.route("/send").post(sendOtp);
router.route("/verify").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

export default router;