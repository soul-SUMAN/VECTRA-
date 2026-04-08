// require('dotenv').config({path: './env'})
import dotenv from "dotenv";

import connectDB from './db/dbconnect.js';

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{

    app.on("error", (error)=>{
        console.log("Error appear " , error);
        throw error;
    })

    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`🚀 Server running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("😭 MONGO DB connection error happen: " , err);
})


