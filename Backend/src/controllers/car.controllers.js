import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Bookings } from "../models/Booking.models.js";

const addCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can add cars")
    }

    const {name, bodyType, model, brand, year, fuelType, engine, transmission, seats, pricePerDay, location} =req.body;

    // if([name, bodyType, model, brand, year, fuelType, engine, transmission, seats, pricePerDay, location].some((fields)=>fields?.trim()==="")){
    //     throw new ApiError(400, "All fields are requeired")
    // }

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
        !location
    ){
        throw new ApiError(400, "All fields are required")
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
            $addFields:{
                isAvailable:{
                    $cond:{
                        if:{
                            $and:[
                                { $ifNull:[start, false] },
                                { $ifNull:[end, false] },
                            ]
                        },
                        then:{
                            $not:{
                                $anyElementTrue:{
                                    $map:{
                                        input:"$bookings",
                                        as: "b",
                                        in:{
                                            $and:[
                                                { $lte: ["$$b.startDate", end] },
                                                { $gte: ["$$b.endDate", start] }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        else: true
                    }
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

    return res
    .status(200)
    .json(
        new ApiResponse(200, cars, "Car fetched successfully") 
    );
});


const updateCarData= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
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
    if (fuelType) updatedInfo.fuelType= fuelType;
    if (transmission) updatedInfo.transmission= transmission;
    if (location) updatedInfo.location= location;
    
    // parse and validate seats
    if (seats !== undefined) {
        const s = parseInt(seats, 10);
        if (!Number.isNaN(s)) {
            updatedInfo.seats = s;
        }
    }
    if (typeof pricePerDay !== "undefined") updatedInfo.pricePerDay= Number(pricePerDay);
    if (typeof year !== "undefined") updatedInfo.year= Number(year);
    if (typeof engine !== "undefined") updatedInfo.engine= Number(engine);
    if (typeof isAvailable=== "boolean") updatedInfo.isAvailable= isAvailable;

    console.log('updateCarData - updatedInfo before image handling:', updatedInfo);

// image update handling
    newImage=req.file?.path;
    // console.log(newImage)

    if (!newImage) {
        throw new ApiError(400, "Car image is missing")
    }

    const upldatedImage= await uploadOnCloudinary(newImage);

    if (!upldatedImage.url) {
            throw new ApiError(400, "Image upload failed")
        }

        updatedInfo.image=upldatedImage.url;
  
    // debug: log updatedInfo to verify fields being set
    console.log('updateCarData - updatedInfo:', updatedInfo);

    const updateCar= await Cars.findOneAndUpdate(
        {
            _id:carId,
            owner:req.user._id
        },
        {
            $set: updatedInfo
        },
        {
            new:true
        }
    )
    if (!updateCar) {
        throw new ApiError(404, "Car not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
        200,
        updateCar,
        "Car updated successfully"
        )
        
    );
})


const deleteCar= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if (!isAdmin) {
        throw new ApiError(403, "Only admin can delete a car")
    }

    const {carId}= req.params
    const deleteCar= await Cars.findOneAndUpdate(
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
    .json(new ApiResponse(200, {}, "Car deleted successfully"));
})

const getMyCars= asyncHandler(async(req,res)=>{
    const isAdmin= req.user?.role === "admin"
    if (!isAdmin) {
        throw new ApiError(403, "Admin only can access their cars")
    }

    const myCars= await Cars.find(
        {owner:req.user._id}
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200, myCars, "Admin cars fetched")
    );

})

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

    const overlapingBooking= await Bookings.findOne({
        car: carId,
        status: { $in:[ "Pending", "Confirm" ] },
        $or:[
            {
                startDate: {$lte: end},
                endDate: {$gte: start}
            }
        ]
    });

    const isAvailable= !overlapingBooking

    return res
    .status(200)
    .json(
        new ApiResponse(200, {isAvailable}, isAvailable ? "Car is available" : "Car is not available")
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

    return res
    .status(200)
    .json(
        new ApiResponse(200, car, "Car fatched successfully")
    )
});

export {addCar, getAllCars, updateCarData, deleteCar, getMyCars, checkCarAvailabality, getSingleCar}