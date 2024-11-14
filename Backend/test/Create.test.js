const { createWorkingSpace } = require("../controllers/testCreate.js");
const WorkingSpace = require("../models/test.Workingspace.js");

describe("createWorkingSpace", () => {
  it("should create a new working space when the name is unique", async () => {
    const req = {
      body: {
        name: "Unique Space",
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    WorkingSpace.find = jest.fn().mockResolvedValue([]);

    const mockWorkingSpace = {
      _id: "mock-id",
      name: "Unique Space",
    };

    WorkingSpace.create = jest.fn().mockResolvedValue(mockWorkingSpace);

    await createWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockWorkingSpace,
    });
  });

  it("should return an error when the name is not unique", async () => {
    const req = {
      body: {
        name: "Existing Space",
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    WorkingSpace.find = jest.fn().mockResolvedValue([{ name: "Existing Space" }]);

    await createWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Name must be Unique",
    });
  });

  it("should return an error when an error occurs during creation", async () => {
    const req = {
      body: {
        name: "Unique Space",
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    WorkingSpace.find = jest.fn().mockResolvedValue([]);

    WorkingSpace.create = jest
      .fn()
      .mockRejectedValue(new Error("Some error occurred"));

    await createWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });
});
