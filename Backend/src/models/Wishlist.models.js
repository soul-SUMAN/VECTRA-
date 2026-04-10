import mongoose from "mongoose"

const wishlistSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjuctId,
            ref:"User"
        },
        car:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Cars"
        }
    },
    {
        timestamps:true
    }
)

export const Wishlist=mongoose.model("Wishlist",wishlistSchema)