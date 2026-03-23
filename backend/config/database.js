import mongoose from "mongoose";
import log from "../utils/logger.js";
const connectDB = async() =>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    log("success","MongoDB connected successfully!");
  }catch(error){
    log("error","Error:",error);
  }

}
export default connectDB;