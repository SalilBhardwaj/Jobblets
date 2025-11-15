const mongoose = require("mongoose");
const clientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verification_status: {
    type: String,
    enums: ["verified", "pending", "rejected"],
    default: "pending",
  },
  reviews: {
    type: {
      rating: Number,
      comment: String,
    },
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
  active_jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
  },
});
const ClientProfile = new mongoose.model('ClientProfile', clientProfileSchema);
module.exports = ClientProfile;