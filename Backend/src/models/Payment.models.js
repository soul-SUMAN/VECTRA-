import mongoose from "mongoose"

const paymentSchema=new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        booling:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bookings"
        },
        amount:Number,
        transactionId:String,
        paymentStatus:{
            type:String,
            enum:["Pending","Success","Failed"],
            default:Pending
        }

    },
    {
        timestemp:true

    }
)

export const Payment=mongoose.model("Payment",paymentSchema)