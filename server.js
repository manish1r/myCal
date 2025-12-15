const express=require("express");
const mongo=require("mongoose");
const cors=require("cors");

const app=express();
app.use(express.json());
app.use(cors());

mongo.connect("mongodb+srv://manish_calender:mani%40832%23@mycalender.jualbno.mongodb.net/?retryWrites=true&w=majority&appName=mycalender",{})
.then(()=>{console.log("Connected Sucessfully");})
.catch((err)=>{
    console.log("Unable to connect : ",err);
});

const User=mongo.model("User",new mongo.Schema({
    username:String,
    email:String,
    password:String,
    mobileNumber:String
}));

const Task=mongo.model("Task",new mongo.Schema({
    userId:{type:mongo.Schema.Types.ObjectId,ref:"User",required:true},
    date:Date,
    discription:String,
    time:String
}));

const Reminder=mongo.model("Reminder",new mongo.Schema({
    userId:{type:mongo.Schema.Types.ObjectId,ref:"User",required:true},
    discription:String,
    time:String,
    duration:String,
    date:Date
}));

app.get("/users",async(req,res)=>{
    try{
        const users=await User.find({},"username email password");
        res.json(users);
    }
    catch(err){
        console.log("Error in fetching : ",err);
    }
});

app.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username,password});
    if(user){
        res.json({status:true,message:"sucessful login",userId:user._id});
    }
    else res.json({status:false,message:"unsecussful login"});
});

app.post("/register",async(req,res)=>{
    const {username,email,password,mobileNumber}=req.body;
    try{
        const euser=await User.findOne({username});
        const eemail=await User.findOne({email});   
        if(euser){
            return res.status(500).json({sucess:false,message:"Username already exists"});
        }  
        if(eemail){
            return res.status(500).json({sucess:false,message:"Email already exists"});
        }
        const newuser=new User({username,email,password,mobileNumber});
        const savedUser=await newuser.save();
        console.log("Saved User /r : ",savedUser,"|||");
        res.json({success:true,message:"Registration Sucessfull",user:{_id:savedUser._id,username:savedUser.username}});
    }
    catch(err){
        console.log("Error in registration : ",err);
        res.status(500).json({success:false,message:"Error in Registration"});
    }
});

app.post("/task",async(req,res)=>{
    const{userId,date,discription,time}=req.body;
    try{
        const newTask=new Task({userId,date,discription,time});
        await newTask.save();
        res.json({success:true,message:"Task added sucessfully"});
    }
    catch(err){
        console.log("Error in adding the task : ",err);
        res.status(500).json({success:false,message:"Server Error"});
    }
});

app.get("/task/upcoming",async(req,res)=>{
    const{userId}=req.query;
    try{
        const tasks=await Task.find({userId});
        const taskList=[];
        // console.log("Tasks from server /upcoming : ",tasks);
        tasks.forEach(task=>{
            taskList.push(task);
        });
        // console.log("TaskList : ",taskList);
        res.json({success:true,tasks:taskList});
    }
    catch(err){
        console.log("Error in fetching the upcoming dates : ",err);
        res.status(500).json({success:false,message:"Server error /task/upcoming"});
    }
});

app.post("/dailyreminder",async(req,res)=>{
    const{userId,discription,time,duration,date}=req.body;
    try{
        const newReminder=new Reminder({userId,discription,time,duration,date});
        await newReminder.save();
        res.json({success:true,message:"Daily Reminder added sucessfully"});
    }
    catch(err){
        console.log("Error in adding the Reminder : ",err);
        res.status(500).json({success:false,message:"Server Error"});
    }
});

app.get("/dailyreminder/upcoming",async(req,res)=>{
    const{userId}=req.query;
    try{
        const reminders=await Reminder.find({userId});
        const reminderList=[];
        // console.log("Reminders from server /upcoming : ",reminders);
        reminders.forEach(reminder=>{
            reminderList.push(reminder);
        });
        // console.log("ReminderList : ",reminderList);
        res.json({success:true,reminders:reminderList});
    }
    catch(err){
        console.log("Error in finding the daily reminders : ",err);
        res.status(500).json({success:false,message:"Server error /dailyreminder/upcoming"});
    }
});

app.listen(3030,()=>{console.log("server is running on http://localhost:3030");});