import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payment } from "../models/Payment.models.js";
import { Bookings } from "../models/Booking.models.js";
import { User } from "../models/User.models.js";
import { Cars } from "../models/Car.models.js";
import { sendPaymentReceivedEmail  } from "../utils/mailer.js";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── 1. Create Razorpay Order ─────────────────────────────────────────────────
// Called before showing the Razorpay checkout popup
  export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount, carId } = req.body;

    if (!amount || !carId) {
      throw new ApiError(400, "Amount and Car ID are required");
    }

    // Verify the car exists
    const car = await Cars.findById(carId);
    if (!car) {
      throw new ApiError(404, "Car not found");
    }


    // Amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    if (amountInPaise < 100) {
      throw new ApiError(400, "Amount must be at least ₹1");
    }

    // Create Razorpay order — no booking in DB yet
    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: "INR",
      receipt:  `vectra_${Date.now()}`,
      notes: {
        carId:  carId.toString(),
        userId: req.user._id.toString(),
      },
    });


    return res.status(200).json(
      new ApiResponse(200, {
        orderId:  order.id,
        amount:   amountInPaise,
        currency: "INR",
        keyId:    process.env.RAZORPAY_KEY_ID,
      }, "Razorpay order created")
    );
  });

// ─── 2. Verify Payment + Create Booking ───────────────────────────────────────
// Called AFTER user pays on Razorpay popup
// Verifies signature — if valid, creates booking in DB (status = Pending)

  export const verifyPayment = asyncHandler(async (req, res) => {
    const {
      // Razorpay payment proof
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Booking details from frontend form
      car,
      startDate,
      endDate,
      requiredDriver,
      pickupLocation,
      dropLocation,
      totalDay,
      totalPrice,
      paymentMethod,
    } = req.body;

  // Step 1: Verify signature (HMAC SHA256)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(400, "Payment verification failed — invalid signature. Contact support.");
    }

    // ── Step 2: Signature valid — check for booking conflicts before creating ──
    const start = new Date(startDate);
    const end   = new Date(endDate);

    const conflict = await Bookings.findOne({
      car,
      status: { $in: ["Pending", "Confirm"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflict) {
      // Payment was taken but dates are now conflicted
      // Save payment record as Success but flag the issue
      await Payment.create({
        user:              req.user._id,
        amount:            totalPrice,
        razorpayOrderId:   razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus:     "Success",
        paymentMethod:     "Online",
      });

      throw new ApiError(
        409,
        `Payment received (ID: ${razorpay_payment_id}) but these dates are now taken. Please contact support for a refund.`
      );
    }

  // ── Step 3: Create booking — payment verified, dates available ────────────
  const carData = await Cars.findById(car);
    if (!carData) throw new ApiError(404, "Car not found");

    const booking = await Bookings.create({
      user:           req.user._id,
      car,
      admin:          carData.owner,
      startDate:      start,
      endDate:        end,
      requiredDriver: requiredDriver || false,
      pickupLocation,
      dropLocation:   dropLocation || pickupLocation,
      totalDay:       Number(totalDay),
      totalPrice:     Number(totalPrice),
      status:         "Pending",   // always starts Pending — admin confirms
      paymentMethod,
    });

  // ── Step 4: Save payment record linked to the new booking ─────────────────
    await Payment.create({
      user:              req.user._id,
      booking:           booking._id,
      amount:            Number(totalPrice),
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus:     "Success",
      paymentMethod:     "Online",
    });


    // ── Step 5: Send "payment received, pending confirmation" email ───────────
    const user = await User.findById(req.user._id);
    await sendPaymentReceivedEmail({
      to:             user.email,
      fullname:       user.fullname,
      carName:        carData.name,
      totalPrice:     Number(totalPrice),
      paymentId:      razorpay_payment_id,
      startDate:      start,
      endDate:        end,
      pickupLocation,
    });

    return res.status(201).json(
      new ApiResponse(201, {
        bookingId: booking._id,
        paymentId: razorpay_payment_id,
        status:    "Pending",
      }, "Payment verified. Booking created and pending admin confirmation.")
    );
});