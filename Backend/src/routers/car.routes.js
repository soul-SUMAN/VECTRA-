import { Router } from "express";
import {    addCar, 
            getAllCars, 
            updateCarData, 
            deleteCar, 
            getMyCars,
            checkCarAvailabality,
            getSingleCar 
        } from "../controllers/car.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
// import routes from "./user.routes.js";

const routes= Router();
//public access all cars
routes.route("/").get(getAllCars);

// imprtant routes
routes.route("/admin/my-cars").get(getMyCars);

routes.route("/:carId/availability").get(checkCarAvailabality);

routes.route("/:carId").get(getSingleCar);

// admin access

routes.route("/").post(
    verifyJWT,
    upload.single("image"),
    addCar 
)

routes.route("/:carId").patch(
    verifyJWT,
    upload.single("image"),
    updateCarData
)

routes.route("/:carId").delete(verifyJWT, deleteCar);

export default routes;


