import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.User?.role
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can add cars")
    }

    const {name, bodyType, model, brand, year, fuelType, engine, transmission, seats, pricePerDay, location} =req.body;

    if([name, bodyType, model, brand, year, fuelType, engine, transmission, seats, pricePerDay, location].some((fields)=>fields?.trim()==="")){
        throw new ApiError(400, "All fields are requeired")
    }

    const carImageLocalPath=req.file?.path;
    if (!carImageLocalPath) {
        throw new ApiError(400, "Car image is requeired")
    }

    const uploadImage= await uploadOnCloudinary(carImageLocalPath);

    if (!uploadImage?.url) {
        throw new ApiError(400, "Image upload Failed")
    }

    const car= await Cars.create({
        name,
        bodyType,
        model,
        brand,
        year,
        fuelType,
        engine,
        transmission,
        seats,
        pricePerDay,
        location,
        image:uploadImage.url
    });

    return res
    .status(200)
    .json(200, car, "Car added successfully");
})

