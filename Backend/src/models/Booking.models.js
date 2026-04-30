import mongoose from "mongoose"


const bookingSchema=new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        car:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cars"
        },
        requiredDriver:{
            type: Boolean,
            default:false
        },
        startDate:{
            type: Date,
            required:true
        },
        endDate:{
            type: Date,
            required:true
        },
        totalDay: Number,
        totalPrice: Number,
        status:{
            type:String,
            enum:['Pending','Confirm','Cancelled','Completed'],
            default:"Pending"
        },
        pickupLocation: String,
        dropLocation: String,
        admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }
    },
    {
        timestamps:true
    }
)

export const Bookings=mongoose.model('Bookings',bookingSchema)