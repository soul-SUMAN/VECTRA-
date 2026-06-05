// src/api/otpService.js
import api from "./apiManager";

export const sendOtp    = (email, purpose) => 
    api.post("/otp/send",   { email, purpose });

export const verifyOtp  = (email, otp, purpose) => 
    api.post("/otp/verify", { email, otp, purpose });

export const resetPassword = (email, newPassword) =>
    api.post("/otp/reset-password", { email, newPassword });