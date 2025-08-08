const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = "your_jwt_secret"; // Use .env in production

// Register Route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin verify route
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json({ success: false, message: "Invalid token" });

    res.status(200).json({ success: true, message: "Admin verified", email: admin.email });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
