const mongoose = require("mongoose");

const jobCategories = Object.freeze([
  "domestic",
  "repair",
  "construction",
  "tutoring",
  "driving",
  "gardening",
  "store keeping",
]);

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const jobSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enums: ["completed", "ongoing", "open"],
      default: "open",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [
        {
          type: String,
        },
      ],
    },
    budget: {
      type: String,
      required: true,
    },
    address: {
      address: { type: String },
      pincode: { type: String },
      location: pointSchema,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      default: null,
    },
    urgency: {
      type: String,
      enums: ["low", "normal", "urgent"],
      default: "normal",
    },
    shift_preference: {
      type: String,
      enums: ["morning", "afternoon", "evening", "flexible"],
      default: "flexible",
    },
    notes: {
      types: String,
    },
    hired_worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active_bids: {
      type: {
        counter_offer: {
          type: String,
        },
        worker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enums: ["active", "rejected", "accepted"],
        },
      },
    },
  },
  { timestamps: true }
);

const Job = new mongoose.model('Job', jobSchema);
module.exports = Job;