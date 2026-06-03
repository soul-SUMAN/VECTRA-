import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpModal from "../components/OtpModal";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, register, isAuthenticated, loading, error, clearError } = useAuth();

  // Where to send the user after login (falls back to home)
  const redirectTo = location.state?.from?.pathname || "/";

  const [activeTab,  setActiveTab]  = useState("login");
  const [form,       setForm]       = useState({ email: "", password: "", fullname: "", username: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // ── If already authenticated, leave this page immediately ─────────────────
  // Guard: only redirect once loading is done — avoids redirecting during the
  // initial session check when isAuthenticated is still false transiently.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading]);

  // Clear API error when switching tabs
  useEffect(() => { clearError(); }, [activeTab]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login({ email: form.email, password: form.password });
    if (!result.success) setSubmitting(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Store the registration data and show OTP modal
    setPendingRegistration({
      fullname: form.fullname,
      username: form.username,
      email: form.email,
      password: form.password,
      avatar: avatarFile,
    });
    setShowOtpModal(true);
  };

  const handleOtpVerified = async () => {
    // Now create the user with the verified email
    if (!pendingRegistration) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("fullname", pendingRegistration.fullname);
    formData.append("username", pendingRegistration.username);
    formData.append("email", pendingRegistration.email);
    formData.append("password", pendingRegistration.password);
    if (pendingRegistration.avatar) formData.append("avatar", pendingRegistration.avatar);

    const result = await register(formData);
    if (result.success) {
      // Reset form and switch to login tab
      setActiveTab("login");
      setForm((prev) => ({ ...prev, fullname: "", username: "", password: "", email: "" }));
      setAvatarFile(null);
      setPendingRegistration(null);
      setShowOtpModal(false);
    }
    setSubmitting(false);
  };

  // While the initial session check is still running, show nothing
  // (ProtectedRoute already shows a spinner; this prevents a flash of the login form)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const inputClass =
    "p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-slate-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1220] to-[#0d0d0d] font-sans px-4">
      <section className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="md:grid md:grid-cols-2">

          {/* Left panel */}
          <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-slate-800 to-slate-900">
            <img src="/VECTRA-LOGO.png" alt="logo" className="w-20 h-20 rounded-full mb-4" />
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-slate-300 text-center max-w-xs">
              Rent the car you love. Manage bookings, wishlist and more from your account.
            </p>
          </div>

          {/* Right panel */}
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl text-white font-semibold">My Account</h3>
              <div className="flex gap-2 bg-slate-800 rounded-full p-1">
                {["login","signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm capitalize ${
                      activeTab === tab
                        ? "bg-yellow-500 text-slate-900 font-semibold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {tab === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <label className="text-sm text-slate-300">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" className={inputClass} placeholder="you@example.com" />
                <label className="text-sm text-slate-300">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className={inputClass} placeholder="••••••••" />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 py-3 bg-yellow-500 text-slate-900 rounded-lg font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>

                {/* Google Login */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-900 px-3 text-xs text-slate-500">or continue with</span>
                  </div>
                </div>

                <a 
                  href="http://localhost:4000/api/v1/user/auth/google"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-slate-600
                            bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </a>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                <label className="text-sm text-slate-300">Full Name</label>
                <input name="fullname" value={form.fullname} onChange={handleChange} required type="text" className={inputClass} placeholder="Your full name" />
                <label className="text-sm text-slate-300">Username</label>
                <input name="username" value={form.username} onChange={handleChange} required type="text" className={inputClass} placeholder="username" />
                <label className="text-sm text-slate-300">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" className={inputClass} placeholder="you@example.com" />
                <label className="text-sm text-slate-300">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className={inputClass} placeholder="Min 8 chars, uppercase, number, symbol" />
                <label className="text-sm text-slate-300">Avatar (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 py-3 bg-yellow-500 text-slate-900 rounded-lg font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating account..." : "Continue"}
                </button>

                {/* Google Signup */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-900 px-3 text-xs text-slate-500">or continue with</span>
                  </div>
                </div>

                <a 
                  href="http://localhost:4000/api/v1/user/auth/google"
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-slate-600
                            bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </a>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpModal
          email={pendingRegistration?.email}
          onVerified={handleOtpVerified}
          onClose={() => {
            setShowOtpModal(false);
            setPendingRegistration(null);
          }}
        />
      )}
    </div>
  );
}
