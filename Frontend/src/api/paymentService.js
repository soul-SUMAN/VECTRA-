import api from "./apiManager";

export const createRazorpayOrder = (bookingId) =>
  api.post("/payment/create-order", { bookingId });

export const verifyRazorpayPayment = (data) =>
  api.post("/payment/verify", data);