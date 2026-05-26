
import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminBookings, updateBookingStatus } from "../api/bookingService";
import Toast from "../components/Toast";

const STATUS_CONFIG = {
  Confirm:   { dot: "bg-green-400",  badge: "bg-green-500/15 border-green-500/30 text-green-400"   },
  Pending:   { dot: "bg-yellow-400", badge: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" },
  Cancelled: { dot: "bg-red-400",    badge: "bg-red-500/15 border-red-500/30 text-red-400"          },
  Completed: { dot: "bg-blue-400",   badge: "bg-blue-500/15 border-blue-500/30 text-blue-400"       },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toast,    setToast]    = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAdminBookings();
        setBookings(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: newStatus } : b));
      setToast({ message: "Status updated successfully", type: "success" });
    } catch {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
           style={{ marginLeft: "var(--admin-sidebar-width, 16rem)" }}>
        <div className="max-w-screen-xl mx-auto space-y-6">

          <div>
            <h1 className="text-3xl font-extrabold text-white">Manage <span className="text-orange-500">Bookings</span></h1>
            <p className="text-slate-400 mt-1">View and update all customer bookings</p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📋</p>
              <p className="text-slate-400 text-lg">No bookings found.</p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="rounded-3xl border border-slate-700/60 bg-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-700/60 bg-slate-900/60">
                      {["User","Car","Dates","Days","Amount","Status","Update"].map((h) => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {bookings.map((booking) => {
                      const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Pending;
                      return (
                        <tr key={booking._id} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-sm font-semibold text-white">{booking.user?.fullname || "—"}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{booking.user?.email || ""}</p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {booking.car?.image && (
                                <img src={booking.car.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-600" />
                              )}
                              <p className="text-sm font-semibold text-white">{booking.car?.name || "—"}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300">
                            {fmt(booking.startDate)} → {fmt(booking.endDate)}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300">
                            {booking.totalDay}d
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-yellow-400">
                              ₹{booking.totalPrice?.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${sc.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className="rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2
                                         focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            >
                              {["Pending","Confirm","Cancelled","Completed"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}