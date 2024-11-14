const express = require("express");
const { unbanUser, banUser } = require("../controllers/user");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/unban").put(protect, authorize("admin", "moderator"), unbanUser);
router.route("/ban").put(protect, authorize("admin", "moderator"), banUser);
module.exports = router;