import mongoose from "mongoose"
import mongooseAggregatePeginate from "mongoose-aggregate-paginate-v2"

const carSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required:true
        },
        image:{
            type:String
        },
        bodyType:{
            type:String,
            enum:["SUV","Sedan","Hatchback","MUV","Pickup Truck","Minivan","Wagon","Coupe","Convertible","Vintage","Luxury"]
        },
        model:String,
        brand:String,
        year: Number,
        fuelType:{
            type:String,
            enum:["Petrol","Disel","CNG","Electric"]
        },
        engine:{
            type:Number
        },
        transmission:{
            type:string,
            enum:["Manual","Automatic"]
        },
        seats: Number,
        pricePerDay:{
            type:Number,
            required:true
        },
        location:String,
        isAvailable:{
            type:Boolean,
            default:true
        }


    },
    {
        timestamps: true
    }
)

carSchema.plugin(mongooseAggregatePeginate)
export const Cars=mongoose.model('Cars',carSchema)