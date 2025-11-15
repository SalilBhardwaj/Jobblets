"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { ArrowLeft, ArrowRight, MapPin, DollarSign, Calendar } from "lucide-react"

import { useSelector } from "react-redux"

const CreateJob = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    budgetType: "fixed",
    location: "",
    pincode: "",
    startDate: "",
    endDate: "",
    timePreference: "",
    urgency: "normal",
    requirements: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const categories = [
    { key: "housekeeping", label: "Housekeeping", icon: "🏠" },
    { key: "plumbing", label: "Plumbing", icon: "🔧" },
    { key: "tutoring", label: "Tutoring", icon: "📚" },
    { key: "driving", label: "Driving", icon: "🚗" },
    { key: "cooking", label: "Cooking", icon: "👨‍🍳" },
    { key: "gardening", label: "Gardening", icon: "🌱" },
    { key: "cleaning", label: "Cleaning", icon: "🧹" },
    { key: "repair", label: "Repair & Maintenance", icon: "🔨" },
  ]

  const steps = [
    { number: 1, title: "Basic Details", description: "Job title and category" },
    { number: 2, title: "Description", description: "Job details and requirements" },
    { number: 3, title: "Budget & Location", description: "Pricing and location details" },
    { number: 4, title: "Schedule", description: "Timeline and preferences" },
    { number: 5, title: "Review", description: "Review and publish" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Job title is required"
        if (!formData.category) newErrors.category = "Please select a category"
        break
      case 2:
        if (!formData.description.trim()) newErrors.description = "Job description is required"
        if (formData.description.length < 50) newErrors.description = "Description should be at least 50 characters"
        break
      case 3:
        if (!formData.budget) newErrors.budget = "Budget is required"
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
        break
      case 4:
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        break
    }

    return newErrors
  }

  const nextStep = () => {
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(4)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/job/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
        credentials: 'include'
      });
      const res = await response.json();
      // In real app, send data to API
      console.log("Job created:", res);

      // Redirect to dashboard
      navigate("/poster/dashboard")
    } catch (error) {
      setErrors({ submit: "Failed to create job. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t("jobTitle")} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="e.g., House cleaning service needed"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t("category")} *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleChange({ target: { name: "category", value: category.key } })}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${formData.category === category.key
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t("jobDescription")} *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Describe the job in detail. Include what needs to be done, any specific requirements, and what you're looking for in a worker."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/500</p>
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special skills, tools, or qualifications needed?"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t("budget")} *</label>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="budgetType"
                      value="fixed"
                      checked={formData.budgetType === "fixed"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Fixed Price
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="budgetType"
                      value="hourly"
                      checked={formData.budgetType === "hourly"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Hourly Rate
                  </label>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.budget ? "border-red-300" : "border-gray-300"
                      }`}
                    placeholder={formData.budgetType === "fixed" ? "Enter total budget" : "Enter hourly rate"}
                  />
                </div>
                {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                {t("location")} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.location ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="e.g., Bandra West, Mumbai"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.pincode ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="e.g., 400050"
                maxLength={6}
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? "border-red-300" : "border-gray-300"
                      }`}
                  />
                </div>
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="timePreference" className="block text-sm font-medium text-gray-700 mb-2">
                Time Preference
              </label>
              <select
                id="timePreference"
                name="timePreference"
                value={formData.timePreference}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                <option value="evening">Evening (6 PM - 10 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Urgency Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "low", label: "Low", desc: "Can wait a week" },
                  { value: "normal", label: "Normal", desc: "Within 2-3 days" },
                  { value: "urgent", label: "Urgent", desc: "ASAP" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: "urgency", value: option.value } })}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${formData.urgency === option.value
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Title</h4>
                  <p className="text-gray-900">{formData.title}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Category</h4>
                  <p className="text-gray-900 capitalize">{formData.category}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-gray-900">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Budget</h4>
                    <p className="text-gray-900">
                      ₹{formData.budget} {formData.budgetType === "hourly" ? "/hour" : "fixed"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Location</h4>
                    <p className="text-gray-900">{formData.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Start Date</h4>
                    <p className="text-gray-900">{new Date(formData.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Urgency</h4>
                    <p className="text-gray-900 capitalize">{formData.urgency}</p>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && <div className="text-sm text-red-600 text-center">{errors.submit}</div>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/poster/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t("createJob")}</h1>
          <p className="text-gray-600 mt-2">Fill in the details to post your job and connect with local gig workers</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                    }`}
                >
                  {step.number}
                </div>
                <div className="ml-3 hidden md:block">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600 mt-1">{steps[currentStep - 1].description}</p>
          </div>

          <div className="p-6">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("loading") : "Publish Job"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJob
