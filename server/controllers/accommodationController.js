const Accommodation = require("../models/Accommodation");

// @desc    Create a new accommodation listing
// @route   POST /api/accommodations
// @access  Private (host only)
const createAccommodation = async (req, res, next) => {
  try {
    const {
      title,
      type,
      location,
      description,
      guests,
      bedrooms,
      bathrooms,
      price,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      amenities,
      images,
      enhancedCleaning,
      selfCheckIn,
    } = req.body;

    // basic required field validation, on top of what mongoose already enforces
    if (!title || !type || !location || !description || !price) {
      res.status(400);
      throw new Error(
        "Title, type, location, description and price are all required"
      );
    }

    // if images were uploaded through multer, use those file paths
    // otherwise fall back to any image URLs sent directly in the body
    let imageList = images || [];
    if (req.files && req.files.length > 0) {
      imageList = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const accommodation = await Accommodation.create({
      title,
      type,
      location,
      description,
      guests,
      bedrooms,
      bathrooms,
      price,
      weeklyDiscount: weeklyDiscount || 0,
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      occupancyTaxes: occupancyTaxes || 0,
      amenities: Array.isArray(amenities)
        ? amenities
        : (amenities || "").split(",").map((a) => a.trim()).filter(Boolean),
      images: imageList,
      host: req.user.username,
      hostId: req.user._id,
      enhancedCleaning: !!enhancedCleaning,
      selfCheckIn: !!selfCheckIn,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accommodations, optionally filtered by location
// @route   GET /api/accommodations?location=New York
// @access  Public
const getAccommodations = async (req, res, next) => {
  try {
    const filter = {};
