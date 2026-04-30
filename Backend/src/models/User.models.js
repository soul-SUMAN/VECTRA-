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
            required: [true, 'password is required']
            
        },
        fullname:{
            type: String,
            required: true,
            trim: true
        },
        phone:{
            type:String,
            default:""
        },
        avatar:{
            type: String
        },
        licenceNumber: {
            type: String,
            default: null
        },
        role:{
            type: String,
            enum:["user","admin"],
            default: "user"
        },
        refreshToken:{
            type:String
        },
        address:{
            addressline1:{
                type:String,
                default:""
            },
            addressline2:{
                type:String,
                default:""
            },
            city:{
                type:String,
                default:""
            },
            state:{
                type:String,
                default:""
            },
            postalcode:{
                type:String,
                default:""
            },
            country:{
                type:String,
                default:"India"
            },
            wishlist:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Cars"
                }
            ]
        }

    },
    {
        timestamps: true
    }
)

// hashing the password
userSchema.pre("save", async function(){

    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password, 10);
    
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
            fullname: this.fullname
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