import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// token generation method
const generateRefreshAndAccessToken = async (userId)=>{
    try{
        const user= await User.findById(userId)
        const accessToken= user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()

        user.refreshToken=refreshToken
        // saving the refreshToken to database
        await user.save({validateBeforeSave:false})

        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "something went wrong while generating tokens")
    }

}



const registerUser=asyncHandler(async(req,res)=>{
    /*
    CHECKLIST:
    1. Get user details from frontend
    2. Validation
    3. Check existing user
    4. Check avatar image
    5. Upload avatar to cloudinary
    6. Create user in DB
    7. Remove password & refreshToken
    8. Return response
    */
   
    //1. get user data from frontend
    const {username,email,password,fullname}=req.body //(getting user data from frontend by using req.body only id the data is coming from  the form or from the json)
    
    //2.  validation

    // 2.1 checking the field empty or not
    if([username,email,password,fullname].some((fields)=>fields?.trim()==="")){
        throw new ApiError(400 , "All fields are required to register");
    }
    //2.2 validate email
    if(!validator.isEmail(email)){
        throw new ApiError(400 , "Invalis email address");
    }
    //2.3 validate password
    if(!validator.isStrongPassword(password)){
        throw new ApiError(400 , "Weak password !! Password must contain uppercase, lowercase, number, special character and minimum 8 characters");
    }
    
    //3. check user exisi or not
    const userExist= await User.findOne({
        $or: [{ username },{ email }]
    })
    if(userExist){
        throw new ApiError(409 , "Username and Email already exist");
    }

    //4. check avtar image
    const avatarLocalPath= req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required");
    }
    // console.log(avatarLocalPath)

    //5. cloudinary upload
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400 , "Avatar upload failed");
    }
    
    //6. create user object in db
    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url
    });

    //7. Remove password & refreshToken
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering user")
    }
    
    // console.log("email: ", email , "\npassword:" , password , "\nusername:" , username , "\nfullname: " , fullname);

    //8. Return response
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )

})

const loginUser= asyncHandler(async(req,res)=>{
    /*
    CHECKLIST:
    1. Get user data
    2. Validate input
    3. Find user
    4. check password
    5. Generate tokens
    6. remove sensitive field
    7. Send response in cookie
    */

    //1. get user data
    const {username, email, password}=req.body

    //2. validate
    if(!username && !email){
        throw new ApiError(400, "username or email is required");

    }
    if(!password){
        throw new ApiError(400, "password is required")
    }

    //3. find user
   const user=await User.findOne({
        $or:[{ username }, { email }]
    })

    if(!user){
        throw new ApiError(404, "user not found")
    }

    //4. check password
    const isPasswordValid= await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "invalid password")
    }

    //5. Generate tokens
    const {accessToken , refreshToken}=await generateRefreshAndAccessToken(user._id)

    //6. remove sensitive field
    const loggedInUser= await user.findById(user._id).select(
        "-password -refreshToken"
    )

    //7. Send response in cookie
    const option={
        httpOnly:true,
        secure:true
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(
                new ApiResponse(
                    200,
                    {
                        User:loggedInUser, accessToken, refreshToken
                    },
                    "User logged in successfull"
                )
            )

})

export {registerUser, loginUser}