const Reservation = require("../models/Reservation");
const WorkingSpace = require("../models/WorkingSpace");

exports.getAllWorkingSpace = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeField = ["select", "sort", "page", "limit"];

    // Loop over remove fields and delete them from reqQuery
    removeField.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    console.log(queryStr);
    // Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // finding resource
    query = WorkingSpace.find(JSON.parse(queryStr)).populate("reservation");

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("name");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await WorkingSpace.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const workingspace = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({
      success: true,
      count: workingspace.length,
      pagination,
      data: workingspace,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getWorkingSpace = async (req, res, next) => {
  try {
    const workingspace = await WorkingSpace.findById(req.params.id).populate(
      "reservation"
    );

    if (!workingspace) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: workingspace });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createWorkingSpace = async (req, res, next) => {
  try {
    const maxSeat = req.body.maxSeat;
    if (maxSeat < 1 || maxSeat > 5000) {
      return res.status(400).json({ success: false, message: "Max seat must be between 1 and 5000" });
    }
    const existingWorkspace = await WorkingSpace.find({ name: req.body.name });

    if (existingWorkspace.length > 0) {
      return res.status(400).json({ success: false, message: "Name must be Unique" });
    } else {
      const workingspace = await WorkingSpace.create(req.body);
      return res.status(201).json({ success: true, data: workingspace });
    }
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};

exports.updateWorkingSpace = async (req, res, next) => {
  try {
    const workingspace = await WorkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workingspace) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, data: workingspace });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};

exports.deleteWorkingSpace = async (req, res, next) => {
  try {
    const workingspace = await WorkingSpace.findById(req.params.id);

    if (!workingspace) {
      return res.status(400).json({ success: false });
    }

    await workingspace.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.checkAvailableSeat = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const workingSpaceId = req.params.id;
    const availableSeats = await getAvailableSeat(workingSpaceId, startTime, endTime);

    res.status(200).json({
      success: true,
      availableSeats: availableSeats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }

};

async function getAvailableSeat(workingSpaceId, startTime, endTime) {

  const workingspace = await WorkingSpace.findById(workingSpaceId);
  if (!workingspace) {
    return res
      .status(404)
      .json({ success: false, message: "Working space not found" });
  }
  const overlappingReservations = await Reservation.find({
    workingSpace: workingSpaceId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  const availableSeats = workingspace.maxSeat - overlappingReservations.length;
  return availableSeats > 0 ? availableSeats : 0;
}
exports.getAvailableSeat = getAvailableSeat;