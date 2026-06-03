import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payment } from "../models/Payment.models.js";
import { Bookings } from "../models/Booking.models.js";
import { sendBookingConfirmationEmail } from "../utils/mailer.js";
import { User } from "../models/User.models.js";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── 1. Create Razorpay Order ─────────────────────────────────────────────────
// Called before showing the Razorpay checkout popup
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Bookings.findById(bookingId).populate("car");
  if (!booking) throw new ApiError(404, "Booking not found");

  // Amount in paise (₹1 = 100 paise)
  const amountInPaise = Math.round(booking.totalPrice * 100);

  const order = await razorpay.orders.create({
    amount:   amountInPaise,
    currency: "INR",
    receipt:  `booking_${bookingId}`,
    notes: {
      bookingId: bookingId.toString(),
      userId:    req.user._id.toString(),
    },
  });

  // Save a pending payment record
  await Payment.create({
    user:            req.user._id,
    booking:         bookingId,
    amount:          booking.totalPrice,
    razorpayOrderId: order.id,
    paymentStatus:   "Pending",
    paymentMethod:   "Online",
  });

  return res.status(200).json(
    new ApiResponse(200, {
      orderId:  order.id,
      amount:   amountInPaise,
      currency: "INR",
      keyId:    process.env.RAZORPAY_KEY_ID,
    }, "Order created")
  );
});

// ─── 2. Verify Payment Signature ──────────────────────────────────────────────
// Called after user completes payment on Razorpay popup
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // Step 1: Verify signature (HMAC SHA256)
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    // Signature mismatch — mark payment failed
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { paymentStatus: "Failed" }
    );
    throw new ApiError(400, "Payment verification failed");
  }

  // Step 2: Update payment record
  await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus:     "Success",
    }
  );

  // Step 3: Update booking status to Confirm
  const booking = await Bookings.findByIdAndUpdate(
    bookingId,
    { status: "Confirm" },
    { new: true }
  ).populate("car");

  // Step 4: Send confirmation email
  const user = await User.findById(req.user._id);
  await sendBookingConfirmationEmail({
    to:             user.email,
    fullname:       user.fullname,
    carName:        booking.car?.name,
    startDate:      booking.startDate,
    endDate:        booking.endDate,
    totalDay:       booking.totalDay,
    totalPrice:     booking.totalPrice,
    pickupLocation: booking.pickupLocation,
    paymentId:      razorpay_payment_id,
  });

  return res.status(200).json(
    new ApiResponse(200, { paymentId: razorpay_payment_id }, "Payment verified successfully")
  );
});