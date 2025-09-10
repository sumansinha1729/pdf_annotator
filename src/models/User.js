import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";  

const userSchema=new Schema({
  name:{type:String, required:true, default:""},
  email:{type:String, required:true, unique:true, index:true},
  password:{type:String, required:true, minlength:6}
},{timestamps:true});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password, salt);
  next();
})

export default mongoose.model("User",userSchema);