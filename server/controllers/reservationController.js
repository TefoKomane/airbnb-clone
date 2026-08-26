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
