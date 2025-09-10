import React, { useState } from "react";

function Login() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="bg-[#0d0d0d] text-white font-sans min-h-screen justify-center  flex items-center">
      <section className="w-full max-w-sm mx-auto text-center bg-[#1a1a1a] p-8 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <h2 className="text-[22px] font-bold mb-5">My Account</h2>

        {/* Tabs */}
        <div className="flex justify-center border-b border-[#333] mb-6">
          <button
            className={`flex-1 py-3 text-[16px] transition-colors ${
              activeTab === "login"
                ? "font-bold border-b-2 border-yellow-500 text-white"
                : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-[16px] transition-colors ${
              activeTab === "signup"
                ? "font-bold border-b-2 border-yellow-500 text-white"
                : "text-[#aaa] hover:text-white"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        <div className="mt-5">
          {activeTab === "login" && (
            <form className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold mb-2 text-[#f1f1f1]">
                Login to your account
              </h3>
              <input
                type="email"
                placeholder="Email"
                required
                className="p-3 border border-[#333] rounded-lg text-sm bg-[#111] text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="p-3 border border-[#333] rounded-lg text-sm bg-[#111] text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                className="p-3 bg-orange-400 text-white rounded-lg text-[16px] font-medium transition-colors hover:bg-orange-500"
              >
                Login
              </button>

              {/* Divider */}
              <div className="relative my-2 text-sm text-[#888]">
                <span className="px-2 bg-[#1a1a1a] relative z-10">or</span>
                <div className="absolute top-1/2 left-0 w-2/5 h-px bg-[#333]" />
                <div className="absolute top-1/2 right-0 w-2/5 h-px bg-[#333]" />
              </div>

              {/* Social Login */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 text-[15px] rounded-lg border border-[#333] bg-[#111] text-white transition-colors hover:bg-[#222]"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 text-[15px] rounded-lg bg-yellow-500 text-white transition-colors hover:bg-yellow-600"
              >
                <img
                  src="https://www.svgrepo.com/show/349574/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Continue with Facebook
              </button>
            </form>
          )}
          {activeTab === "signup" && (
            <form className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold mb-2 text-[#f1f1f1]">
                Create an account
              </h3>
              <input
                type="text"
                placeholder="Full Name"
                required
                className="p-3 border border-[#333] rounded-lg text-sm bg-[#111] text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="p-3 border border-[#333] rounded-lg text-sm bg-[#111] text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="p-3 border border-[#333] rounded-lg text-sm bg-[#111] text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                className="p-3 bg-orange-400 text-white rounded-lg text-[16px] font-medium transition-colors hover:bg-orange-500"
              >
                Signup
              </button>

              {/* Divider */}
              <div className="relative my-2 text-sm text-[#888]">
                <span className="px-2 bg-[#1a1a1a] relative z-10">or</span>
                <div className="absolute top-1/2 left-0 w-2/5 h-px bg-[#333]" />
                <div className="absolute top-1/2 right-0 w-2/5 h-px bg-[#333]" />
              </div>

              {/* Social Signup */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 text-[15px] rounded-lg border border-[#333] bg-[#111] text-white transition-colors hover:bg-[#222]"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 text-[15px] rounded-lg bg-yellow-500 text-white transition-colors hover:bg-yellow-600"
              >
                <img
                  src="https://www.svgrepo.com/show/349574/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Continue with Facebook
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default Login;