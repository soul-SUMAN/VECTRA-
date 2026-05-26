

import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, clearWishlist } from "../api/wishlistService";
import BookingModal from "../components/BookingModal";
import Toast from "../components/Toast";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const FuelIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 22V8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14"/>
                        <path d="M14 10h2a2 2 0 0 1 2 2v3a1 1 0 0 0 2 0V9l-3-3"/>
                        <path d="M3 22h12"/>
                        <path d="M5 14h6"/>
                      </svg>;
const GearIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                      </svg>;
const SeatIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/>
                        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/>
                      </svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6m4-6v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>;


function Pill({ icon, label }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-slate-700/50 border border-slate-600/40 px-2.5 py-1.5 text-xs text-slate-300">
      <span className="text-yellow-500">{icon}</span>{label}
    </span>
  );
}

// ─── Wishlist Card ─────────────────────────────────────────────────────────────
function WishlistCard({ car, onRemove, onBook }) {
  const isAvailable = car.isAvailable !== false;

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800
                    shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30
                    hover:shadow-yellow-500/10 hover:shadow-2xl flex flex-col sm:flex-row">

      {/* Image */}
      <div className="relative sm:w-52 shrink-0 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="h-48 sm:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Availability badge */}
        <span className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm border ${
          isAvailable
            ? "bg-green-500/20 border-green-500/40 text-green-400"
            : "bg-red-500/20 border-red-500/40 text-red-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-green-400" : "bg-red-400"}`} />
          {isAvailable ? "Available" : "Unavailable"}
        </span>

        {/* Price over image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-extrabold text-white drop-shadow-lg">
            ₹{car.pricePerDay?.toLocaleString("en-IN")}
          </span>
          <span className="text-slate-300 text-xs"> /day</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">{car.name}</h3>
              <p className="text-slate-400 text-sm mt-0.5">
                {car.brand}{car.model ? ` · ${car.model}` : ""}{car.year ? ` · ${car.year}` : ""}
              </p>
            </div>
            <span className="shrink-0 rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs font-semibold text-yellow-400">
              {car.bodyType}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Pill icon={<FuelIcon />} label={car.fuelType} />
            <Pill icon={<GearIcon />} label={car.transmission} />
            <Pill icon={<SeatIcon />} label={`${car.seats} Seats`} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-slate-700/60 pt-4">
          <button
            onClick={() => onBook(car)}
            disabled={!isAvailable}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-bold transition active:scale-95 ${
              isAvailable
                ? "bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isAvailable ? "Book Now →" : "Unavailable"}
          </button>
          <button
            onClick={() => onRemove(car._id)}
            className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10
                       px-4 py-2.5 text-sm font-semibold text-red-400 transition
                       hover:bg-red-500/20 hover:border-red-500/60 active:scale-95"
          >
            <TrashIcon />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Wishlist() {
  const [wishlist,     setWishlist]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [toast,        setToast]        = useState(null);
  const [selectedCar,  setSelectedCar]  = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWishlist();
      setWishlist(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (carId) => {
    try {
      await removeFromWishlist(carId);
      setWishlist((prev) => prev.filter((car) => car._id !== carId));
      setToast({ message: "Removed from wishlist", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Remove failed", type: "error" });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear your entire wishlist?")) return;
    try {
      await clearWishlist();
      setWishlist([]);
      setToast({ message: "Wishlist cleared", type: "success" });
    } catch (err) {
      setToast({ message: "Could not clear wishlist", type: "error" });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-white">My <span className="text-orange-500">Wishlist</span></h2>
            <p className="mt-1 text-slate-400">Cars you've saved for later</p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10
                         px-4 py-2 text-sm font-semibold text-red-400 transition
                         hover:bg-red-500/20 hover:border-red-500/60"
            >
              <TrashIcon /> Clear All
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        {!loading && !error && wishlist.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🤍</p>
            <p className="text-slate-400 text-lg">Your wishlist is empty.</p>
            <p className="text-slate-500 text-sm mt-1">Browse cars and save the ones you love!</p>
          </div>
        )}

        {!loading && !error && wishlist.length > 0 && (
          <>
            <p className="text-slate-500 text-sm mb-5">
              <span className="text-white font-semibold">{wishlist.length}</span> car{wishlist.length !== 1 ? "s" : ""} saved
            </p>
            <div className="flex flex-col gap-5">
              {wishlist.map((car) => (
                <WishlistCard
                  key={car._id}
                  car={car}
                  onRemove={handleRemove}
                  onBook={setSelectedCar}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}