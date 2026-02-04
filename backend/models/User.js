const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },

    // PLAIN PASSWORD ONLY
    password: { type: String, required: true },

    phone: { type: String, default: "" },

    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);