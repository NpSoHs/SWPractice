const User = require("../models/User");
const generator = require("generate-password");
const dayjs = require('dayjs');
require('dayjs/locale/th'); // เพิ่ม locale สำหรับภาษาไทย
const utc = require('dayjs/plugin/utc'); // เพิ่ม plugin สำหรับการจัดการกับ timezone
dayjs.extend(utc);
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, tel } = req.body;
    // Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
    });

    // Create token
    // const token = user.getSignedJwtToken();

    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false });
    console.log(error.stack);
  }
};

exports.editUser = async (req, res,next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //   Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    //   Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //   Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invaild credentials." });
    }
    if (user.banUntil) {
      const banUntil = dayjs(user.banUntil).utcOffset(7); // UTC+7 เป็น timezone ของไทย
      const now = dayjs().utcOffset(7); // UTC+7 เป็น timezone ของไทย
      if (now.isBefore(banUntil)) {
        return res.status(401).json({
          success: false,
          msg: "You are banned until " + banUntil.format('dddd YYYY-MM-DD HH:mm:ss'),
          ban: true,
          banUntil: banUntil.format('YYYY-MM-DD HH:mm:ss'),
          banReason: user.banReason
        });
      }
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

// implement get all user
exports.getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find({ role: "user" });
    // const user = await checkTimeoutBan(users);
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getAllRoles = async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    data: user,
  });
}; 

// delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No User with the id of ${req.params.id}`,
      });
    }
    //Make sure user role is the moderator
    if (req.user.role !== "moderator") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this user`,
      });
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete user" });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

exports.createAdmin = async (req, res, next) => {
  try {
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const { name, email, tel } = req.body;
    const role = "admin";
    // Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
    });
    // Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    res.status(200).json({
      success: true,
      user:user,
      password: password
    });
  } catch (error) {
    res.status(400).json({ success: false });
    console.log(error.stack);
  }
};

// const checkTimeoutBan = async (users) => {
//   const currentDate = new Date();
//   const userData = users
//   for (let i = 0; i < userData.length; i++) {
//     const user = userData[i];
//     if (currentDate > user.banUntil) {
//       await User.findByIdAndUpdate(user._id, { banUntil: null, banReason: null });
//       userData[i] = await User.findById(user._id);
//     }
//   }
//   return userData;
// };

