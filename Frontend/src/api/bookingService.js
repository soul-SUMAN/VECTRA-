import api from "./apiManager";

// ─── Booking Services ──────────────────────────────────────────────────────────

export const createBooking = (data) =>
  api.post("/bookings", data);

export const getUserBookings = () =>
  api.get("/bookings/my-bookings");

export const getSingleBooking = (bookingId) =>
  api.get(`/bookings/${bookingId}`);

export const cancelBooking = (bookingId) =>
  api.delete(`/bookings/${bookingId}`);

// ─── Admin Booking Services ────────────────────────────────────────────────────

export const getAllBookings = () =>
  api.get("/bookings/admin/all");

export const getAdminBookings = () =>
  api.get("/bookings/admin/booking-list");

export const updateBookingStatus = (bookingId, status) =>
  api.patch(`/bookings/admin/${bookingId}`, { status });
