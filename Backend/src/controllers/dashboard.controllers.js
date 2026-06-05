import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { Bookings } from "../models/Booking.models.js";
import { User } from "../models/User.models.js";
import { Payment } from "../models/Payment.models.js";

const getAdminDashboard = asyncHandler(async (req, res) => {

    // if (req.user?.role !== "admin") {
    //     throw new ApiError(403, "This section specifically for admins");
    // }

    // const totalCars = await Cars.countDocuments({ owner: req.user._id });

    // const totalBookings = await Bookings.countDocuments({
    //     admin: req.user._id
    // });

    // const revenueData = await Bookings.aggregate([
    //     {
    //         $match: { admin: req.user._id }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             totalRevenue: { $sum: "$totalPrice" }
    //         }
    //     }
    // ]);

    // const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const [
        totalCars,
        totalBookings,
        totalUsers,
        pendingBookings,
        revenueAgg,
        bookingsPerMonth,
        topCars,
    ] = await Promise.all([

        Cars.countDocuments({ owner: req.user._id }),

        Bookings.countDocuments({ admin: req.user._id }),

        User.countDocuments({ role: "user" }),

        Bookings.countDocuments({ admin: req.user._id, status: "Pending" }),

        // Total revenue from successful payments
        Payment.aggregate([
        { $match: { paymentStatus: "Success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        // Bookings per month (last 6 months)
        Bookings.aggregate([
        { $match: { admin: req.user._id } },
        {
            $group: {
            _id: {
                year:  { $year:  "$createdAt" },
                month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 },
        ]),

        // Top 5 most booked cars
        Bookings.aggregate([
        { $match: { admin: req.user._id } },
        { $group: { _id: "$car", bookings: { $sum: 1 } } },
        { $sort: { bookings: -1 } },
        { $limit: 5 },
        { $lookup: { from: "cars", localField: "_id", foreignField: "_id", as: "car" } },
        { $unwind: "$car" },
        { $project: { name: "$car.name", image: "$car.image", bookings: 1 } },
        ]),
    ]);

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalCars,
                totalBookings,
                totalUsers,
                pendingBookings,
                totalRevenue:     revenueAgg[0]?.total || 0,
                bookingsPerMonth: bookingsPerMonth.map((b) => ({
                month:    MONTHS[b._id.month - 1],
                bookings: b.count,
                })),
                topCars,
            }, 
            "Dashboard stats"
        )
    );
});

export { getAdminDashboard };