"use client";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateUserProfile } from "../redux/slices/userSlice";
import {
  User,
  Upload,
  Save,
  ArrowRight,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Briefcase,
} from "lucide-react";

const skillOptions = [
  { label: "House Cleaning", value: "cleaner" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrician", value: "electrician" },
  { label: "Carpentry", value: "carpenter" },
  { label: "Tutoring", value: "tutor" },
  { label: "Babysitting", value: "babysitter" },
  { label: "Gardening", value: "gardener" },
  { label: "Painting", value: "painter" },
  { label: "Cooking", value: "cooking" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Mason", value: "mason" },
  { label: "Welder", value: "welder" },
  { label: "Tile Layer", value: "tile layer" },
  { label: "Construction Helper", value: "construction helper" },
  { label: "Driver", value: "driver" },
  { label: "Store Helper", value: "store helper" },
];

const availabilityOptions = [
  { key: "morning", label: "Morning (6 AM - 12 PM)" },
  { key: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  { key: "evening", label: "Evening (6 PM - 10 PM)" },
  { key: "night", label: "Night (10 PM - 6 AM)" },
  { key: "weekends", label: "Weekends Only" },
  { key: "flexible", label: "Flexible Hours" },
];

const categoryOptions = [
  "Housekeeping",
  "Plumbing",
  "Tutoring",
  "Driving",
  "Cooking",
  "Gardening",
  "Cleaning",
  "Repair & Maintenance",
];

const ProfileEdit = () => {
  const user = useSelector((state) => state.user.user);
  const workerProfile = useSelector((state) => state.user.workerProfile);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.role) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Set up form state based on user and workerProfile data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    profilePhoto: user?.profilePhoto || user?.profileImage || "",
    joinedDate: user?.joinedDate || "",
    // Address fields
    address: user?.address?.address || "",
    pincode: user?.address?.pincode || "",
    latitude: user?.address?.location?.coordinates?.[1] || "",
    longitude: user?.address?.location?.coordinates?.[0] || "",
    // Worker specific
    skills: workerProfile?.skills || [],
    experience: workerProfile?.experience || "",
    hourlyRate: workerProfile?.hourlyRate || "",
    availability: workerProfile?.availability || [],
    portfolio: workerProfile?.portfolio || [],
    rating: workerProfile?.rating || "",
    completedJobs: workerProfile?.completedJobs || "",
    // Client specific
    companyName: user?.companyName || "",
    companyType: user?.companyType || "",
    businessAddress: user?.businessAddress || "",
    preferredCategories: user?.preferredCategories || [],
    totalJobsPosted: user?.totalJobsPosted || "",
    averageRating: user?.averageRating || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      profilePhoto: user?.profilePhoto || user?.profileImage || "",
      joinedDate: user?.joinedDate || "",
      address: user?.address?.address || "",
      pincode: user?.address?.pincode || "",
      latitude: user?.address?.location?.coordinates?.[1] || "",
      longitude: user?.address?.location?.coordinates?.[0] || "",
      skills: workerProfile?.skills || [],
      experience: workerProfile?.experience || "",
      hourlyRate: workerProfile?.hourlyRate || "",
      availability: workerProfile?.availability || [],
      portfolio: workerProfile?.portfolio || [],
      rating: workerProfile?.rating || "",
      completedJobs: workerProfile?.completedJobs || "",
      companyName: user?.companyName || "",
      companyType: user?.companyType || "",
      businessAddress: user?.businessAddress || "",
      preferredCategories: user?.preferredCategories || [],
      totalJobsPosted: user?.totalJobsPosted || "",
      averageRating: user?.averageRating || "",
    });
  }, [user, workerProfile]);

  const [errors, setErrors] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (
        name === "skills" ||
        name === "availability" ||
        name === "preferredCategories"
      ) {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "File size must be less than 5MB",
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "Please select an image file",
      }));
      return;
    }
    setUploadingPhoto(true);
    try {
      // Set preview for UI
      const photoUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file, // store the File object for upload
        profilePhotoPreview: photoUrl, // for preview only
      }));
      setErrors((prev) => ({ ...prev, profilePhoto: "" }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "Failed to upload photo",
      }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    // if (!formData.location.trim()) {
    //   newErrors.location = "Location is required";
    // }
    if (user.role === "worker") {
      if (formData.skills.length === 0) {
        newErrors.skills = "Please select at least one skill";
      }
      if (!formData.experience) {
        newErrors.experience = "Experience is required";
      }
      if (!formData.hourlyRate) {
        newErrors.hourlyRate = "Hourly rate is required";
      } else if (Number(formData.hourlyRate) < 50) {
        newErrors.hourlyRate = "Hourly rate should be at least ₹50";
      }
      if (formData.availability.length === 0) {
        newErrors.availability = "Please select your availability";
      }
    }
    if (user.role === "client") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company/Organization name is required";
      }
      if (!formData.companyType) {
        newErrors.companyType = "Company type is required";
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = "Business address is required";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      if (user.role === "worker") {
        navigate("/worker/dashboard");
      } else if (user.role === "client") {
        navigate("/poster/dashboard");
      }
    } catch (err) {
      setErrors({ submit: "Failed to update profile. Please try again." });
    }
  };

  const selectedSkillLabels = formData.skills
    .map((val) => skillOptions.find((opt) => opt.value === val)?.label)
    .filter(Boolean);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Display (fixed, not toggleable) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <input
            type="text"
            value={user.role}
            disabled
            readOnly
            className="w-40 px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
          />
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {formData.profilePhotoPreview ? (
                    <img
                      src={formData.profilePhotoPreview}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5MB, JPG/PNG only
                  </p>
                </div>
              </div>
              {errors.profilePhoto && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profilePhoto}
                </p>
              )}
            </div>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio / About Yourself
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell others about yourself, your experience, and what makes you unique..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/500
              </p>
            </div>
            {/* Location */}
            {/* <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your location"
              /> */}
            {/* {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div> */}
            {/* Address Fields */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your pincode"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Latitude"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Longitude"
                />
              </div>
            </div>
            {/* Worker Specific Fields */}
            {user.role === "worker" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formData.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Jobs Completed</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formData.completedJobs}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {formData.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Skills & Services *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillOptions.map((skill) => (
                      <label key={skill.value} className="flex items-center">
                        <input
                          type="checkbox"
                          name="skills"
                          value={skill.value}
                          checked={formData.skills.includes(skill.value)}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {skill.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                  )}
                </div>
                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Experience Level *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.experience ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select experience level</option>
                    <option value="fresher">Fresher (0-1 years)</option>
                    <option value="beginner">Beginner (1-2 years)</option>
                    <option value="intermediate">
                      Intermediate (2-5 years)
                    </option>
                    <option value="experienced">Experienced (5+ years)</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.experience}
                    </p>
                  )}
                </div>
                {/* Hourly Rate */}
                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Expected Hourly Rate (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      id="hourlyRate"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.hourlyRate ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="150"
                      min="50"
                    />
                  </div>
                  {errors.hourlyRate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hourlyRate}
                    </p>
                  )}
                </div>
                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability *
                  </label>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <label key={option.key} className="flex items-center">
                        <input
                          type="checkbox"
                          name="availability"
                          value={option.key}
                          checked={formData.availability.includes(option.key)}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.availability}
                    </p>
                  )}
                </div>
              </>
            )}
            {/* Client Specific Fields */}
            {user.role === "client" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formData.averageRating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Jobs Posted</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formData.totalJobsPosted}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {formData.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company/Organization Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter company or organization name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companyName}
                    </p>
                  )}
                </div>
                {/* Company Type */}
                <div>
                  <label
                    htmlFor="companyType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Type *
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyType ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="individual">Individual/Personal</option>
                    <option value="small-business">Small Business</option>
                    <option value="startup">Startup</option>
                    <option value="company">Company</option>
                    <option value="ngo">NGO/Non-Profit</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.companyType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companyType}
                    </p>
                  )}
                </div>
                {/* Business Address */}
                <div>
                  <label
                    htmlFor="businessAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Address *
                  </label>
                  <textarea
                    id="businessAddress"
                    name="businessAddress"
                    rows={3}
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessAddress
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your business address"
                  />
                  {errors.businessAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessAddress}
                    </p>
                  )}
                </div>
                {/* Preferred Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Service Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryOptions.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          name="preferredCategories"
                          value={category}
                          checked={formData.preferredCategories.includes(
                            category
                          )}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Submit */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            {errors.submit && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {errors.submit}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
export const selectLatitude = (state) =>
  state.user.user?.address?.location?.coordinates?.[1];
export const selectLongitude = (state) =>
  state.user.user?.address?.location?.coordinates?.[0];
