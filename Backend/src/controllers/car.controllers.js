import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Bookings } from "../models/Booking.models.js";
import mongoose from "mongoose";

const parseNumericField = (value, fieldName, options = {}) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const parsed = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(parsed)) {
        throw new ApiError(400, `${fieldName} must be a valid number`);
    }

    if (options.min !== undefined && parsed < options.min) {
        throw new ApiError(400, `${fieldName} must be a non-negative number`);
    }

    return parsed;
};

const addCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can add cars")
    }

    const {name, bodyType, model, brand, year, fuelType, engine, transmission, seats, pricePerDay, location} =req.body;
    const quantity = req.body.quantity ?? req.body.qty ?? req.body.stock;

    if (process.env.NODE_ENV !== "production") {
        console.log("addCar req.body:", JSON.stringify(req.body));
        console.log("addCar quantity raw:", quantity, "type:", typeof quantity);
    }

    if(
        !name ||
        !bodyType ||
        !model ||
        !brand ||
        !year ||
        !fuelType ||
        !engine ||
        !transmission ||
        !seats ||
        !pricePerDay ||
        !location ||
        quantity === undefined || quantity === null || quantity === ""
    ){
        throw new ApiError(400, "All fields are required")
    }

    const parsedQuantity = parseNumericField(quantity, "Quantity", { min: 0 });
    if (parsedQuantity === undefined) {
        throw new ApiError(400, "Quantity must be a valid number of cars")
    }

    const carImageLocalPath=req.file?.path;
    if (!carImageLocalPath) {
        throw new ApiError(400, "Car image is requeired")
    }

    const uploadImage= await uploadOnCloudinary(carImageLocalPath);

    if (!uploadImage?.url) {
        throw new ApiError(400, "Image upload Failed")
    }

    // console.log("BODY", req.body);
    // console.log("Quantity:", req.body.quantity);
    // console.log(typeof req.body.quantity);

    const car = await Cars.create({
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
    quantity:    parsedQuantity,
    isAvailable: parsedQuantity > 0,   // ← auto-set: 0 cars = unavailable
    image:       uploadImage.url,
    owner:       req.user._id
});

    // console.log(car);

    return res
    .status(200)
    .json(
        new ApiResponse(200, car, "Car added successfully"));
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
        startDate,
        endDate,
        isAvailable,
        sortBy
    } = req.query;

    let matchStage={}

    // keyword search
    if(keyword){
        matchStage.$or=[
            {name:{$regex: keyword, $options: "i"}},
            {brand:{$regex: keyword, $options: "i"}},
            {bodyType:{$regex: keyword, $options: "i"}},
            {fuelType:{$regex: keyword, $options: "i"}},
            {transmission:{$regex: keyword, $options: "i"}},
            {location:{$regex: keyword, $options: "i"}},
            

        ];
        
    }

    // exact match filter fron dropdown dection

    if(brand) matchStage.brand={ $regex: brand, $options:"i"};
    if(bodyType) matchStage.bodyType=bodyType;
    if(fuelType) matchStage.fuelType=fuelType;
    if(transmission) matchStage.transmission=transmission;
    if(location) matchStage.location={$regex: location, $options:"i"}
    if(seats) matchStage.seats = Number(seats)

    //pricerange filter
    if(minPrice || maxPrice){
        matchStage.pricePerDay={
            ...(minPrice && {$gte: Number(minPrice)}),
            ...(maxPrice && {$lte: Number(maxPrice)})
        };
    }

    // // is available filter
    // if(typeof isAvailable!== "undefined"){
    //     matchStage.isAvailable= isAvailable=="true";
    // }



    // const aggregate= Cars.aggregate([
    //     {
    //         $match: matchStage
    //     },
    //     {
    //         $sort: sortStage
    //     }
    // ])

    //  date validation
    if (startDate && isNaN(new Date(startDate))) {
        throw new ApiError(400, "Invalid startDate");
    }
    if (endDate && isNaN(new Date(endDate))) {
        throw new ApiError(400, "Invalid endDate");
    }
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(400, "Start date must be before end date");
    }

    const start= startDate? new Date(startDate): null;
    const end= endDate? new Date(endDate): null;


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
            $lookup:{
                from: "bookings",
                localField: "_id",
                foreignField: "car",
                as: "bookings"
            }
        },
        {
            $addFields: {
                overlappingBookingsQty: {
                    $cond: {
                        if: {
                            $and: [ { $ifNull: [start, false] }, { $ifNull: [end, false] } ]
                        },
                        then: {
                            $reduce: {
                                input: {
                                    $filter: {
                                        input: "$bookings",
                                        as: "b",
                                        cond: {
                                            $and: [
                                                { $in: ["$$b.status", ["Pending", "Confirm"]] },
                                                { $lte: ["$$b.startDate", end] },
                                                { $gte: ["$$b.endDate", start] }
                                            ]
                                        }
                                    }
                                },
                                initialValue: 0,
                                in: { $add: ["$$value", { $ifNull: ["$$this.quantity", 1] }] }
                            }
                        },
                        else: 0
                    }
                }
            }
        },
        {
            $addFields: {
                quantity: { $ifNull: ["$quantity", 1] }
            }
        },
    
        {
            $addFields: {
                availableQuantity: {
                    $max: [
                        { $subtract: [ { $ifNull: ["$quantity", 1] }, { $ifNull: ["$overlappingBookingsQty", 0] } ] },
                        0
                    ]
                }
            }
        },
            {
            $addFields: {
                isAvailable: {
                    $and: [
                        { $ne:  ["$isAvailable", false] },
                        { $gt:  [{ $ifNull: ["$quantity", 1] }, 0] },
                        { $gt:  ["$availableQuantity", 0] }   // ← now works correctly
                    ]
                }
            }
        },
        
        
         ...(typeof isAvailable !== "undefined"
                ? [{ $match: { isAvailable: isAvailable === "true" } }]
                : []),
        {
            $project:{
                bookings: 0
            }
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

    if (process.env.NODE_ENV !== "production") {
        try {
            console.log("getAllCars - sample doc:", JSON.stringify(cars.docs?.[0] ?? cars.docs ?? cars));
        } catch (e) {
            console.log("getAllCars - sample doc (stringify failed)");
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, cars, "Car fetched successfully") 
    );
});


