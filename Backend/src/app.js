import express from "express";
import corse from "corse";
import cookieParser from "cookie-parser";

const app = express();

// configure corse
app.use(corse({
    origin: process.env.CORSE_ORIGIN,
    Credential:true

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

export { app };