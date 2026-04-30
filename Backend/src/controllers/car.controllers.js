import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Bookings } from "../models/Booking.models.js";

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
        image:uploadImage.url,
        owner:req.user._id
    });

    return res
    .status(200)
    .json(200, car, "Car added successfully");
})

// to-do searcga car feature
const getAllCars=asyncHandler(async(req,res)=>{
    const {
        page = 1,
        limit = 6,
        keyword,
        bodyType,
        brand,
        fuelType,
        transmission,
        seats,
        location,
        minPrice,
        maxPrice,
        isAvailable
    } = req.query();

    let matchStage={}

    // keyword search
    if(keyword){
        matchStage.$or=[
            {name:{$regex: keyword, $options: "i"}},
            {brand:{$regex: keyword, $options: "i"}},
            {bodyType:{$regex: keyword, $options: "i"}},
            {fuelType:{$regex: keyword, $options: "i"}},
            {transmission:{$regex: keyword, $options: "i"}},
            {seats:{$regex: keyword, $options: "i"}},
            {location:{$regex: keyword, $options: "i"}}

        ];
    }

    // exact match filter fron dropdown dection

    if(brand) matchStage.brand={ $regex: brand, $options:"i"};
    if(bodyType) matchStage.bodyType=bodyType;
    if(fuelType) matchStage.fuelType=fuelType;
    if(transmission) matchStage.transmission=transmission;
    if(location) matchStage.location={$regex: location, $options:"i"}

    //pricerange filter
    if(minPrice || maxPrice){
        matchStage.pricePerDay={
            ...(minPrice && {$gte: Number(minPrice)}),
            ...(maxPrice && {$lte: Number(maxPrice)})
        };
    }

    // is available filter
    if(typeof isAvailable!== "undefined"){
        matchStage.isAvailable= isAvailable=="true";
    }

    let sortStage = { createdAt: -1 };

    if (sortBy === "priceLow") {
        sortStage = { pricePerDay: 1 };
    }

    if (sortBy === "priceHigh") {
        sortStage = { pricePerDay: -1 };
    }

    const aggregate= Cars.aggregate([
        {
            $match: matchStage
        },
        {
            $sort: sortStage
        }
    ])

    const options={
        page:parseInt(page),
        limit:parseInt(limit)
    }

    const cars= await Cars.aggregatePaginate(aggregate,options);

    return res
    .status(200)
    .json(200, cars, "Car fatched successfully")
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
        {
            _id:carId,
            owner:req.user._id
        },
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
    const deleteCar= await Cars.findByIdAndDelete(
        {
            _id: carId,
            owner:req.user._id
        }
    );

    if (!deleteCar) {
        throw new ApiError(404, "car not found")
    }
    return res
    .status(200)
    .json(200, {}, "Car deleted successfully")
})

const getMyCars= asyncHandler(async(req,res)=>{
    if (req.user?.role !=isAdmin) {
        throw new ApiError(403, "Admin only can access")
    }

    const myCars= await Bookings.find(
        {owner:req.user._id}
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200, myCars, "Admin cars fatched")
    );

})

export {addCar, getAllCars, updateCarData, deleteCar, getMyCars}