const updateCarData = asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can update the car details");
    }

    const { carId } = req.params;

    const carToUpdate = await Cars.findOne({ _id: carId, owner: req.user._id });
    if (!carToUpdate) {
        throw new ApiError(404, "Car not found");
    }

    const updatedInfo = {};

    const {
        name, bodyType, model, brand, year, fuelType,
        engine, transmission, seats, pricePerDay,
        location, quantity, isAvailable
    } = req.body;

    if (name) updatedInfo.name = String(name).trim();
    if (bodyType) updatedInfo.bodyType = String(bodyType).trim();
    if (model) updatedInfo.model = String(model).trim();
    if (brand) updatedInfo.brand = String(brand).trim();
    if (fuelType) updatedInfo.fuelType = String(fuelType).trim();
    if (transmission) updatedInfo.transmission = String(transmission).trim();
    if (location) updatedInfo.location = String(location).trim();

    if (year != null && year !== "") updatedInfo.year = Number(year);
    if (pricePerDay != null && pricePerDay !== "") updatedInfo.pricePerDay = Number(pricePerDay);
    if (seats != null && seats !== "") updatedInfo.seats = Number(seats);
    if (engine != null && engine !== "") updatedInfo.engine = Number(engine);

    if (quantity !== undefined && quantity !== null && quantity !== "") {
        const parsedQty = Number(quantity);
        if (!Number.isNaN(parsedQty) && parsedQty >= 0) {
            updatedInfo.quantity = parsedQty;
        }
    }

    if (isAvailable !== undefined && isAvailable !== null && isAvailable !== "") {
        if (isAvailable === true || isAvailable === "true") updatedInfo.isAvailable = true;
        if (isAvailable === false || isAvailable === "false") updatedInfo.isAvailable = false;
    }

    if (Object.keys(updatedInfo).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    console.log("updateCarData - carId:", carId);
    console.log("updateCarData - req.body:", JSON.stringify(req.body));
    console.log("updateCarData - quantity raw:", quantity, "type:", typeof quantity);
    console.log("updateCarData - updatedInfo:", JSON.stringify(updatedInfo));

    const updatedCar = await Cars.findOneAndUpdate(
        { _id: carId, owner: req.user._id },
        { $set: updatedInfo },
        { returnDocument: "after", runValidators: true }
    );

    if (!updatedCar) {
        throw new ApiError(404, "Car not found after update");
    }

    console.log("updateCarData - updatedCar quantity:", updatedCar.quantity);

    return res.status(200).json(
        new ApiResponse(200, updatedCar, "Car updated successfully")
    );
});

