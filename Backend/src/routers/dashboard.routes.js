import { Router } from "express";
import { getAdminDashboard } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const routes= Router();

routes.route("/admin").get(verifyJWT, getAdminDashboard);

export default routes;