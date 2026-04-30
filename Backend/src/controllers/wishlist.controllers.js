import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { Cars } from "../models/Car.models.js";

const addedToWishlist= asyncHandler(async(req,res)=>{
    const {catId}= req.body

    if(!carId){
        throw new ApiError(400, "Sealect a car to wishlist")
    }

    const car= await Cars.findById(carId)

    if(!car){
        throw new ApiError(404, "Car not exist")
    }

    const user= await User.findById(req.user._id)

    const alreadyExist= user.wishlist.some(
        (id)=>id.toString() === carId
    );

    if(alreadyExist){
        throw new ApiError(400, "Car already in wishlist")
    }

    user.wishlist.push(carId);

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, user.wishlist, "Car added to wishlist")
    );
})


const getWishlist= asyncHandler(async(req,res)=>{

    const user= await User.findById(req.user._id)
        .populate("wishlist");

    if(!user){
        throw new ApiError(404, "User not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user.wishlist, "Wishlist fatched successfully")
    );
})


const removeFromWishlist = asyncHandler(async (req, res) => {

    const { carId } = req.params;

    if (!carId) {
        throw new ApiError(400, "Car ID is required");
    }

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== carId
    );

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, user.wishlist, "Car removed from wishlist")
    );
});

const clearWishlist = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { wishlist: [] }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, user.wishlist, "Wishlist cleared")
    );
});


export {addedToWishlist, getWishlist, removeFromWishlist, clearWishlist}