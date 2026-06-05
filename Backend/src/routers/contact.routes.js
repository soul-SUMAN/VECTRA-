import { Router } from "express";
import { submitContact, getAllContacts, markContactRead } from "../controllers/contact.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(submitContact);                          // public — anyone can submit
router.route("/admin").get(verifyJWT, getAllContacts);          // admin only
router.route("/admin/:id/read").patch(verifyJWT, markContactRead); // admin only

export default router;