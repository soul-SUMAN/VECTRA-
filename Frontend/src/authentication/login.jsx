import React, { useState } from "react";

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", fullname: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder: call API login/register
    console.log(activeTab, form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1220] to-[#0d0d0d] font-sans px-4">
      <section className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="md:grid md:grid-cols-2">
          <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-slate-800 to-slate-900">
            <img src="/VECTRA-LOGO.png" alt="logo" className="w-20 h-20 rounded-full mb-4" />
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-slate-300 text-center max-w-xs">Rent the car you love. Manage bookings, wishlist and more from your account.</p>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl text-white font-semibold">My Account</h3>
              <div className="flex gap-2 bg-slate-800 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`px-4 py-2 rounded-full text-sm ${activeTab === "login" ? "bg-yellow-500 text-slate-900 font-semibold" : "text-slate-300 hover:text-white"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`px-4 py-2 rounded-full text-sm ${activeTab === "signup" ? "bg-yellow-500 text-slate-900 font-semibold" : "text-slate-300 hover:text-white"}`}
                >
                  Signup
                </button>
              </div>
            </div>

            {activeTab === "login" ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="text-sm text-slate-300">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

                <label className="text-sm text-slate-300">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

                <button type="submit" className="mt-2 py-3 bg-yellow-500 text-slate-900 rounded-lg font-medium shadow-sm">Sign in</button>

                <div className="flex items-center gap-3 text-sm text-slate-400 mt-3">
                  <div className="h-px bg-slate-700 flex-1" />
                  <span>or continue with</span>
                  <div className="h-px bg-slate-700 flex-1" />
                </div>

                <div className="flex gap-3 mt-3">
                  <button type="button" className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">Google</button>
                  <button type="button" className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">GitHub</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="text-sm text-slate-300">Full name</label>
                <input name="fullname" value={form.fullname} onChange={handleChange} required type="text" className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

                <label className="text-sm text-slate-300">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

                <label className="text-sm text-slate-300">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

                <div className="flex items-center gap-3 text-sm text-slate-400 mt-3">
                  <div className="h-px bg-slate-700 flex-1" />
                  <span>or continue with</span>
                  <div className="h-px bg-slate-700 flex-1" />
                </div>

                <div className="flex gap-3 mt-3">
                  <button type="button" className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">Google</button>
                  <button type="button" className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">GitHub</button>
                </div>

                <button type="submit" className="mt-2 py-3 bg-yellow-500 text-slate-900 rounded-lg font-medium shadow-sm">Create account</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;