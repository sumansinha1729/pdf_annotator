import User from "../models/User";
import { signToken } from "../utils/jwt";

export async function register(req,res){
  try {
    const {name,email,password}=req.body;
  if(!email || !password) return resizeBy.status(400).json({message:"Email and Password is required"});

  const existed=await User.findOne({email});
  if(existed) return resizeBy.status(401).json({message:"User with same email is already registered"});

  const user=await User.create({email,name,password});
  const token=signToken({userId: user._id}, process.env.JWT_SECRET);
  res.status(200).json({token, user:{id: user._id, email: user.email, name:user.name}});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "registration failed" });
  }
};

export async function login(req,res){
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({message:"Invalid credentials"})
    };
    
    const token = signToken({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name || "" } });


  } catch (error) {
    console.error(error);
    res.status(500).json({message:"login failed"})
  }
};

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select("_id email name createdAt");
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: "failed to fetch profile" });
  }
}
