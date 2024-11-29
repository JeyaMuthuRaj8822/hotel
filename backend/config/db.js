const dotenv=require('dotenv')
dotenv.config();
const mongoose= require('mongoose');

//Database Connection
const MONGO_URI=process.env.MONGO_URI;
const connectDB=async()=>{
    try{
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
    
}catch(err){
    console.error(err);
}
}

module.exports=connectDB;