const updateCarImage= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if(!isAdmin){
        new ApiError(403, "only admin can update the car image")
    }
    const {carId}= req.params;

    const newImage=req.file?.path;
    if (!newImage) {
        throw new ApiError(400, "Car image is missing")
    }  
    const upldatedImage= await uploadOnCloudinary(newImage);
    if (!upldatedImage.url) {
        throw new ApiError(400, "Image upload failed")
    }

    const updateCarImage= await Cars.findOneAndUpdate(
        {
            _id:carId,  
            owner:req.user._id
        
        },
        {
            $set:{ image: upldatedImage.url}
        },
        {
            new:true
        }
    );

    if (!updateCarImage) {
        throw new ApiError(404, "Car not Found")
    }   

    return res
    .status(200)
    .json(
        new ApiResponse(200, updateCarImage, "Car image updated successfully")
    )

})  


const deleteCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can delete a car")
    }

    const {carId}= req.params
    const deletedCar= await Cars.findOneAndDelete(
        {
            _id: carId,
            owner:req.user._id
        }
    );

    if (!deletedCar) {
        throw new ApiError(404, "Car not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Car deleted successfully"));
})

const getMyCars = asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can view their cars");
    }

    // Use aggregate so availableQuantity is computed — same logic as getAllCars
    const cars = await Cars.aggregate([
        {
            $match: { owner: req.user._id }
        },
        {
            $lookup: {
                from:         "bookings",
                localField:   "_id",
                foreignField: "car",
                as:           "bookings"
            }
        },
        {
            // Sum active bookings' quantities (not cancelled/completed)
            $addFields: {
                activeBookingsQty: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: "$bookings",
                                as: "b",
                                cond: { $in: ["$$b.status", ["Pending", "Confirm"]] }
                            }
                        },
                        initialValue: 0,
                        in: { $add: ["$$value", { $ifNull: ["$$this.quantity", 1] }] }
                    }
                }
            }
        },
        {
            $addFields: {
                quantity: { $ifNull: ["$quantity", 1] }
            }
        },
        {
            $addFields: {
                availableQuantity: {
                    $max: [ { $subtract: ["$quantity", { $ifNull: ["$activeBookingsQty", 0] }] }, 0 ]
                }
            }
        },
        {
            $addFields: {
                isAvailable: {
                    $and: [
                        { $ne: ["$isAvailable", false] },
                        { $gt: ["$quantity", 0] },
                        { $gt: ["$availableQuantity", 0] }
                    ]
                }
            }
        },
        {
            $project: { bookings: 0, activeBookings: 0 }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, cars, "Cars fetched successfully")
    );
});

const checkCarAvailabality= asyncHandler(async(req,res)=>{
    const { carId }= req.params;
    const { startDate, endDate }= req.query;

    if (!startDate || !endDate) {
        throw new ApiError(400, "Start and End date is required")
    }
    if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        throw new ApiError(400, "Invalid date format")
    }
    if(new Date(startDate)>= new Date(endDate)){
        throw new ApiError(400, "Start date must be before end date")
    }

    const start= new Date(startDate);
    const end= new Date(endDate);

    const carData = await Cars.findById(carId);
    if (!carData) {
        throw new ApiError(404, "Car not found");
    }

    const quantity = carData.quantity ?? 1;

    // Sum overlapping booked quantities for selected date range
    const agg = await Bookings.aggregate([
        { $match: {
            car: mongoose.Types.ObjectId(carId),
            status: { $in: ["Pending", "Confirm"] },
            $or: [ { startDate: { $lte: end }, endDate: { $gte: start } } ]
        }},
        { $group: { _id: null, total: { $sum: { $ifNull: ["$quantity", 1] } } } }
    ]);

    const overlappingCount = (agg[0] && agg[0].total) ? agg[0].total : 0;

    const availableQuantity = Math.max(quantity - overlappingCount, 0);
    const isAvailable = carData.isAvailable !== false && quantity > 0 && availableQuantity > 0;

    return res
    .status(200)
    .json(
        new ApiResponse(200, {isAvailable, availableQuantity}, isAvailable ? "Car is available" : "Car is not available")
    )
});

const getSingleCar= asyncHandler(async(req,res)=>{
    const { carId }= req.params;

    if(!carId){
        throw new ApiError(400, "Car need to be select to see details")
    }

    const car= await Cars.findById(carId);

    if (!car) {
        throw new ApiError(404, "Car not found")
    }

    const carData = car.toObject();
    carData.quantity = carData.quantity ?? 1;

    return res
    .status(200)
    .json(
        new ApiResponse(200, carData, "Car fatched successfully")
    )
});

export {addCar, getAllCars, updateCarData, updateCarImage, deleteCar, getMyCars, checkCarAvailabality, getSingleCar}