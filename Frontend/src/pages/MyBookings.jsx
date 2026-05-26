
import React, { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../api/bookingService";
import Toast from "../components/Toast";

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  Confirm:   { dot: "bg-green-400",  badge: "bg-green-500/15 border-green-500/30 text-green-400"  },
  Pending:   { dot: "bg-yellow-400", badge: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" },
  Cancelled: { dot: "bg-red-400",    badge: "bg-red-500/15 border-red-500/30 text-red-400"        },
  Completed: { dot: "bg-blue-400",   badge: "bg-blue-500/15 border-blue-500/30 text-blue-400"     },
};

// ─── Icon components ───────────────────────────────────────────────────────────
const CalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const PinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 17H5v-1.5A2.5 2.5 0 0 1 7.5 13h9a2.5 2.5 0 0 1 2.5 2.5V17Z"/>
    <path d="M5 17v2m14-2v2M7 13l1.5-5h7L17 13"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/>
  </svg>
);

// ─── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, onCancel }) {
  const status  = STATUS[booking.status] || STATUS.Pending;
  const canCancel = booking.status !== "Cancelled" && booking.status !== "Completed";

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800
                    shadow-lg transition-all duration-300 hover:border-slate-600 hover:shadow-slate-900/50 hover:shadow-2xl
                    flex flex-col sm:flex-row">

      {/* Image */}
      <div className="relative sm:w-56 shrink-0 overflow-hidden">
        <img
          src={booking.car?.image || "/placeholder-car.png"}
          alt={booking.car?.name}
          className="h-48 sm:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/20" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 gap-4">

        {/* Top row — name + status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">{booking.car?.name || "—"}</h3>
            <p className="text-slate-400 text-sm mt-0.5">
              {booking.car?.brand} {booking.car?.model ? `· ${booking.car.model}` : ""}
            </p>
          </div>
          <span className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {booking.status}
          </span>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-700/50 border border-slate-600/40 px-3 py-1.5 text-xs text-slate-300">
            <span className="text-yellow-500"><CalIcon /></span>
            {fmt(booking.startDate)} → {fmt(booking.endDate)}
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-700/50 border border-slate-600/40 px-3 py-1.5 text-xs text-slate-300">
            <span className="text-yellow-500"><CarIcon /></span>
            {booking.totalDay} day{booking.totalDay !== 1 ? "s" : ""}
          </div>
          {booking.pickupLocation && (
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-700/50 border border-slate-600/40 px-3 py-1.5 text-xs text-slate-300">
              <span className="text-yellow-500"><PinIcon /></span>
              {booking.pickupLocation}
            </div>
          )}
        </div>

        {/* Bottom — price + action */}
        <div className="flex items-center justify-between border-t border-slate-700/60 pt-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
            <p className="text-xl font-extrabold text-yellow-400">
              ₹{booking.totalPrice?.toLocaleString("en-IN")}
            </p>
          </div>
          {canCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10
                         px-4 py-2 text-sm font-semibold text-red-400 transition
                         hover:bg-red-500/20 hover:border-red-500/60 active:scale-95"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toast,    setToast]    = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId);
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: "Cancelled" } : b));
      setToast({ message: "Booking cancelled successfully", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Cancellation failed", type: "error" });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">My <span className="text-orange-500">Bookings</span></h2>
          <p className="mt-2 text-slate-400">Track and manage all your car rentals</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        {/* Empty */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🚗</p>
            <p className="text-slate-400 text-lg">No bookings yet.</p>
            <p className="text-slate-500 text-sm mt-1">Browse our fleet and book your first ride!</p>
          </div>
        )}

        {/* List */}
        {!loading && !error && bookings.length > 0 && (
          <>
            <p className="text-slate-500 text-sm mb-5">
              <span className="text-white font-semibold">{bookings.length}</span> booking{bookings.length !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-5">
              {bookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
              ))}
            </div>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}