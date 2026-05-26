import api from "./apiManager";

// ─── Car Services ──────────────────────────────────────────────────────────────

export const getAllCars = (params = {}) =>
  api.get("/cars", { params });

export const getSingleCar = (carId) =>
  api.get(`/cars/${carId}`);

export const checkCarAvailability = (carId, startDate, endDate) =>
  api.get(`/cars/${carId}/availability`, { params: { startDate, endDate } });

// ─── Admin Car Services ────────────────────────────────────────────────────────

export const getMyCars = () =>
  api.get("/cars/admin/my-cars");

export const addCar = (formData) =>
  api.post("/cars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCarData = (carId, data) =>
  api.patch(`/cars/${carId}`, data);

export const updateCarImage = (carId, formData) =>
  api.patch(`/cars/${carId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCar = (carId) =>
  api.delete(`/cars/${carId}`);
