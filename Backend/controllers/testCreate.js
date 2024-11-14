
const WorkingSpace = require("../models/test.Workingspace.js");
exports.createWorkingSpace = async (req, res, next) => {
    try {
      const existingWorkspace = await WorkingSpace.find({ name: req.body.name });
  
      if (existingWorkspace.length > 0) {
        res.status(400).json({ success: false, message: "Name must be Unique" });
      } else{
        const workingspace = await WorkingSpace.create(req.body);
        res.status(201).json({ success: true, data: workingspace });
      }
    } catch (error) {
      res.status(400).json({ success: false });
    }
  };