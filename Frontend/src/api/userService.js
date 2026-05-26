import api from "./apiManager";

// ─── User Services ─────────────────────────────────────────────────────────────

export const registerUser = (formData) =>
  api.post("/user/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginUser = (credentials) =>
  api.post("/user/login", credentials);

export const logoutUser = () =>
  api.post("/user/logout");

export const getCurrentUser = () =>
  api.get("/user/me");

export const updateUserDetails = (data) =>
  api.patch("/user/update-profile", data);

export const updateUserAvatar = (formData) =>
  api.patch("/user/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePassword = (data) =>
  api.post("/user/change-password", data);
