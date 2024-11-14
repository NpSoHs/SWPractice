const Reservation = require("../models/Reservation");
const WorkingSpace = require("../models/WorkingSpace");
const ReservasionLog = require("../models/ReservasionLog");
const { getAvailableSeat } = require("./workingspace");
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc)
dayjs.extend(timezone);
exports.getAllReservation = async (req, res, next) => {
  let query;

  // General users can see only their reservation
  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    query = Reservation.find({ user: req.user.id })
      .populate({
        path: "workingSpace",
        select: "name address tel",
      })
      .populate({
        path: "user",
        select: "name email",
      });
  } else {
    // if you are an admin, u can see it all
    if (req.params.workingSpaceId) {
      console.log(req.params.workingSpaceId);

      query = Reservation.find({
        workingSpace: req.params.workingSpaceId,
      })
        .populate({
          path: "workingSpace",
          select: "name address tel",
        })
        .populate({
          path: "user",
          select: "name email",
        });
    } else {
      query = Reservation.find()
        .populate({
          path: "workingSpace",
          select: "name address tel",
        })
        .populate({
          path: "user",
          select: "name email",
        });
    }
  }

  try {
    const reservation = await query;

    res.status(200).json({
      success: true,
      count: reservation.length,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "workingSpace",
      select: "name description tel",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}1`,
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find reservation" });
  }
};

exports.addReservation = async (req, res, next) => {
  try {
    if (!req.body.startTime) {
      return res.status(400).json({
        success: false,
        message: `User does not provided start time`,
      });
    }
    if (!req.body.endTime) {
      return res.status(400).json({
        success: false,
        message: `User does not provided end time`,
      });
    }
    if (req.body.endTime <= req.body.startTime) {
      return res.status(400).json({
        success: false,
        message: `Invalid end time`,
      });
    }
    req.body.workingSpace = req.params.workingSpaceId;

    const workingspace = await WorkingSpace.findById(req.params.workingSpaceId);
    if (!workingspace) {
      return res.status(404).json({
        success: false,
        message: `No working space with the id of ${req.params.workingSpaceId}`,
      });
    }
    const availableSeat = await getAvailableSeat(
      req.params.workingSpaceId,
      req.body.startTime,
      req.body.endTime
    );
    if (availableSeat <= 0) {
      return res.status(400).json({
        success: false,
        message: `No available seat for this time slot`,
      });
    }
    // add user Id to req.body
    req.body.user = req.user.id;
    // Check for existed reservation
    const userQuota = await getUserAvailableQuota(req.body.startTime, req.user.id);
    //If the user is not an admin, they can only create > 3 reservation/day.
    if (
      userQuota <= 0 &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(400).json({
        success: false,
        message: `You has exceeded the maximum quota of reservations`,
      });
    }
    const reservation = await Reservation.create(req.body);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Reservation" });
  }
};
// ok
exports.updateReservation = async (req, res, next) => {
  try {
    if (req.body.startTime || req.body.endTime) {
      if (!req.body.startTime) {
        return res.status(400).json({
          success: false,
          message: `User does not provided start time`,
        });
      }
      if (!req.body.endTime) {
        return res.status(400).json({
          success: false,
          message: `User does not provided end time`,
        });
      }
      if (req.body.endTime <= req.body.startTime) {
        return res.status(400).json({
          success: false,
          message: `Invalid end time`,
        });
      }
    }

    let reservation = await Reservation.findById(req.params.id)
      .populate({
        path: "workingSpace",
        select: "name",
      })
      .populate({ path: "user", select: "name" });


    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the reservation owner
    if (
      reservation.user.id !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }
    // Log the edit reservation
    // compare the start time in the reservation and the new start time
    const startTime = new Date(reservation.startTime);
    const newStartTime = new Date(req.body.startTime);
    const endTime = new Date(reservation.endTime);
    const newEndTime = new Date(req.body.endTime);
    if (startTime.toISOString() === newStartTime.toISOString() && endTime.toISOString() === newEndTime.toISOString()) {
      return res.status(400).json({
        success: false,
        message: `No change in reservation`,
      });
    }

    await addEditReservationLog(
      req.params.id,
      reservation.startTime,
      req.body.startTime,
      reservation.endTime,
      req.body.endTime,
      reservation.toJSON(),
      reservation.user.id
    );

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Reservation" });
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate({
        path: "workingSpace",
        select: "name",
      })
      .populate({ path: "user", select: "name" });
    console.log(typeof reservation);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    // Make sure user is the reservation owner
    if (
      reservation.user.id !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this reservation`,
      });
    }
    if (
      (req.user.role === "admin" || req.user.role === "moderator") &&
      req.user.id !== reservation.user.id
    ) {
      // Log the Forced Cancel reservation
      await addCancelReservationLog(
        req.params.id,
        reservation.toJSON(),
        true,
        reservation.user.id
      );
    } else {
      // Log the cancel reservation
      await addCancelReservationLog(
        req.params.id,
        reservation.toJSON(),
        false,
        reservation.user.id
      );
    }
    await reservation.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Reservation" });
  }
};

