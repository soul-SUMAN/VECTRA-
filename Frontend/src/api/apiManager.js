import axios from "axios";

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // sends httpOnly cookies automatically
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Only attempts token refresh for protected-resource 401s — NOT for session
// check (/user/me) or for the refresh route itself, to avoid error cascades.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized   = error.response?.status === 401;
    const isNotRetried     = !originalRequest._retry;
    const isNotRefreshRoute = !originalRequest.url.includes("/user/refresh");
    // Skip interceptor for the session check — a 401 there just means "not logged in"
    const isNotSessionCheck = !originalRequest.url.includes("/user/me");

    if (isUnauthorized && isNotRetried && isNotRefreshRoute && isNotSessionCheck) {
      originalRequest._retry = true;
      try {
        await api.post("/user/refresh");
        return api(originalRequest);
      } catch {
        // Refresh also failed — user truly needs to log in again
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;