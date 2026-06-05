import React, { useEffect, useState } from "react";
import { createBooking } from "../api/bookingService";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api/paymentService";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const DRIVER_CHARGE_PER_DAY = 500; // ₹500/day — adjust to match your backend

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400 text-lg">{icon}</span>
      <span className="text-slate-400 text-xs uppercase tracking-wide">{label}</span>
      <span className="ml-auto text-white text-sm font-medium">{value}</span>
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────
export default function BookingModal({ car, onClose }) {
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    numberOfCars: 1,
    requiredDriver: false,
    pickupLocation: "",
    dropLocation: "",
    paymentMethod: "Online",
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [booked, setBooked] = useState(false);

  // ── Lock body scroll while modal is open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Close on Escape key ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // ── Derived totals ────────────────────────────────────────────────────────
  const days = daysBetween(form.startDate, form.endDate);
  const carTotal = days * car.pricePerDay * form.numberOfCars;
  const driverTotal = form.requiredDriver ? days * DRIVER_CHARGE_PER_DAY * form.numberOfCars : 0;
  const grandTotal = carTotal + driverTotal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ─── Load Razorpay script dynamically ─────────────────────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Replace handleSubmit entirely ────────────────────────────────────────────
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated) {
    setToast({ message: "Please login to book a car", type: "error" });
    return;
  }
  if (days <= 0) {
    setToast({ message: "Drop-off date must be after pickup date", type: "error" });
    return;
  }
  if (!form.pickupLocation.trim()) {
    setToast({ message: "Please enter a pickup location", type: "error" });
    return;
  }

  setSubmitting(true);

  try {
    // ─── CASE A: CASH ON DELIVERY (NO RAZORPAY NEEDED) ───────────────────────
    if (form.paymentMethod === "Cash") {
      await createBooking({
        car:            car._id,
        startDate:      form.startDate,
        endDate:        form.endDate,
        requiredDriver: form.requiredDriver,
        pickupLocation: form.pickupLocation,
        totalDay:       days,
        totalPrice:     grandTotal,
        paymentMethod:  form.paymentMethod,
        dropLocation:   form.dropLocation,
      });

      setBooked(true);
      setSubmitting(false);
      return;
    }

    // ─── CASE B: ONLINE PAYMENT (RAZORPAY FIRST) ─────────────────────────────
    // Step 1: Create a standalone Razorpay order by passing the amount
    const orderRes = await createRazorpayOrder({ 
      amount: grandTotal, 
      carId:  car._id 
    });
    const { orderId, amount, currency, keyId } = orderRes.data.data;

    // Step 2: Load Razorpay script onto the window layout
    const loaded = await loadRazorpay();
    if (!loaded) {
      setToast({ message: "Payment gateway failed to load. Try again.", type: "error" });
      setSubmitting(false);
      return;
    }

    // Step 3: Open Razorpay checkout interface immediately
    const options = {
      key:      keyId,
      amount,
      currency,
      name:     "VECTRA",
      description: `${car.name} — ${days} day${days !== 1 ? "s" : ""}`,
      image:    "/VECTRA-LOGO.png",
      order_id: orderId,
      theme:    { color: "#f59e0b" },
      prefill: {
        name:  user?.fullname,
        email: user?.email,
      },
      handler: async (response) => {
        // Step 4: Run verification AND create the database booking record after success
        try {
          await verifyAndCreateBooking({
            // Payment signatures:
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            // Form booking details:
            car:            car._id,
            startDate:      form.startDate,
            endDate:        form.endDate,
            requiredDriver: form.requiredDriver,
            pickupLocation: form.pickupLocation,
            totalDay:       days,
            totalPrice:     grandTotal,
            paymentMethod:  form.paymentMethod,
            dropLocation:   form.dropLocation,
          });

          setBooked(true);
        } catch (err) {
          setToast({ 
            message: err.response?.data?.message || "Payment verified but booking registration failed. Contact support.", 
            type: "error" 
          });
        }
        setSubmitting(false);
      },
      modal: {
        ondismiss: () => {
          setToast({ message: "Payment cancelled", type: "info" });
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    setToast({
      message: err.response?.data?.message || "Something went wrong. Try again.",
      type: "error",
    });
    setSubmitting(false);
  }
};

  const inputClass =
    "w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-yellow-400 transition";

  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1";

  // ── Success state ─────────────────────────────────────────────────────────
  if (booked) {
    return (
      <Overlay onClose={onClose}>
        <div className="flex flex-col items-center justify-center gap-5 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-white">Payment Received! 🎉</h2>
            <p className="text-slate-400">
              Your payment of <span className="text-yellow-400 font-semibold">{fmt(grandTotal)}</span> for{" "}
              <span className="text-yellow-400 font-semibold">{car.name}</span> has been received.
            </p>
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm text-yellow-300 text-center">
              ⏳ Your booking is <strong>Pending</strong> confirmation from the car owner. You'll receive an email once it's confirmed.
            </div>
          <button
            onClick={onClose}
            className="mt-2 px-8 py-3 rounded-2xl bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 transition"
          >
            Done
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
          <h2 className="text-xl font-bold text-white">Book this Car</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex gap-4 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
            <img src={car.image} alt={car.name} className="w-32 h-24 object-cover shrink-0" />
            <div className="flex flex-col justify-center gap-1 py-2 pr-4">
              <h3 className="text-lg font-bold text-white leading-tight">{car.name}</h3>
              <p className="text-slate-400 text-sm">{car.brand} · {car.bodyType} · {car.year}</p>
              <p className="text-yellow-400 font-bold text-sm">{fmt(car.pricePerDay)} / day</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pickup Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                min={today()}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Drop-off Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate || today()}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="Enter city or address"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Drop-off Location</label>
            <input
              type="text"
              name="dropLocation"
              value={form.dropLocation}
              onChange={handleChange}
              placeholder="Enter city or address"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Number of Cars</label>
              <input
                type="number"
                name="numberOfCars"
                value={form.numberOfCars}
                min={1}
                max={car.availableQuantity || 10}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div
              onClick={() => setForm((prev) => ({ ...prev, requiredDriver: !prev.requiredDriver }))}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                form.requiredDriver
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-slate-700 bg-slate-900 hover:border-slate-500"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-white">Driver</p>
                <p className="text-xs text-slate-400">{fmt(DRIVER_CHARGE_PER_DAY)}/day</p>
              </div>
              <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${
                form.requiredDriver ? "bg-yellow-500 justify-end" : "bg-slate-700 justify-start"
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-wide">Price Breakdown</p>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{fmt(car.pricePerDay)} × {days || 0} day{days !== 1 ? "s" : ""} × {form.numberOfCars} car{form.numberOfCars > 1 ? "s" : ""}</span>
              <span className="text-white">{fmt(carTotal)}</span>
            </div>
            {form.requiredDriver && (
              <div className="flex justify-between text-sm text-slate-400">
                <span>Driver ({fmt(DRIVER_CHARGE_PER_DAY)}/day × {days || 0} days × {form.numberOfCars})</span>
                <span className="text-white">{fmt(driverTotal)}</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span className="font-bold text-white">Total</span>
              <span className="text-xl font-bold text-yellow-400">{fmt(grandTotal)}</span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {["Online", "Cash", "Card"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                    form.paymentMethod === method
                      ? "bg-yellow-500 border-yellow-500 text-slate-900"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {method === "Online" ? "💳 Online" : method === "Cash" ? "💵 Cash" : "🏦 Card"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Total Amount</span>
            <span className="text-2xl font-bold text-yellow-400">{fmt(grandTotal)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting || days <= 0}
            className="w-full py-3 rounded-2xl bg-yellow-500 text-slate-900 font-bold text-base hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Confirming Booking..." : `Confirm & Pay ${grandTotal > 0 ? fmt(grandTotal) : ""}`}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Overlay>
  );
}

// ─── Overlay wrapper ──────────────────────────────────────────────────────────
function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
