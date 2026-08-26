const express = require("express");
const router = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  getMyAccommodations,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");
const { protect, isHost } = require("../middleware/auth");
const upload = require("../middleware/upload");

// specific routes are declared before the /:id route so "host/mine" is
// never accidentally treated as an id
