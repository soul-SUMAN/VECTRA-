import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cars } from "../models/Car.models.js";
import { Bookings } from "../models/Booking.models.js";
import { User } from "../models/User.models.js";

const getAdminDashboard = asyncHandler(async (req, res) => {

    if (req.user?.role !== "admin") {
        throw new ApiError(403, "This section specifically for admins");
    }

    const totalCars = await Cars.countDocuments({ owner: req.user._id });

    const totalBookings = await Bookings.countDocuments({
        admin: req.user._id
    });

    const revenueData = await Bookings.aggregate([
        {
            $match: { admin: req.user._id }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalCars,
                totalBookings,
                totalRevenue
            },
            "Dashboard data fetched"
        )
    );
});

export { getAdminDashboard };