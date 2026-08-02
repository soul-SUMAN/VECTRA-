

import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { getMyCars, addCar, updateCarData, deleteCar } from "../api/carService";
import Toast from "../components/Toast";

const emptyForm = { name: "", 
                    pricePerDay: "", 
                    bodyType: "", 
                    brand: "", 
                    model: "", 
                    year: "",
                    fuelType: "", 
                    transmission: "", 
                    seats: "", 
                    engine: "", 
                    location: "",
                    quantity: ""
                  };

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">                     <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6m4-6v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>;
const PlusIcon  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>;


export default function AdminCars() {
  const [cars,      setCars]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [toast,     setToast]     = useState(null);
  const [newCar,    setNewCar]    = useState(emptyForm);
  const [editForm,  setEditForm]  = useState(emptyForm);
  const [editingCar, setEditingCar] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [adding,    setAdding]    = useState(false);

  const fetchCars = async () => {
    try {
      const res = await getMyCars();
      setCars(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleFormChange = (e) => {
    setNewCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (car) => {
    setEditingCar(car);
    setEditForm({
      name: car.name || "",
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      pricePerDay: car.pricePerDay || "",
      seats: car.seats || "",
      engine: car.engine || "",
      location: car.location || "",
      bodyType: car.bodyType || "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      quantity: car.quantity !== undefined && car.quantity !== null ? String(car.quantity) : "",
      isAvailable: car.isAvailable !== false,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddCar = async () => {
    if (!imageFile) {
      setToast({ message: "Car image is required", type: "error" });
      return;
    }

    const rawQty = String(newCar.quantity ?? "").trim();
    if (rawQty === "") {
      setToast({ message: "Please enter the available quantity", type: "error" });
      return;
    }

    const parsedQuantity = Number(rawQty);
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      setToast({ message: "Quantity must be a valid non-negative number", type: "error" });
      return;
    }

    const formData = new FormData();

    Object.entries(newCar).forEach(([k, v]) => {
      if (k === "quantity") {
        formData.append("quantity", String(parsedQuantity));
      } else {
        formData.append(k, v ?? "");
      }
    });
    formData.append("image", imageFile);
    setAdding(true);
    try {
      await addCar(formData);
      setToast({ message: "Car added successfully!", type: "success" });
      setNewCar(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      fetchCars();
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to add car", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateCar = async () => {
    if (!editingCar) return;
    setAdding(true);
    try {
      const payload = {};

      if (editForm.name) payload.name = editForm.name;
      if (editForm.brand) payload.brand = editForm.brand;
      if (editForm.model) payload.model = editForm.model;
      if (editForm.bodyType) payload.bodyType = editForm.bodyType;
      if (editForm.fuelType) payload.fuelType = editForm.fuelType;
      if (editForm.transmission) payload.transmission = editForm.transmission;
      if (editForm.location) payload.location = editForm.location;

      if (editForm.year !== "") payload.year = Number(editForm.year);
      if (editForm.pricePerDay !== "") payload.pricePerDay = Number(editForm.pricePerDay);
      if (editForm.seats !== "") payload.seats = Number(editForm.seats);
      if (editForm.engine !== "") payload.engine = Number(editForm.engine);

      const qty = Number(editForm.quantity);
      if (!Number.isNaN(qty) && editForm.quantity !== "") {
        payload.quantity = qty;
      }

      payload.isAvailable = Boolean(editForm.isAvailable);

      console.log("handleUpdateCar payload:", JSON.stringify(payload));

      await updateCarData(editingCar._id, payload);
      setToast({ message: "Car updated successfully!", type: "success" });
      setEditingCar(null);
      setEditForm(emptyForm);
      fetchCars();
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to update car", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
    setEditForm(emptyForm);
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await deleteCar(carId);
      setCars((prev) => prev.filter((c) => c._id !== carId));
      setToast({ message: "Car deleted", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Delete failed", type: "error" });
    }
  };

  const inputCls = "w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition";

  const TEXT_FIELDS = [
    { name: "name",        placeholder: "Car Name *", type: "text" },
    { name: "brand",       placeholder: "Brand *", type: "text" },
    { name: "model",       placeholder: "Model", type: "text" },
    { name: "year",        placeholder: "Year", type: "number", min: "1900", step: "1" },
    { name: "pricePerDay", placeholder: "Price / day (₹) *", type: "number", min: "0", step: "1" },
    { name: "seats",       placeholder: "Seats *", type: "number", min: "1", step: "1" },
    { name: "engine",      placeholder: "Engine (cc)", type: "number", min: "0", step: "1" },
    { name: "location",    placeholder: "Location", type: "text" },
    { name: "quantity", placeholder: "Available Quantity *", type: "text", min: "0", step: "1" },
  ];

  const SELECT_FIELDS = [
    { name: "bodyType", label: "Body Type *", opts: ["SUV","Sedan","Hatchback","MUV","Luxury","Coupe","Pickup Truck","Minivan","Wagon","Convertible","Vintage"] },
    { name: "fuelType", label: "Fuel Type *", opts: ["Petrol","Diesel","CNG","Electric"] },
    { name: "transmission", label: "Transmission *", opts: ["Manual","Automatic"] },
  ];

  return (
    <div>
      <AdminNavbar />
      <div className="bg-slate-950 min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
           style={{ marginLeft: "var(--admin-sidebar-width, 16rem)" }}>
        <div className="max-w-screen-xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-extrabold text-white">Manage <span className="text-orange-500">Cars</span></h1>
            <p className="text-slate-400 mt-1">Add, view, and remove cars from your fleet</p>
          </div>

          {/* ── Add Car Form ─────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-slate-700/60 bg-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                <PlusIcon />
              </span>
              <h2 className="text-base font-bold text-white">Add New Car</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {TEXT_FIELDS.map(({ name, placeholder, type, min, step }) => (
                  <input key={name} name={name} value={newCar[name]} onChange={handleFormChange}
                    placeholder={placeholder} type={type || "text"} min={min} step={step} className={inputCls} />
                ))}
                {SELECT_FIELDS.map(({ name, label, opts }) => (
                  <select key={name} name={name} value={newCar[name]} onChange={handleFormChange} className={inputCls}>
                    <option value="">{label}</option>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
              </div>

              {/* Image upload */}
              <div className="mt-5 flex flex-col sm:flex-row items-start gap-4">
                <label className="flex flex-col items-center justify-center w-40 h-28 rounded-2xl border-2 border-dashed border-slate-600
                                  bg-slate-900 cursor-pointer hover:border-yellow-500/50 hover:bg-slate-800 transition overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="text-slate-500 text-2xl mb-1">📷</span>
                      <span className="text-xs text-slate-500">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                <button
                  onClick={handleAddCar}
                  disabled={adding}
                  className="flex items-center gap-2 rounded-2xl bg-yellow-500 px-6 py-3 text-slate-900 font-bold text-sm
                             hover:bg-yellow-400 transition active:scale-95 shadow-lg shadow-yellow-500/20
                             disabled:opacity-60 disabled:cursor-not-allowed self-end"
                >
                  <PlusIcon />
                  {adding ? "Adding..." : "Add Car"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Cars Grid ────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🚗</p>
              <p className="text-slate-400">No cars added yet. Add your first car above!</p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm">
                <span className="text-white font-semibold">{cars.length}</span> car{cars.length !== 1 ? "s" : ""} in fleet
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <div key={car._id}
                    className="group overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800
                               shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-600">

                    {/* Image */}
                    <div className="relative overflow-hidden h-44">
                      <img src={car.image} alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                      {/* Price floating */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-lg font-extrabold text-white drop-shadow-lg">
                          ₹{car.pricePerDay?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-slate-300 text-xs"> /day</span>
                      </div>

                      {/* Body type */}
                      <span className="absolute top-3 right-3 rounded-full bg-slate-900/70 border border-slate-600/50 px-3 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
                        {car.bodyType}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-bold text-white">{car.name}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {car.brand}{car.model ? ` · ${car.model}` : ""}{car.year ? ` · ${car.year}` : ""}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {[car.fuelType, car.transmission, `${car.seats} Seats`].filter(Boolean).map((t) => (
                          <span key={t} className="rounded-lg bg-slate-700/50 border border-slate-600/40 px-2 py-1 text-xs text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-300">Qty: {car.quantity ?? 1}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${car.availableQuantity > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                          {car.availableQuantity > 0 ? `Available (${car.availableQuantity})` : "Unavailable"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <button
                          onClick={() => handleEditClick(car)}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-2.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/20 hover:border-yellow-500/60 active:scale-95"
                        >
                          <PlusIcon /> Edit Car
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/60 active:scale-95"
                        >
                          <TrashIcon /> Delete Car
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700/70 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Car</h2>
                <p className="text-slate-400 text-sm">Update car details and quantity.</p>
              </div>
              <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white">Close</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TEXT_FIELDS.map(({ name, placeholder, type, min, step }) => (
                  <input
                    key={name}
                    name={name}
                    type={type || "text"}
                    min={min}
                    step={step}
                    value={editForm[name]}
                    onChange={handleEditFormChange}
                    placeholder={placeholder}
                    className={inputCls}
                  />
                ))}
                {SELECT_FIELDS.map(({ name, label, opts }) => (
                  <select
                    key={name}
                    name={name}
                    value={editForm[name]}
                    onChange={handleEditFormChange}
                    className={inputCls}
                  >
                    <option value="">{label}</option>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={!!editForm.isAvailable}
                    onChange={handleEditFormChange}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-yellow-500"
                  />
                  Available for booking
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCar}
                  disabled={adding}
                  className="rounded-2xl bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-60"
                >
                  {adding ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}