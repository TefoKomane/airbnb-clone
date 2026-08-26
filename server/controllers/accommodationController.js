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

    if (req.query.location) {
      // case insensitive partial match so "new" also matches "New York"
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    const accommodations = await Accommodation.find(filter).sort({
      createdAt: -1,
    });

    res.json(accommodations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single accommodation by id
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      res.status(404);
      throw new Error("Accommodation not found");
    }

    res.json(accommodation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accommodations that belong to the logged in host
// @route   GET /api/accommodations/host/mine
// @access  Private (host only)
const getMyAccommodations = async (req, res, next) => {
  try {
    const accommodations = await Accommodation.find({
      hostId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(accommodations);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an accommodation listing
// @route   PUT /api/accommodations/:id
// @access  Private (host only, and only the host who owns the listing)
const updateAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      res.status(404);
      throw new Error("Accommodation not found");
    }

    // make sure a host can only edit their own listings
    if (accommodation.hostId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not allowed to edit this listing");
    }

    const updatableFields = [
      "title",
      "type",
      "location",
      "description",
      "guests",
      "bedrooms",
      "bathrooms",
      "price",
      "weeklyDiscount",
