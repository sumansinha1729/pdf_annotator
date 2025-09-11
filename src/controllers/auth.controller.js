import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "email already in use" });

    const user = await User.create({ email, password, name });
    const token = signToken({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name || "" } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const token = signToken({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name || "" } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select("_id email name createdAt");
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: "failed to fetch profile" });
  }
}
