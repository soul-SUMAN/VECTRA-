

import React, { useEffect, useState } from "react";
import { getAllCars } from "../api/carService";
import { addToWishlist } from "../api/wishlistService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import BookingModal from "../components/BookingModal";
import { getWishlist } from "../api/wishlistService";

// ─── Icons ────────────────────────────────────────────────────────────────────
const FuelIcon   = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 22V8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14"/>
                          <path d="M14 10h2a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1 1 1 0 0 0 1-1V9l-3-3"/>
                          <path d="M3 22h12"/><path d="M5 14h6"/>
                        </svg>;
const GearIcon   = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                        </svg>;
const SeatIcon   = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/>
                          <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/>
                        </svg>;
const PinIcon    = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>;
const HeartIcon  = ({ filled }) => <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">    
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                  </svg>;

// ─── Spec Pill ────────────────────────────────────────────────────────────────
function Pill({ icon, label }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-slate-700/50 border border-slate-600/40 px-2.5 py-1.5 text-xs text-slate-300">
      <span className="text-yellow-500">{icon}</span>
      {label}
    </span>
  );
}

// ─── Car Card ─────────────────────────────────────────────────────────────────
function CarCard({ car, onBook, onWishlist, wishlisted }) {
  const isAvailable = car.isAvailable !== false;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800
                    shadow-lg transition-all duration-300
                    hover:-translate-y-1.5 hover:border-yellow-500/30 hover:shadow-yellow-500/10 hover:shadow-2xl">

      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden h-52">
        <img
          src={car.image}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark gradient at bottom of image so text overlays cleanly */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Availability badge — top left */}
        <span className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-lg backdrop-blur-sm ${
          isAvailable
            ? "bg-green-500/20 border border-green-500/40 text-green-400"
            : "bg-red-500/20 border border-red-500/40 text-red-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
          {isAvailable ? "Available" : "Unavailable"}
        </span>

        {/* Body type — top right */}
        <span className="absolute top-3 right-3 rounded-full bg-slate-900/70 border border-slate-600/50 px-3 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
          {car.bodyType}
        </span>

        {/* Wishlist button — bottom right over image */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(car._id); }}
          className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${
            wishlisted
              ? "bg-red-500/30 border-red-500/50 text-red-400"
              : "bg-slate-900/60 border-slate-600/50 text-slate-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
          }`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Price floating over bottom-left of image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-2xl font-extrabold text-white drop-shadow-lg">
            ₹{car.pricePerDay?.toLocaleString("en-IN")}
          </span>
          <span className="text-slate-300 text-xs"> /day</span>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Name + Brand row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{car.name}</h3>
            <p className="text-slate-400 text-sm mt-0.5">
              {car.brand}
              {car.model ? ` · ${car.model}` : ""}
              {car.year  ? ` · ${car.year}`  : ""}
            </p>
          </div>

          {/* Engine badge */}
          {car.engine && (
            <span className="shrink-0 rounded-xl bg-slate-700/50 border border-slate-600/40 px-2.5 py-1 text-xs font-bold text-slate-300">
              {car.engine} cc
            </span>
          )}
        </div>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-2">
          <Pill icon={<FuelIcon />} label={car.fuelType} />
          <Pill icon={<GearIcon />} label={car.transmission} />
          <Pill icon={<SeatIcon />} label={`${car.seats} Seats`} />
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-yellow-500"><PinIcon /></span>
            {car.location}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-700/60 mt-auto" />

        {/* Book button */}
        <button
          onClick={() => onBook(car)}
          disabled={!isAvailable}
          className={`w-full rounded-2xl py-2.5 text-sm font-bold transition active:scale-95 ${
            isAvailable
              ? "bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "Book Now →" : "Not Available"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Cars() {
  const { isAuthenticated } = useAuth();

  const [cars,        setCars]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [toast,       setToast]       = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [wishlisted,  setWishlisted]  = useState({});   // { carId: true }

  const [filters, setFilters] = useState({
    keyword: "", bodyType: "", fuelType: "", transmission: "", sortBy: "",
  });

  const fetchCars = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCars(params);
      setCars(res.data.data?.docs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars(filters);
  };


  useEffect(() => {
    if (!isAuthenticated) return;
    const seedWishlist = async () => {
      try {
        const res = await getWishlist();
        const items = res.data.data || [];
        // Build { carId: true } map from DB wishlist
        const map = {};
        items.forEach((item) => {
          const id = item._id || item.car?._id;
          if (id) map[id] = true;
        });
        setWishlisted(map);
      } catch {
        // silently fail — wishlist state just stays empty
      }
    };
    seedWishlist();
  }, [isAuthenticated]);

  const handleWishlist = async (carId) => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to add to wishlist", type: "info" });
      return;
    }
    try {
      await addToWishlist(carId);
      setWishlisted((prev) => ({ ...prev, [carId]: !prev[carId] }));
      setToast({ message: wishlisted[carId] ? "Removed from wishlist" : "Added to wishlist!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Could not update wishlist", type: "error" });
    }
  };

  const handleBookNow = (car) => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to book a car", type: "info" });
      return;
    }
    if (car.isAvailable === false) {
      setToast({ message: "This car is currently unavailable", type: "error" });
      return;
    }
    setSelectedCar(car);
  };

  const FILTER_SELECTS = [
    { name: "bodyType",     label: "Body Type",    opts: ["SUV","Sedan","Hatchback","MUV","Luxury","Coupe","Pickup Truck","Minivan","Wagon","Convertible","Vintage"] },
    { name: "fuelType",     label: "Fuel",         opts: ["Petrol","Diesel","CNG","Electric"] },
    { name: "transmission", label: "Transmission", opts: ["Manual","Automatic"] },
    { name: "sortBy",       label: "Sort By",      opts: ["priceLow","priceHigh"] },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">
            Our <span className="text-orange-500">Fleet</span>
          </h2>
          <p className="mt-2 text-slate-400">Find and book the perfect car for your journey</p>
        </div>

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSearch}
          className="mb-10 rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 flex flex-wrap gap-3 items-center"
        >
          {/* Search input */}
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Search by name or brand..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm "
            />
          </div>

          {FILTER_SELECTS.map(({ name, label, opts }) => (
            <select
              key={name}
              name={name}
              value={filters[name]}
              onChange={handleFilterChange}
              className="rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">{label}</option>
              {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-900 font-bold text-sm hover:bg-yellow-400 transition"
          >
            Search
          </button>
        </form>

        {/* ── States ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-slate-400 text-lg">No cars found matching your filters.</p>
            <button onClick={() => { setFilters({ keyword:"",bodyType:"",fuelType:"",transmission:"",sortBy:"" }); fetchCars(); }} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm">
              Clear filters
            </button>
          </div>
        )}

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {!loading && !error && cars.length > 0 && (
          <>
            <p className="text-slate-500 text-sm mb-5">
              Showing <span className="text-white font-semibold">{cars.length}</span> car{cars.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard
                  key={car._id}
                  car={car}
                  onBook={handleBookNow}
                  onWishlist={handleWishlist}
                  wishlisted={!!wishlisted[car._id]}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}