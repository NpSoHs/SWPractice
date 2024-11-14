const express = require("express");
const {
  getAllReservation,
  addReservation,
  getReservation,
  updateReservation,
  deleteReservation,
  clearSpace,
  getUserReservation,
  getUserReservationQuota
} = require("../controllers/reservation");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getAllReservation)
  .post(protect, authorize("admin", "user", "moderator"), addReservation);
router
  .route("/:id")
  .get(protect, getReservation)
  .put(protect, authorize("admin", "user", "moderator"), updateReservation)
  .delete(protect, authorize("admin", "user", "moderator"), deleteReservation);
router
  .route("/user/:id")
  .get(protect, getUserReservation)

router.route("/clear/:id").delete(protect, authorize("admin", "moderator"), clearSpace);
router.route('/quota').post(protect, getUserReservationQuota);
module.exports = router;
