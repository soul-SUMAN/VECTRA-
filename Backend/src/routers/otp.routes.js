import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controllers.js";

const router = Router();

router.route("/send").post(sendOtp);
router.route("/verify").post(verifyOtp);

export default router;