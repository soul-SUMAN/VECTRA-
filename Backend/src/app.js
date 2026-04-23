import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// configure cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential:true

}))

// configuration part

// limit the json input for security parpases (configurin the file upload) specificaly for **form data
app.use(express.json({limit: "20kb"}))
// specify the url encode for text data input
app.use(express.urlencoded({extended:true, limit:"20kb"}))
// specify the folder for static file like **pdf **images 
app.use(express.static("public"))
// for using the cookies from user end with the help of server to access the user data
app.use(cookieParser())


// routes import 

import userRouter from "./routers/user.routes.js";




// router declaration
app.use("/api/v1/user",userRouter)


export { app };