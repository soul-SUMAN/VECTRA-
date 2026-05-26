import api from "./apiManager";

// ─── Dashboard Services ────────────────────────────────────────────────────────

export const getAdminDashboard = () =>
  api.get("/dashboard/admin");
