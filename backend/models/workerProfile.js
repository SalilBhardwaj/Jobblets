const mongoose = require("mongoose");
const ALLOWED_SKILLS = Object.freeze([
  "plumbing",
  "electrician",
  "carpenter",
  "cleaner",
  "tutor",
  "babysitter",
  "gardener",
  "painter",
  "cooking",
  "cleaning",
  "mason",
  "welder",
  "tile layer",
  "construction helper",
  "driver",
  "store helper",
]);

const workerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verification_status: {
    type: String,
    enums: ["verified", "pending", "rejected"],
    default: "pending",
  },
  status: {
    type: String,
    enums: ["working", "open", "inactive"],
    default: "open",
  },
  reviews: {
    type: {
      rating: Number,
      comment: String,
    },
  },
  skills: {
    type: [
      {
        type: String,
        enum: ALLOWED_SKILLS,
      },
    ],
    default: undefined,
    validate: {
      validator: (arr) => {
        return Array.isArray(arr) && new Set(arr).size === arr.length;
      },
      message: "Duplicate skills are not allowed.",
    },
  },
  experience: {
    type: String,
    enum: ["fresher", "beginner", "intermediate", "experienced"],
    default: "fresher",
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  availability: {
    type: [String],
    default: [],
  },
  completed_jobs: {
    type: {
      jobs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Job",
      },
      completed_at: {
        type: Date,
        default: Date.now,
      },
    },
  },
  ongoing_jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
  },
});
// skills, jobs_completed, reviews,  verification_docs profile_photo verification_status status
const WorkerProfile = new mongoose.model('WorkerProfile', workerProfileSchema);
module.exports = WorkerProfile;