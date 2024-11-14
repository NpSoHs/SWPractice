const { updateWorkingSpace } = require("../controllers/testEdit.js");
const WorkingSpace = require("../models/test.Workingspace.js");

describe("updateWorkingSpace", () => {
    it("should update the working space with valid input", async () => {
      const req = {
        params: { id: "mock-id" },
        body: {
          name: "Updated Space Name",
          address: "Updated Address",
        },
      };
  
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
  
      const mockWorkingSpace = {
        _id: "mock-id",
        name: "Updated Space Name",
        address: "Updated Address",
      };
  
      WorkingSpace.findByIdAndUpdate = jest.fn().mockResolvedValue(mockWorkingSpace);
  
      await updateWorkingSpace(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockWorkingSpace });
    });
  
    it("should return status 400 when no working space is found", async () => {
      const req = {
        params: { id: "invalid-id" },
        body: {},
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      WorkingSpace.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  
      await updateWorkingSpace(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false });
    });
  
    it("should return status 400 when an error occurs during update", async () => {
      const req = {
        params: { id: "mock-id" },
        body: {
          name: "Updated Space Name",
          address: "Updated Address",
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      const errorMessage = "Update error occurred";
      WorkingSpace.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      await updateWorkingSpace(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false });
    });
  });