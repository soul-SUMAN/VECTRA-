"use client";

import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiArrowSmRight, HiChartPie, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

const navItems = [
  { title: "Dashboard", to: "/admin", icon: HiChartPie },
  { title: "Manage Cars", to: "/admin/cars", icon: HiShoppingBag },
  { title: "Bookings", to: "/admin/bookings", icon: HiTable },
 
];

export default function AdminNavbar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--admin-sidebar-width", collapsed ? "4rem" : "16rem");
    }
  }, [collapsed]);

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-40 dark:bg-slate-900  text-white shadow-xl transition-all duration-200 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
      aria-label="Admin sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="relative border-b border-slate-800 px-3 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/VECTRA-LOGO.png"
              alt="VECTRA logo"
              className={`h-10 w-10 rounded-full border border-slate-700 transition-all duration-200 ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`text-lg font-semibold text-amber-400 transition-all duration-200 ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              VECTRA
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {collapsed ? (
              <HiArrowSmRight className="h-5 w-5" />
            ) : (
              <span className="text-base font-bold">×</span>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-1 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <NavLink
                    to={item.to}
                    className="group flex items-center gap-3 rounded-xl  px-3 py-3 text-sm text-slate-100 transition-colors hover:bg-amber-500 hover:text-slate-950"
                  >
                    <Icon className="h-5 w-5" />
                    <span className={`${collapsed ? "hidden" : "inline"}`}>{item.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className={`mb-3 rounded-md bg-amber-500/10 p-3 text-sm text-amber-200 ${collapsed ? "hidden" : "block"}`}>
            Preview the new dashboard navigation! You can turn the new navigation off for a limited time in your profile.
          </div>
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3 text-sm text-slate-100 transition-colors hover:bg-amber-500 hover:text-slate-950"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2L2 8v10h6V12h4v6h6V8L10 2z" />
            </svg>
            <span className={`${collapsed ? "hidden" : "inline"}`}>Back to Site</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}


