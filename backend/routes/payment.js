const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { sendBookingEmail } = require("../utils/sendEmail");

// ===================== MAKE PAYMENT =====================
router.post("/", async (req, res) => {
  try {
    const { bookingId, amount, cardHolder, userEmail } = req.body;

    if (!bookingId || !amount || !cardHolder || !userEmail) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      bookingId,
      userEmail,
      cardHolder,
      amount,
      transactionId,
      paidOn: new Date()
    });

    // ✅ UPDATE BOOKING
    booking.isPaid = true;
    booking.status = "Confirmed";
    booking.paymentId = payment._id;
    await booking.save();

    // 📧 EMAIL WITH ROOM NUMBER
    await sendBookingEmail(userEmail, booking, transactionId);

    // ✅ SEND ROOM NUMBER TO FRONTEND ALSO
    res.json({
      success: true,
      message: "Payment successful",
      payment,
      roomNumber: booking.roomNumber,
      totalDays: booking.totalDays,
      hotelName: booking.hotelName,
      hotelArea: booking.hotelArea,
      totalAmount: booking.totalAmount
    });

  } catch (err) {
    console.log("❌ PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

module.exports = router;