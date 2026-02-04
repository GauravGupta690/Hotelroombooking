const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Booking", 
      required: true 
    },

    userEmail: { 
      type: String, 
      required: true 
    },

    cardHolder: { 
      type: String, 
      required: true 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    transactionId: {  
      type: String, 
      required: true 
      // ❌ DO NOT USE unique: true
    },

    paidOn: { 
      type: Date, 
      default: Date.now 
    },

    status: { 
      type: String, 
      enum: ["Success", "Failed"], 
      default: "Success" 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);