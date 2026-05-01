import { Router } from "express";
import {addedToWishlist, 
        getWishlist, 
        removeFromWishlist, 
        clearWishlist
    } from "../controllers/wishlist.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const routes= Router();

routes.route("/").post(verifyJWT, addedToWishlist);
routes.route("/my-wishlist").get(verifyJWT, getWishlist);

routes.route("/clear/:carId").delete(verifyJWT, removeFromWishlist);
routes.route("/chear/all").delete(verifyJWTq, clearWishlist);

export default routes;

