const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createReservation);
router.get("/host", protect, getReservationsByHost);
router.get("/user", protect, getReservationsByUser);
router.delete("/:id", protect, deleteReservation);

module.exports = router;
