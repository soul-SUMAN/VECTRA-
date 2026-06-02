
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
    }`;

  // user.role comes from your userSchema enum: "user" | "admin"
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">

        {/* ── Logo ────────────────────────────────────────────────────────── */}
        <HashLink smooth to="/#home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/VECTRA-LOGO.png" className="h-9 rounded-full" alt="Vectra Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">VECTRA</span>
        </HashLink>

        {/* ── Right side: avatar + mobile toggle ──────────────────────────── */}
        <div className="flex items-center gap-3 md:order-2">

          {/* Avatar / dropdown — only show once session check is done */}
          {!loading && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded={dropdownOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-9 h-9 rounded-full object-cover"
                  src={user?.avatar || "/boy.png"}
                  alt="user photo"
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  {isAuthenticated ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-3">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.fullname}
                        </span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          {user?.email}
                        </span>
                        {/* Role badge */}
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isAdmin ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </div>

                      <ul className="py-2">
                        <li>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/bookings"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            My Bookings
                          </Link>
                        </li>
                        {/* Admin panel link — only for admins */}
                        {isAdmin && (
                          <li>
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Admin Panel
                            </Link>
                          </li>
                        )}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/login"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200"
                        >
                          Sign in
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-user"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Toggle main menu</span>
            {mobileOpen ? (
              <span className="text-2xl leading-none">×</span>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Nav Links ───────────────────────────────────────────────────── */}
        <div
          className={`w-full md:flex md:w-auto md:order-1 ${mobileOpen ? "block" : "hidden"}`}
          id="navbar-user"
        >
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-900 md:border-0 md:p-0 md:bg-transparent">
            <ul className="flex flex-col gap-2 font-medium md:flex-row md:items-center md:gap-6">
              <li>
                <NavLink to="/" end onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/cars" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  Cars
                </NavLink>
              </li>
              <li>
                <NavLink to="/bookings" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  Wishlist
                </NavLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="/#about"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm py-2 px-3 text-slate-900 transition-colors hover:text-yellow-300 dark:text-white"
                >
                  About Us
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm py-2 px-3 text-slate-900 transition-colors hover:text-yellow-300 dark:text-white"
                >
                  Contact
                </HashLink>
              </li>

              {/* Admin link in mobile nav — only for admins */}
              {isAdmin && (
                <li>
                  <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
}

