const nodemailer = require("nodemailer");

// 🔧 COMMON TRANSPORTER (reuse for all emails)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================== SEND OTP ===================== */
exports.sendOTP = async (email, otp) => {
  console.log("🔧 EMAIL CONFIG CHECK:", process.env.EMAIL_USER);

  try {
    await transporter.verify();
    console.log("✅ SMTP Ready");

    await transporter.sendMail({
      from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("📨 OTP SENT SUCCESSFULLY");
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err);
    throw err;
  }
};

/* ================= BOOKING CONFIRMATION EMAIL ================= */
exports.sendBookingEmail = async (email, booking, transactionId) => {
  try {
    await transporter.sendMail({
      from: `"StayEase Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Booking Confirmed - StayEase",
      html: `
        <h2>🎉 Your Booking is Confirmed!</h2>

        <p><b>Hotel:</b> ${booking.hotelName}</p>
        <p><b>Area:</b> ${booking.hotelArea}</p>

        <p><b>Room Number:</b> ${booking.roomNumber || "Will be assigned at check-in"}</p>
        <p><b>Total Stay:</b> ${booking.totalDays} days</p>

        <p><b>Check-in:</b> ${new Date(booking.checkInDate).toDateString()}</p>
        <p><b>Check-out:</b> ${new Date(booking.checkOutDate).toDateString()}</p>

        <p><b>Total Amount Paid:</b> ₹${booking.totalAmount}</p>
        <p><b>Payment ID:</b> ${transactionId}</p>

        <br/>
        <p>Thank you for choosing <b>StayEase</b> ❤️</p>
      `,
    });

    console.log("📧 BOOKING CONFIRMATION EMAIL SENT");
  } catch (err) {
    console.error("❌ BOOKING EMAIL ERROR:", err);
  }
};