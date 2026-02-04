const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, gender, password, mobile } = req.body;

    if (!name || !surname || !email || !gender || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      surname,
      email,
      gender,
      password,     // plain text password
      phone: mobile,
      isVerified: true
    });

    res.status(201).json({ message: "Registration successful", user });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // PLAIN PASSWORD CHECK
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;