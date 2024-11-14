const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { getLogReservation } = require("../controllers/reservation");

router.route("/reservation").get(protect, getLogReservation);

module.exports = router;
