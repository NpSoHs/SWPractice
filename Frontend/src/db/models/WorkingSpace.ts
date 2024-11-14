import mongoose from "mongoose";
const SpaceSchema = new mongoose.Schema({
    reserveDate: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    workingSpace: {
      type: mongoose.Schema.ObjectId,
      ref: "WorkingSpace",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const Space = mongoose.models.Space || mongoose.model("Space",SpaceSchema);
  export default Space