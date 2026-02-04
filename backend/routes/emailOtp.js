const express = require("express");
const router = express.Router();
const EmailOtp = require("../models/EmailOtp");
const User = require("../models/User");
const { sendOTP } = require("../utils/sendEmail");

// SEND OTP
router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await EmailOtp.deleteMany({ email });
    await EmailOtp.create({ email, otp });

    await sendOTP(email, otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// VERIFY OTP
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await EmailOtp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await EmailOtp.deleteMany({ email });

    // Mark user verified if user exists
    const user = await User.findOne({ email });
    if (user) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
    }

    res.json({ success: true, message: "OTP verified" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
});

module.exports = router;