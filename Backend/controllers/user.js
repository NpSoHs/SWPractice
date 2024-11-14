const User = require("../models/User");

exports.banUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.body.userId}`,
      });
    }
    if (user.role === "admin" || user.role === "moderator") {
      return res.status(400).json({
        success: false,
        message: `Cannot ban admin or moderator`,
      });
    }
    const banUntil = new Date(req.body.banUntil);
    const now = new Date();

    if (now > banUntil) {
      return res.status(400).json({
        success: false,
        message: `Invalid ban date`,
      });
    }

    const banReason = req.body.banReason;
    if (!banReason) {
      return res.status(400).json({
        success: false,
        message: `Please provide a ban reason`,
      });
    }
    await user.updateOne({ banUntil: banUntil, banReason: banReason })
    return res.status(200).json({ success: true, message: "User " + user.name + " has been banned until " + banUntil + " for " + banReason });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot ban user" });
  }
}

exports.unbanUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.body.userId}`,
      });
    }

    user = await User.findByIdAndUpdate(req.body.userId, { banUntil: null }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot unban user" });
  }
};