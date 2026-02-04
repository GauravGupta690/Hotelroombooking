const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true },

    hotelName: { type: String, required: true },
    hotelArea: { type: String, required: true },
    pricePerNight: { type: Number, required: true },

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },

    /* ✅ NEW: TOTAL STAY DAYS */
    totalDays: { type: Number, required: true },

    totalAmount: { type: Number, required: true },

    /* ✅ NEW: ROOM NUMBER (Auto assign later) */
    roomNumber: { type: Number },

    /* ✅ NEW: AADHAAR NUMBER */
    aadhaarNumber: { type: String, required: true },

    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    },

    remarks: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);