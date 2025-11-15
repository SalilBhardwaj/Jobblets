"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import LocationSelector from "../components/LocationSelector"
import { User, Upload, Save, ArrowRight } from "lucide-react"
import { useSelector } from "react-redux"
import { selectBusy, selectUser } from "../redux/slices/userSlice"

const ProfileComplete = () => {
  const { t } = useLanguage()
  // const { user, login } = useAuth()
  // const user = useSelector(state => state.user.user);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    // Common fields
    bio: "",
    location: "",
    profilePhoto: null,

    // Worker specific
    skills: [],
    experience: "",
    hourlyRate: "",
    availability: [],
    portfolio: [],

    // Poster specific
    companyName: "",
    companyType: "",
    businessAddress: "",
    preferredCategories: [],
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const skillOptions = [
    "House Cleaning",
    "Deep Cleaning",
    "Plumbing",
    "Electrical Work",
    "Carpentry",
    "Painting",
    "Gardening",
    "Cooking",
    "Tutoring",
    "Driving",
    "Delivery",
    "Pet Care",
    "Elder Care",
    "Baby Sitting",
  ]

  const availabilityOptions = [
    { key: "morning", label: "Morning (6 AM - 12 PM)" },
    { key: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
    { key: "evening", label: "Evening (6 PM - 10 PM)" },
    { key: "night", label: "Night (10 PM - 6 AM)" },
    { key: "weekends", label: "Weekends Only" },
    { key: "flexible", label: "Flexible Hours" },
  ]

  const categoryOptions = [
    "Housekeeping",
    "Plumbing",
    "Tutoring",
    "Driving",
    "Cooking",
    "Gardening",
    "Cleaning",
    "Repair & Maintenance",
  ]


  const user = useSelector((state) => state.user);
  const busy = useSelector(selectBusy);  // true while login/signup in flight

  useEffect(() => {
    if (busy) return <p>Loading…</p>;
    console.log(user);
    // 2. Not authenticated → kick back to login
    if (!user || !user.user.id) return navigate("/login");

    if (user.ProfileComplete) {
      navigate(user.role === "client" ? "/client/dashboard" : "/worker/dashboard")
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      if (name === "skills" || name === "availability" || name === "preferredCategories") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData,
    }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({ ...prev, profilePhoto: "File size must be less than 5MB" }))
      return
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profilePhoto: "Please select an image file" }))
      return
    }

    setUploadingPhoto(true)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real app, upload to cloud storage and get URL
      const photoUrl = URL.createObjectURL(file)

      setFormData((prev) => ({
        ...prev,
        profilePhoto: photoUrl,
      }))

      setErrors((prev) => ({ ...prev, profilePhoto: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, profilePhoto: "Failed to upload photo" }))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Common validations
    // if (!formData.bio.trim()) {
    //   newErrors.bio = "Bio is required"
    // } else if (formData.bio.length < 50) {
    //   newErrors.bio = "Bio should be at least 50 characters"
    // }

    if (!formData.location) {
      newErrors.location = "Location is required"
    }

    // Worker specific validations
    if (user?.role === "worker") {
      if (formData.skills.length === 0) {
        newErrors.skills = "Please select at least one skill"
      }

      if (!formData.experience) {
        newErrors.experience = "Experience is required"
      }

      if (!formData.hourlyRate) {
        newErrors.hourlyRate = "Hourly rate is required"
      } else if (Number(formData.hourlyRate) < 50) {
        newErrors.hourlyRate = "Hourly rate should be at least ₹50"
      }

      if (formData.availability.length === 0) {
        newErrors.availability = "Please select your availability"
      }
    }

    // Poster specific validations
    if (user?.role === "poster") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company/Organization name is required"
      }

      if (!formData.companyType) {
        newErrors.companyType = "Company type is required"
      }

      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = "Business address is required"
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user data
      const updatedUser = {
        ...user,
        profile_completed: true,
        ...formData,
      }

      login(updatedUser)

      // Redirect based on role
      if (user.role === "poster") {
        navigate("/poster/dashboard")
      } else {
        navigate("/worker/dashboard")
      }
    } catch (error) {
      setErrors({ submit: "Failed to complete profile. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help others know more about you by completing your profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Basic Info</span>
            </div>
            <div className="w-12 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-blue-600 font-medium">Profile Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Verification</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto || "/placeholder.svg"}
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
                  <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG only</p>
                </div>
              </div>
              {errors.profilePhoto && <p className="mt-1 text-sm text-red-600">{errors.profilePhoto}</p>}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About Yourself 
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.bio ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Tell others about yourself, your experience, and what makes you unique..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.bio.length}/500</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <LocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="Select your location"
                required
                showCurrentLocation={true}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Worker Specific Fields */}
            {user.role === "worker" && (
              <>
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Skills & Services *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillOptions.map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          name="skills"
                          value={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                  {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.experience ? "border-red-300" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select experience level</option>
                    <option value="fresher">Fresher (0-1 years)</option>
                    <option value="beginner">Beginner (1-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="experienced">Experienced (5+ years)</option>
                  </select>
                  {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Hourly Rate (₹) *
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.hourlyRate ? "border-red-300" : "border-gray-300"
                      }`}
                    placeholder="e.g., 150"
                    min="50"
                  />
                  {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Availability *</label>
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
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
                </div>
              </>
            )}

            {/* Poster Specific Fields */}
            {user.role === "poster" && (
              <>
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.companyName ? "border-red-300" : "border-gray-300"
                      }`}
                    placeholder="Enter company or organization name"
                  />
                  {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                </div>

                {/* Company Type */}
                <div>
                  <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.companyType ? "border-red-300" : "border-gray-300"
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
                  {errors.companyType && <p className="mt-1 text-sm text-red-600">{errors.companyType}</p>}
                </div>

                {/* Business Address */}
                <div>
                  <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    id="businessAddress"
                    name="businessAddress"
                    rows={3}
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.businessAddress ? "border-red-300" : "border-gray-300"
                      }`}
                    placeholder="Enter your business address"
                  />
                  {errors.businessAddress && <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>}
                </div>

                {/* Preferred Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Service Categories (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryOptions.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          name="preferredCategories"
                          value={category}
                          checked={formData.preferredCategories.includes(category)}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Submit */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            {errors.submit && <div className="mb-4 text-sm text-red-600 text-center">{errors.submit}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completing Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Complete Profile
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileComplete
