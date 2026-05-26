import api from "./apiManager";

// ─── Wishlist Services ─────────────────────────────────────────────────────────

export const getWishlist = () =>
  api.get("/wishlist/my-wishlist");

export const addToWishlist = (carId) =>
  api.post("/wishlist", { carId });

export const removeFromWishlist = (carId) =>
  api.delete(`/wishlist/clear/${carId}`);

export const clearWishlist = () =>
  api.delete("/wishlist/clear/all");
