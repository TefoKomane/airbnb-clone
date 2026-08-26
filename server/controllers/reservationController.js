const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res, next) => {
  try {
    const { accommodationId, checkIn, checkOut, guests, totalPrice } =
      req.body;

    if (!accommodationId || !checkIn || !checkOut || !guests) {
      res.status(400);
      throw new Error(
        "accommodationId, checkIn, checkOut and guests are all required"
      );
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      res.status(404);
      throw new Error("Accommodation not found");
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      res.status(400);
      throw new Error("Check out date must be after the check in date");
    }

    if (guests > accommodation.guests) {
      res.status(400);
      throw new Error(
        `This listing only allows up to ${accommodation.guests} guests`
      );
    }

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      guest: req.user._id,
      host: accommodation.hostId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    const populated = await reservation.populate([
      { path: "accommodation", select: "title location images price" },
      { path: "guest", select: "username email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations made on listings owned by the logged in host
// @route   GET /api/reservations/host
// @access  Private (host only)
const getReservationsByHost = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate("accommodation", "title location images")
      .populate("guest", "username email")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations made by the logged in user
// @route   GET /api/reservations/user
// @access  Private
const getReservationsByUser = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ guest: req.user._id })
      .populate("accommodation", "title location images price")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    next(error);
