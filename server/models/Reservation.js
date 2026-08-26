const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, "Check in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check out date is required"],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// a small guard so a checkout date can never be before the check in date
reservationSchema.pre("validate", function (next) {
  if (this.checkIn && this.checkOut && this.checkOut < this.checkIn) {
    next(new Error("Check out date cannot be before the check in date"));
    return;
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
