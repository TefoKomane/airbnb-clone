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
router.get("/host/mine", protect, isHost, getMyAccommodations);

router
  .route("/")
  .get(getAccommodations)
  .post(protect, isHost, upload.array("images", 10), createAccommodation);

router
  .route("/:id")
  .get(getAccommodationById)
  .put(protect, isHost, upload.array("images", 10), updateAccommodation)
  .delete(protect, isHost, deleteAccommodation);

module.exports = router;
