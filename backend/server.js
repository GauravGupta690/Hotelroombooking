require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

/* ---------- ROUTES ---------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/email-otp", require("./routes/emailOtp"));
app.use("/api/contact", require("./routes/contact"));   // ✅ ADDED CONTACT ROUTE

/* ---------- HOME ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Hotel Booking API Running ✔️");
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));