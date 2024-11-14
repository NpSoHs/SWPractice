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
      max: [5000, "Max seat can not be more than 5000"],
      min: [1, "Max seat can not be less than 1"],
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

// Cascade delete reservations when a working space is deleted
WorkingStationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Reservations being removed from working space ${this._id}`);
    await this.model("Reservation").deleteMany({ workingSpace: this.__id });
    next();
  }
);

// Reverse poppulate with virtuals
WorkingStationSchema.virtual("reservation", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "workingSpace",
  justOne: false,
});

module.exports = mongoose.model("WorkingSpace", WorkingStationSchema);
