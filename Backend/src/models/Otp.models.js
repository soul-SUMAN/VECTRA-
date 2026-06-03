import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:{ 
    type: String, 
    required: true 
},
  otp:{ 
    type: String, 
    required: true 
},
  purpose:{ 
    type: String, 
    enum: ["register", "reset"], 
    default: "register" 
},
  createdAt:{
    type: Date, 
    default: Date.now, 
    expires: 600 }, // auto-delete after 10 min
});

export const Otp = mongoose.model("Otp", otpSchema);