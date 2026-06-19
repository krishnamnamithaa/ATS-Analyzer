import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// In-memory fallback database for development testing when MongoDB is offline
const mockUsers = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields (name, email, password)" });
  }

  try {
    if (isDbConnected()) {
      const user = await User.create({ name, email, password });
      return res.json({ _id: user._id, name: user.name, email: user.email });
    } else {
      console.warn("MongoDB not connected. Registering user in mock database.");
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const user = {
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password
      };
      mockUsers.push(user);
      return res.json({ _id: user._id, name: user.name, email: user.email });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      console.warn("MongoDB not connected. Checking credentials in mock database.");
      user = mockUsers.find((u) => u.email === email);
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret_12345"
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export { mockUsers };
