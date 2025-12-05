//create server
import express from "express";
import {connect} from "mongoose";
import cookieParser from "cookie-parser";
import {userRoute} from "./APIs/UserAPI.js";
const app = express();
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
app.listen(8080,()=>{
    console.log("Server is connected to port 8080");
})