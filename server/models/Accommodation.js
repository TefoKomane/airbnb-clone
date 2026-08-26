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
