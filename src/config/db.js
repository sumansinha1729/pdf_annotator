import mongoose from "mongoose";

export const connectDB=async(uri)=>{
  try {
    await mongoose.connect(uri,{dbName:"pdf_annotator"});
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error: ",error.message);
    process.exit(1);
  }
};
