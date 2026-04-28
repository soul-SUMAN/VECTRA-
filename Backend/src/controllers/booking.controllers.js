import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Bookings } from "../models/Booking.models.js";
import { Cars } from "../models/Car.models.js";
import { User } from "../models/User.models.js";

const createBooking= asyncHandler(async(req,res)=>{

    const {
        car,
        startDate,
        endDate,
        pickupLocation,
        dropLocation,
        requiredDriver

    }= req.body;

    if(!car || !startDate || !endDate){
        throw new ApiError(400, "Required fields are missing")
    }

    const start= new Date(startDate);
    const end= new Date(endDate);

    if(start>= end){
        throw new ApiError(400, "End date must be after start date")
    }

    const carData= await Cars.findById(car);

    if(!carData){
        throw new ApiError(404, "Car not found")
    }

    // booking conflict check
    const conflict= await Bookings.findOne({
        car: car,
        $or:[
            {
                startDate: {$lte: end},
                endDate:{$gte: start}
            }
        ]
    })

    if(conflict){
        throw new ApiError(400, "Car already booked for selected dates")
    }

    const totalDay=math.ceil(
        (start-end)/(1000*60*60*24)
    );
    const totalPrice= totalDay * carData.pricePerDay

    const booking= await Bookings.create({
        user: req.user._id,
        car,
        startDate: start,
        endDate: end,
        requiredDriver: requiredDriver || false,
        pickupLocation,
        dropLocation,
        totalDay,
        totalPrice
    });

    return res
    .status(200)
    .json(200, booking, "Car successfully booked")
})

export {createBooking}