import { Router } from "express";
import {    addCar, 
            getAllCars, 
            updateCarData, 
            deleteCar, 
            getMyCars 
        } from "../controllers/car.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router= Router();

