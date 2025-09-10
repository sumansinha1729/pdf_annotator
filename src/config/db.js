import mongoose from "mongoose";

const connectDB=async(uri)=>{
  try {
    await mongoose.connect(uri,{dbName:"pdf_annotator"})
  } catch (error) {
    console.log("MongoDB connection error: ",error.message);
    process.exit(1);
  }
};

export default connectDB;