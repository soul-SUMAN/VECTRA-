// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import express from 'express';
import connectDB from './db/dbconnect.js';

dotenv.config({
    path: './.env'
})

connectDB();


const app=express()

app.get('/',(req,res)=>{
    res.send("hello world")
})

app.listen(4000,()=>{
    console.log("server is running on http://localhost:4000")
})