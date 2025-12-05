import express from "express";
import {hash,compare} from "bcryptjs";
import { UserModal } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
const {sign} = jwt;
import { verifyToken } from "../middlewares/usertokenverify.js";
//connecting route
export const userRoute = express.Router();


//route for user registration

userRoute.post("/user", async(req,res)=>{
    try{
        //get user obj
        let newUser = req.body;
        console.log(req.body)
        //hash password
        let hashedPassword = await hash(newUser.password,12);
        //replace plain password with hashed password
        newUser.password = hashedPassword;
        //create new user doc
        let newUserDoc = new UserModal(newUser);
        //save in db
        await newUserDoc.save();
        //send res
        res.status(201).json({
            "message":"user Created succesfully"
        });
    } catch(err){
       res.status(400).json({"message":err.message});
    }
})

//login route
userRoute.post("/login",async(req,res)=>{
    try {
        let userData = req.body;
    console.log(userData);
    let userDataInDB = await UserModal.findOne({email:userData.email});
    if(userDataInDB){
        let isEqual = await compare(userData.password,userDataInDB.password);
        if(!isEqual){
            res.status(200).json({"message":"Incorrect Password !!"});
        }
        else{
            const token = sign({email : userData.email},"tulasiram",{expiresIn:"600s"});
            res.cookie("token",token,{httpOnly:true,secure:true,sameSite:true});
            res.status(200).json({"message":"Login Succesful"});
        }
    } else{
        res.status(200).json({"message":"No user found"});
    }
    } catch (error) {
        res.status(400).json({"message":error.message});   
    }
});

//add task route
userRoute.put("/add-task/:id",verifyToken,async(req,res)=>{
    try{
        let {id} = req.params;
        let task = req.body;
        let updatedTask = await UserModal.findByIdAndUpdate(id,{$push:{
            todos:{
                taskName: task.taskName,
                description:task.description
            }
        }},{new : true});

       if(updatedTask) res.status(200).json({"message" : "updation succesful",
            "updated data" : updatedTask
        })
        else{
            res.status(200).json({"message":"No Task Found"});
        }
    } catch(err){
        res.status(400).json({"message" :error.message});
    }
})

//edit task route
userRoute.put("/edit-task/:id/:taskid",verifyToken, async(req,res)=>{
   try{
     let {id,taskid} = req.params;
    let task = req.body;
    let updatedTask = await UserModal.findOneAndUpdate({_id:id,"todos._id":taskid},{
        $set:{
            "todos.$.taskName" : task.taskName,
            "todos.$.description":task.description
        }
    },{new : true});
    res.status(200).json({"message":"Updated Succesfully !!", "updated data":updatedTask});
   } catch(err){
        res.status(400).json({"message" :error.message});
   }
})

//set task completed route
userRoute.put("/complete-task/:id/:taskid",verifyToken, async(req,res)=>{
   try{
     const {id,taskid} = req.params;
    const taskStatus = req.body;
    let updatedTask = await UserModal.findById({_id : id, "todos._id":taskid})
    if(updatedTask){
        updatedTask.todos.id(taskid).status = taskStatus.status;
        await updatedTask.save();
        res.status(200).json({"message":"Updated Succesfully !!", "updated data":updatedTask});
    } else{
        res.status(200).json({"message":"No Task Found"});
    }
   } catch(err){
        res.status(400).json({"message" :error.message});
   }    
})

//delete task route
userRoute.delete("/delete-task/:id/:taskid",verifyToken, async(req, res)=>{
    try{
        const {id,taskid} = req.params;
        let updatedTask = await UserModal.findByIdAndUpdate(id,{$pull:{
            todos:{
                _id:taskid
            }
        }},{new : true});
        res.status(200).json({"message":"Deleted Succesfully !!", "updated data":updatedTask});
    } catch(err){
        res.status(400).json({"message" :error.message});
    }
})
