import { Router } from "express";
import {createBooking, 
        getUserBooking, 
        getSingleBooking, 
        cancelBooking, 
        updateBookingStatus, 
        getAllBookings, 
        getAdminBookings
    } from "../controllers/booking.controllers.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const routes= Router();

routes.route("/").post(verifyJWT, createBooking);
routes.route("/my-bookings").get(verifyJWT, getUserBooking);

routes.route("/admin/all").get(verifyJWT, getAllBookings);
routes.route("/admin/booking-list").get(verifyJWT, getAdminBookings);
routes.route("/admin/:bookingId").get(verifyJWT, updateBookingStatus);

routes.route("/:bookingId")
    .get(verifyJWT, getSingleBooking)
    .delete(verifyJWT, cancelBooking);


export default routes;
