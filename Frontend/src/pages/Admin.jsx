
import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminDashboard } from "../api/dashboardService";

const CarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 17H5v-1.5A2.5 2.5 0 0 1 7.5 13h9a2.5 2.5 0 0 1 2.5 2.5V17Z"/>
                        <path d="M5 17v2m14-2v2M7 13l1.5-5h7L17 13"/><circle cx="8" cy="17" r="1.5"/>
                        <circle cx="16" cy="17" r="1.5"/>
                      </svg>;
const BookIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>;
const MoneyIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>;


export default function Admin() {
  const [stats,   setStats]   = useState({ totalCars: 0, totalBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const CARDS = [
    { label: "Total Cars",     value: stats.totalCars,     icon: <CarIcon />,   accent: "yellow", glow: "yellow-500" },
    { label: "Total Bookings", value: stats.totalBookings, icon: <BookIcon />,  accent: "green",  glow: "green-500"  },
    { label: "Total Revenue",  value: `₹${stats.totalRevenue?.toLocaleString("en-IN")}`, icon: <MoneyIcon />, accent: "purple", glow: "purple-500" },
  ];

  const accentMap = {
    yellow: { icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500", value: "text-yellow-400", glow: "shadow-yellow-500/10" },
    green:  { icon: "bg-green-500/10 border-green-500/20 text-green-500",    value: "text-green-400",  glow: "shadow-green-500/10"  },
    purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-500", value: "text-purple-400", glow: "shadow-purple-500/10" },
  };

  return (
    <>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
           style={{ marginLeft: "var(--admin-sidebar-width, 16rem)" }}>
        <div className="max-w-screen-xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-extrabold text-white">Admin <span className="text-orange-500">Dashboard</span></h1>
            <p className="text-slate-400 mt-1">Overview of your platform performance</p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {CARDS.map(({ label, value, icon, accent }) => {
                const a = accentMap[accent];
                return (
                  <div key={label}
                    className={`rounded-3xl border border-slate-700/60 bg-slate-800 p-6 shadow-xl ${a.glow} transition-all duration-300 hover:-translate-y-1 hover:border-slate-600`}>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${a.icon}`}>
                        {icon}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold ${a.value}`}>{value ?? "—"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}