import otpGenerator from "otp-generator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Otp } from "../models/Otp.models.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { User } from "../models/User.models.js";
import bcrypt from "bcrypt";

// ─── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOtp = asyncHandler(async (req, res) => {
  const { email, purpose = "register" } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  if (purpose === "register") {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "Email already registered");
  }

  // Generate 6-digit numeric OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars:       false,
  });

  // Delete any previous OTP for this email+purpose
  await Otp.deleteMany({ email, purpose });

  // Store new OTP (auto-expires in 10 min via TTL index)
  await Otp.create({ email, otp, purpose });

  // Send email
  await sendOtpEmail({ to: email, otp, purpose });

  return res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, purpose = "register" } = req.body;

  const record = await Otp.findOne({ email, purpose });

  if (!record)      throw new ApiError(400, "OTP expired or not found. Please request a new one.");
  if (record.otp !== otp) throw new ApiError(400, "Invalid OTP");

  // Delete OTP after successful verification
  await Otp.deleteMany({ email, purpose });

  return res.status(200).json(new ApiResponse(200, { verified: true }, "OTP verified"));
});


// ─── Reset password after OTP verified ────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword; // pre-save hook hashes it automatically
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});