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



const updateCarData= asyncHandler(async(req,res)=>{
    const isAdmin= req.User?.role
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can update the car details")
    }

    const {carId}= req.params;

    const {
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
        isAvailable

    }= req.body

    const updatedInfo={}
    if (name) updatedInfo.name= name;
    if (bodyType) updatedInfo.bodyType= bodyType;
    if (model) updatedInfo.model= model;
    if (brand) updatedInfo.brand= brand;
    if (year) updatedInfo.year= year;
    if (fuelType) updatedInfo.fuelType= fuelType;
    if (engine) updatedInfo.engine= engine;
    if (transmission) updatedInfo.transmission= transmission;
    if (pricePerDay) updatedInfo.pricePerDay= pricePerDay;
    if (location) updatedInfo.location= location;
    if (typeof isAvailable=== "boolean") updatedInfo.isAvailable= isAvailable;

    if (req.file?.path) {
        const updatedImage= await uploadOnCloudinary(req.file.path);

        if (!updatedImage?.url) {
            throw new ApiError(400, "Image upload failed")
        }

        updatedInfo.image=updatedImage.url;
    }

    const updateCar= await Cars.findByIdAndUpdate(
        carId,
        {
            $set: updatedInfo
        },
        {
            new: true
        }
    )
    if (!updateCar) {
        throw new ApiError(404, "Car not Found")
    }

    return res
    .status(200)
    .json(
        200,
        updateCar,
        "Car updated successfully"
    );
})


const deleteCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.User?.role
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can delete a car")
    }

    const {carId}= req.params
    const deleteCar= await Cars.findByIdAndDelete(carId);

    if (!deleteCar) {
        throw new ApiError(404, "car not found")
    }
    return res
    .status(200)
    .json(200, {}, "Car deleted successfully")
})


export {addCar, updateCarData}