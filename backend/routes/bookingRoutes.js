const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

/* ================= CREATE BOOKING ================= */
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      hotelName,
      hotelArea,
      pricePerNight,
      checkInDate,
      checkOutDate,
      adults,
      children,
      aadhaarNumber   // ✅ NEW
    } = req.body;

    if (
      !userEmail ||
      !hotelName ||
      !hotelArea ||
      !pricePerNight ||
      !checkInDate ||
      !checkOutDate ||
      !aadhaarNumber
    ) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const guests = Number(adults) + Number(children);

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    const totalAmount = nights * pricePerNight;

    /* ================= ROOM ASSIGN LOGIC ================= */

    const overlappingBookings = await Booking.find({
      hotelName,
      status: { $ne: "Cancelled" },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn }
    });

    // 🚫 Hotel full (4 rooms max)
    if (overlappingBookings.length >= 4) {
      return res.status(400).json({
        success: false,
        message: "This hotel is fully booked for selected dates"
      });
    }

    // 🏨 Room Numbers: 402, 403, 404, 405
    const availableRooms = [402, 403, 404, 405];
    const assignedRooms = overlappingBookings.map(b => b.roomNumber);
    const roomNumber = availableRooms.find(r => !assignedRooms.includes(r));

    /* ===================================================== */

    const booking = await Booking.create({
      userEmail,
      hotelName,
      hotelArea,
      pricePerNight,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalAmount,
      totalDays: nights,
      aadhaarNumber,
      roomNumber,          // ✅ SAVE ROOM NUMBER
      status: "Pending",
      isPaid: false,
    });

    res.json({ success: true, booking });

  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

/* ================= GET USER BOOKINGS ================= */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.query.email }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/* ================= CANCEL BOOKING ================= */
router.post("/cancel/:id", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
});

module.exports = router;