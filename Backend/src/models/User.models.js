import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required: [true, 'password is required'],
            unique: true
        },
        fullname:{
            type: String,
            required: true,
            trim: true
        },
        phone: String,
        avatar:{
            type: String
        },
        licenceNumber: String,
        role:{
            type: String,
            enum:["user","admin"],
            default: "user"
        },
        refreshToken:{
            type:String
        }

    },
    {
        timestamps: true
    }
)

// hashing the password
userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10);
    next();
})

// compare the user password and the hash password

userSchema.methods.isPasswordCorrect= async function(password){
   return await bcrypt.compare(password, this.password);
}

//generate ACCESS_TOKEN

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.name
        },
        process.env.ACCESS_TOKEN_SECKRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generate REFRESH_TOKEN

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECKRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model('User',userSchema)