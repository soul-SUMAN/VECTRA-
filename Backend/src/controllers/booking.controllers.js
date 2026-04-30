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
        admin:carData.owner,
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
    .json(200, booking, "Car successfully booked");
});

const getUserBooking= asyncHandler(async(req,res)=>{
    const bookings= await Bookings.find({user:req.user._id})
    .populate("car")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, bookings, "User bookins fatched")
    );
});

const getSingleBooking= asyncHandler(async(req,res)=>{
    const {bookingId}=req.params;

    const booking= await Bookings.findById(bookingId)
    .populate("car")
    .populate("user" , "-password");

    if(!booking){
        throw new ApiError(404, "Booking npt found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, booking,"Booking fatched successfully")
    );
});

const cancelBooking= asyncHandler(async(req,res)=>{
    const {bookingId}=req.params;

    const booking= await Bookings.findById(bookingId)
    if(!booking){
        throw new ApiError(404, "Booking not found");
    }

    if(booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
        throw new ApiError(403, "Not authorized");
    }

    booking.status="Cancelled";
    await booking,save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200, "Booking cancelled successfully"))

})

const updateBookingStatus= asyncHandler(async(req,res)=>{
  if (req.user?.role != "Admin") {
        throw new ApiError(403, "You dont have the permission")
  }

  const { bookingId }= req.params;
  const { status }= req.body;

  const booking= await Bookings.findByIdAndUpdate(
    {
        _id:bookingId,
        owner:req.user._id
    },
    {
        $set: {status}
    },
    {
        new: true
    }
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, booking, "Booking status updated")
);

});

const getAllBookings= asyncHandler(async(req,res)=>{
    if (req.user?.role != "Admin") {
        throw new ApiError(403, "Admin Only")
    }

    const bookings= await Bookings.find()
        .populate("car")
        .populate("user", "-password")
        .sort({createdAt: -1});

    return res
    .status(200)
    .json(
        new ApiResponse(200, bookings, "All bookings fatched")
    )
})

const getAdminBookings= asyncHandler(async(req,res)=>{
    if(req.user?.role != "Admin"){
        throw new ApiError(403, "Only for Admin")
    }

    const adminBookings= await Bookings.find({admin:req.user._id})
    .populate("car")
    .populate("user", "-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, adminBookings, "Admin bookings fatched")
    );
})

export {createBooking, getUserBooking, getSingleBooking, cancelBooking, updateBookingStatus, getAllBookings, getAdminBookings}