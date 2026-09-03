const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res, next) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } =
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

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      res.status(400);
      throw new Error("Check in and check out must be valid dates");
    }

    if (endDate <= startDate) {
      res.status(400);
      throw new Error("Check out date must be after the check in date");
    }

    if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      res.status(400);
      throw new Error("Check in date cannot be in the past");
    }

    if (Number(guests) < 1 || Number(guests) > accommodation.guests) {
      res.status(400);
      throw new Error(
        `This listing only allows up to ${accommodation.guests} guests`
      );
    }

    const overlappingReservation = await Reservation.findOne({
      accommodation: accommodationId,
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (overlappingReservation) {
      res.status(409);
      throw new Error("This listing is already reserved for those dates");
    }

    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeklyDiscount = nights >= 7 ? accommodation.weeklyDiscount : 0;
    const calculatedTotal =
      accommodation.price * nights -
      weeklyDiscount +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      guest: req.user._id,
      host: accommodation.hostId,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPrice: calculatedTotal,
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
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private (the guest who booked it, or the host who owns the listing)
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    const isGuest = reservation.guest.toString() === req.user._id.toString();
    const isHostOfListing =
      reservation.host.toString() === req.user._id.toString();

    if (!isGuest && !isHostOfListing) {
      res.status(403);
      throw new Error("You are not allowed to cancel this reservation");
    }

    await reservation.deleteOne();
    res.json({ message: "Reservation removed", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
};