exports.clearSpace = async (req, res, next) => {
  try {
    const workingspace = await WorkingSpace.findById(req.params.id);

    if (!workingspace) {
      return res.status(400).json({
        success: false,
        message: `No working space with the id of ${req.params.id}1`,
      });
    }

    const clearReservations = await Reservation.deleteMany({
      workingSpace: req.params.id,
    });

    return res
      .status(200)
      .json({ success: true, message: "This working space is cleared" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Reservation" });
  }
};

exports.getUserReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.find({ user: req.user.id }).populate({
      path: "workingSpace",
      select: "name description tel",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}1`,
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find reservation" });
  }
};

exports.getUserReservationQuota = async (req, res, next) => {
  try {
    console.log(req.body.selectedDate, req.user.id);
    const userQuotaLeft = await getUserAvailableQuota(
      req.body.selectedDate,
      req.user.id
    );

    console.log("date: ", req.body.selectedDate, "quota: ", userQuotaLeft);
    res.status(200).json({
      success: true,
      data: userQuotaLeft > 0 ? userQuotaLeft : 0,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Cannot get Reservation Quota" });
  }
};

const getUserAvailableQuota = async (selectedDate, userId) => {
  let existedReservation;
  if (!selectedDate) {

    const today = dayjs().startOf('day').toDate()
    const till = dayjs().endOf('day').toDate()

    console.log("searching quota for today:", today.toISOString + " till " + till.toISOString())
    existedReservation = await Reservation.find({
      user: userId,
      // find the match startingdate
      startTime: { $gte: today, $lte: till },
    });
  } else {
    console.log("receive dt string:", selectedDate);
    const selectedDate_ = dayjs(selectedDate).startOf('day').toDate()
    const till = dayjs(selectedDate).endOf('day').toDate()

    console.log("searching quota for  date:", selectedDate_.toISOString() + " till " + till.toISOString())
    existedReservation = await Reservation.find({
      user: userId,
      // find the match startingdate
      startTime: { $gte: selectedDate_, $lte: till },
    });
  }

  return (3 - existedReservation.length);
}

// Function to add reservation log for editing
const addEditReservationLog = async (
  reservationId,
  beforeEditStartTime,
  afterEditStartTime,
  beforeEditEndTime,
  afterEditEndTime,
  editedReservation,
  user
) => {
  const reservationLog = await ReservasionLog.create({
    reservationId,
    action: "edit",
    beforeEditStartTime,
    afterEditStartTime,
    beforeEditEndTime,
    afterEditEndTime,
    reservationOrigin: editedReservation,
    user: user,
  });
  // return { success: true, message: 'Edit Reservation Log added successfully', data: reservationLog };
};

// Function to add reservation log for cancellation
const addCancelReservationLog = async (
  reservationId,
  canceledReservation,
  forced = false,
  user
) => {
  const reservationLog = await ReservasionLog.create({
    reservationId,
    action: forced ? "forceCancel" : "cancel",
    reservationOrigin: canceledReservation,
    user: user,
  });
  // return { success: true, message: 'Cancel Reservation Log added successfully', data: reservationLog };
};

exports.getLogReservation = async (req, res, next) => {
  let query;

  // General users can see only their reservation
  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    query = ReservasionLog.find({ user: req.user.id });
  } else {
    // if you are an admin, u can see it all
    query = ReservasionLog.find();
  }

  try {
    const reservationLog = await query;
    console.log(reservationLog);
    console.log(req.user.id);
    res.status(200).json({
      success: true,
      data: reservationLog,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Log Appointment" });
  }
};
