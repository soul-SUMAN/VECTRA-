import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../api/otpService";

export default function OtpModal({ email, onVerified, onClose }) {
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await sendOtp(email, "register");
      setOtpSent(true);
      setSuccessMessage("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue) {
      setError("Enter the OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyOtp(email, otpValue, "register");
      setSuccessMessage("Email verified successfully!");
      setTimeout(() => {
        onVerified();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-8 max-w-md w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Verify Email</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          A verification code has been sent to <span className="text-yellow-400 font-semibold">{email}</span>
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-yellow-500 text-slate-900 font-semibold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-slate-500 text-center tracking-widest font-bold text-lg"
              />
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-yellow-500 text-slate-900 font-semibold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition disabled:opacity-60"
            >
              {loading ? "..." : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
