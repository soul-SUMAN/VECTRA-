import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

// middleware to checking the user data from user end for logout or for other operation
export const verifyJWT= asyncHandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
    if(!token){
      throw new ApiError(400, "Unauthorixed request")
    }
  
    const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECKRET)
  
    const user= await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    )
  
    if(!user){
      throw new ApiError(401, "Invalid Access Token")
    }
  
    req.user=user
    next()
  } catch (error) {
    throw new ApiError(401,  error?.message || "Invalid Access Token")
    
  }

})