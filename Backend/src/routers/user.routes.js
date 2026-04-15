import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const routes= Router()

routes.post("/register", registerUser)


export default routes