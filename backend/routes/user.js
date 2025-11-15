const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const { handleUpdateWorkerProfile, completeProfile } = require("../controllers/user.js");
const multer = require("multer");
const upload = multer();
const User = require("../models/user");

router.get("/:id/profile-complete/", completeProfile);

router.post(
  "/worker/updateProfile",
  verifyUser,
  upload.single("profileImage"),
  handleUpdateWorkerProfile
);

// router.post("/client/updateProfile", handleCompleteProfile);

module.exports = router;
