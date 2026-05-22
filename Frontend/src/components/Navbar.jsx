import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        <HashLink smooth to="/#home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/VECTRA-LOGO.png" className="h-9 rounded-full" alt="Vectra Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">VECTRA</span>
        </HashLink>

                {/* User Menu */}
        <div className="flex items-center md:pl-30 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm  bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-9 h-9 rounded-full"
              src="/boy.png"
              alt="user photo"
            />
          </button>

          {/* Dropdown */}
          <div
            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                Bonnie Green
              </span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                name@flowbite.com
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>


        <div className="flex items-center gap-2 md:order-2">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-user"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Toggle main menu</span>
            {mobileOpen ? <span className="text-2xl leading-none">×</span> : (
              <svg className="h-5 w-5" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        <div className={`w-full md:flex md:w-auto md:order-1 ${mobileOpen ? "block" : "hidden"}`} id="navbar-user">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-900 md:border-0 md:p-0 md:bg-transparent">
            <ul className="flex flex-col gap-2 font-medium md:flex-row md:items-center md:gap-6">
              <li>
                <NavLink
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
                      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
                    }`
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cars"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
                      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
                    }`
                  }
                >
                  Cars
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/bookings"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
                      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
                    }`
                  }
                >
                  My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
                      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
                    }`
                  }
                >
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
              <li>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm py-2 px-3 transition-colors hover:text-yellow-300 ${
                      isActive ? "text-yellow-500" : "text-slate-900 dark:text-white"
                    }`
                  }
                >
                  Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
