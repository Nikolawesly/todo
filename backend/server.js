//create server
import express from "express";
import {connect} from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import {userRoute} from "./APIs/UserAPI.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { UserModel } from "./models/UserModel.js";
const app = express();

//add CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//add parser to middleware
app.use(express.json());
//add cookie parser middleware
app.use(cookieParser());

//userRoute
app.use('/user-api',userRoute);
//connnect to db
async function connectDBAndStartServer(){
    try{
        //connect to db
        await connect("mongodb://localhost:27017/tododb");
    } catch(err){
        console.log(err);
    }
}
try{
    connectDBAndStartServer();
    console.log("Server connected to db");
}
catch(err){
    console.log(err);
}

//start  HTTP Server
app.listen(8000,()=>{
    console.log("Server is connected to port 8000");
})
app.get("/refresh",verifyToken,async(req,res)=>{
    console.log("user is",req.user)
    let userObj=await UserModel.findOne({email:req.user.email})
    res.status(200).jsono({message:"user",payload:userObj})
})