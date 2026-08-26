const mongoose = require("mongoose");

// this schema matches the recommended data structure from the project brief
// with a few extra fields the frontend needs for the location cards and filter
const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Accommodation type is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Price per night is required"],
      min: 0,
    },
    weeklyDiscount: {
      type: Number,
      default: 0,
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    occupancyTaxes: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    host: {
      type: String,
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enhancedCleaning: {
      type: Boolean,
      default: false,
    },
    selfCheckIn: {
      type: Boolean,
      default: false,
    },
    specificRatings: {
      cleanliness: { type: Number, default: 4.5 },
      communication: { type: Number, default: 4.5 },
      checkIn: { type: Number, default: 4.5 },
      accuracy: { type: Number, default: 4.5 },
      location: { type: Number, default: 4.5 },
      value: { type: Number, default: 4.5 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
