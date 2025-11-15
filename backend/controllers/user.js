const User = require("../models/user");
const WorkerProfile = require("../models/workerProfile");
const { uploadImage } = require("../utils/uploader");

const handleUpdateWorkerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let formData = req.body.formData;

    let profileImageUrl = formData.profilePhoto;
    if (req.file) {
      const result = await uploadImage(
        req.file.buffer,
        req.file.originalname || "profile"
      );
      profileImageUrl = result.secure_url;
    }

    // Fetch current user to preserve existing address/location fields
    const userDoc = await User.findById(userId);

    // Update address as a nested object with location
    const userUpdateFields = {};
    if (formData.name) userUpdateFields.name = formData.name;
    if (
      formData.address ||
      formData.pincode ||
      formData.latitude ||
      formData.longitude
    ) {
      userUpdateFields.address = {
        address: formData.address || userDoc.address?.address || "",
        pincode: formData.pincode || userDoc.address?.pincode || "",
        location: {
          type: "Point",
          coordinates: [
            formData.longitude !== undefined && formData.longitude !== ""
              ? Number(formData.longitude)
              : userDoc.address?.location?.coordinates?.[0] ?? 0,
            formData.latitude !== undefined && formData.latitude !== ""
              ? Number(formData.latitude)
              : userDoc.address?.location?.coordinates?.[1] ?? 0,
          ],
        },
      };
    }
    if (profileImageUrl) userUpdateFields.profileImage = profileImageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdateFields },
      { new: true }
    );

    let workerProfile = await WorkerProfile.findOne({ user: userId });
    if (!workerProfile) {
      workerProfile = new WorkerProfile({ user: userId });
    }
    if (formData.skills) workerProfile.skills = formData.skills;
    if (formData.status) workerProfile.status = formData.status;
    if (formData.verification_status)
      workerProfile.verification_status = formData.verification_status;
    if (formData.completed_jobs)
      workerProfile.completed_jobs = formData.completed_jobs;
    if (formData.ongoing_jobs)
      workerProfile.ongoing_jobs = formData.ongoing_jobs;
    if (formData.experience) workerProfile.experience = formData.experience;
    if (formData.hourlyRate) workerProfile.hourlyRate = formData.hourlyRate;
    if (formData.availability)
      workerProfile.availability = formData.availability;

    await workerProfile.save();

    res.json({ user: updatedUser, workerProfile });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const completeProfile = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  return res.status(200).json({ profileComplete: user.profile_complete });
}

module.exports = { handleUpdateWorkerProfile, completeProfile };
