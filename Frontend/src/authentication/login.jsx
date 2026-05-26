import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    // AuthContext.login() dispatches LOGIN_SUCCESS which updates isAuthenticated.
    // The useEffect above then fires and handles the redirect — no double navigate.
    if (!result.success) setSubmitting(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("username", form.username);
    formData.append("email",    form.email);
    formData.append("password", form.password);
    if (avatarFile) formData.append("avatar", avatarFile);

    const result = await register(formData);
    if (result.success) {
      // Switch to login tab so user can sign in with new credentials
      setActiveTab("login");
      setForm((prev) => ({ ...prev, fullname: "", username: "" }));
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
                  className="text-slate-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 py-3 bg-yellow-500 text-slate-900 rounded-lg font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating account..." : "Create account"}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
