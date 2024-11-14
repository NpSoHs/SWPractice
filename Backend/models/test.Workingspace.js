const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkingStationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: [true, "Name must be unique"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    tel: {
      type: String,
      match: [/^\d+$/, "Tel must only contain digits"],
      minlength: [10, "Tel must have 10 digits"],
      maxlength: [10, "Tel must have 10 digits"]
    },
    openTime: {
      type: Date,
      required: [true, "Please add open time"],
    },
    closeTime: {
      type: Date,
      required: [true, "Please add close time"],
    },
    maxSeat: {
      type: Number,
      required: [true, "Please add max seat"],
      default: 20,
    },
    image: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);