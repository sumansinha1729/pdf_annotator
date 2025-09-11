import { verifyToken } from "../utils/jwt.js";

export function authRequired(req,res,next){
  const header=req.headers.authorization || "";
  const token=header.startsWith("Bearer ")? header.slice(7) : null;
  if(!token) return res.status(401).json({message:"token not found"});

  try {
    const decoded=verifyToken(token, process.env.JWT_SECRET);
    req.userId=decoded.userId;
    next();
  } catch (error) {
    console.log("error: ",error.message);
    return res.status(401).json({message:"Invalid or expired token"})
  }
};