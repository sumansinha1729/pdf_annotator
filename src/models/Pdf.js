import mongoose, { mongo, Schema } from "mongoose";

const pdfSchema=new Schema({
  uuid:{type:String, required:true, unique:true, index:true},
  user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true, index:true},
  originalName:{type:String, required:true},
  storedName:{type:String, required:true},
  displayName:{type:String, default:""}
},{timestamps:true});

export default mongoose.model("Pdf", pdfSchema);