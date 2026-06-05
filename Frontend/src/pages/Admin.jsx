import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminDashboard } from "../api/dashboardService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const CarIcon     = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 17H5v-1.5A2.5 2.5 0 0 1 7.5 13h9a2.5 2.5 0 0 1 2.5 2.5V17Z"/>
                          <path d="M5 17v2m14-2v2M7 13l1.5-5h7L17 13"/>
                          <circle cx="8" cy="17" r="1.5"/>
                          <circle cx="16" cy="17" r="1.5"/>
                          </svg>;
const BookIcon    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          </svg>;
const MoneyIcon   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>;
const UserIcon    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>;
const ClockIcon   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                          </svg>;

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub }) {
  const a = {
    yellow: { icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500", value: "text-yellow-400" },
    green:  { icon: "bg-green-500/10 border-green-500/20 text-green-500",    value: "text-green-400"  },
    purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-500", value: "text-purple-400" },
    blue:   { icon: "bg-blue-500/10 border-blue-500/20 text-blue-500",       value: "text-blue-400"   },
    red:    { icon: "bg-red-500/10 border-red-500/20 text-red-500",          value: "text-red-400"    },
  }[accent];

  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-800 p-6 shadow-xl
                    transition-all duration-300 hover:-translate-y-1 hover:border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${a.icon}`}>
          {icon}
        </span>
      </div>
      <p className={`text-3xl font-extrabold ${a.value}`}>{value ?? "—"}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Custom Tooltip for chart ──────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 shadow-xl">
      <p className="text-yellow-400 font-bold text-sm">{label}</p>
      <p className="text-white text-sm">{payload[0].value} bookings</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Admin() {
  const [stats,   setStats]   = useState(null);
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

  return (
    <>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
           style={{ marginLeft: "var(--admin-sidebar-width, 16rem)" }}>
        <div className="max-w-screen-xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Admin <span className="text-orange-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-1">Real-time overview of your platform</p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && stats && (
            <>
              {/* ── Stat Cards ──────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total Cars"      value={stats.totalCars}      icon={<CarIcon />}   accent="yellow" />
                <StatCard label="Total Bookings"  value={stats.totalBookings}  icon={<BookIcon />}  accent="green" />
                <StatCard label="Total Revenue"   value={`₹${stats.totalRevenue?.toLocaleString("en-IN")}`} icon={<MoneyIcon />} accent="purple" />
                <StatCard label="Total Users"     value={stats.totalUsers}     icon={<UserIcon />}  accent="blue" />
                <StatCard label="Pending"         value={stats.pendingBookings} icon={<ClockIcon />} accent="red" sub="Needs your action" />
              </div>

              {/* ── Charts row ──────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Bookings per month bar chart */}
                <div className="lg:col-span-2 rounded-3xl border border-slate-700/60 bg-slate-800 p-6 shadow-xl">
                  <h2 className="text-base font-bold text-white mb-6">Bookings Per Month</h2>
                  {stats.bookingsPerMonth?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.bookingsPerMonth} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                        <Bar dataKey="bookings" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-slate-500">No booking data yet</div>
                  )}
                </div>

                {/* Top cars */}
                <div className="rounded-3xl border border-slate-700/60 bg-slate-800 p-6 shadow-xl">
                  <h2 className="text-base font-bold text-white mb-5">Top Booked Cars</h2>
                  {stats.topCars?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.topCars.map((car, i) => (
                        <div key={car._id} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 w-4">#{i + 1}</span>
                          {car.image && (
                            <img src={car.image} alt={car.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{car.name}</p>
                            <p className="text-xs text-slate-500">{car.bookings} booking{car.bookings !== 1 ? "s" : ""}</p>
                          </div>
                          <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${(car.bookings / stats.topCars[0].bookings) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-slate-500">No data yet</div>
                  )}
                </div>
              </div>

              {/* ── Pending alert ────────────────────────────────────────── */}
              {stats.pendingBookings > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClockIcon />
                    <div>
                      <p className="text-yellow-400 font-bold">
                        {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? "s" : ""} waiting for your confirmation
                      </p>
                      <p className="text-slate-400 text-sm">Review and confirm to send customer their confirmation email.</p>
                    </div>
                  </div>
                  
                  <a href="/admin/bookings"
                    className="shrink-0 px-5 py-2.5 rounded-2xl bg-yellow-500 text-slate-900 font-bold text-sm hover:bg-yellow-400 transition"
                  >
                    Review Now →
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}