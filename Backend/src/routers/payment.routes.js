import { Router } from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createRazorpayOrder);
router.route("/verify").post(verifyJWT, verifyPayment);

export default router;