const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    await Contact.create({ name, email, message });

    res.json({ success: true, message: "Message saved successfully" });

  } catch (err) {
    console.log("CONTACT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to save message" });
  }
});

module.exports = router;