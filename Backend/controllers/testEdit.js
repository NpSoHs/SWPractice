const WorkingSpace = require("../models/test.Workingspace.js");
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
  
      res.status(200).json({ success: true, data: workingspace });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  };