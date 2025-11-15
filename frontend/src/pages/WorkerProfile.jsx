"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { useSelector } from "react-redux"
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle,
  Camera,
  ArrowLeft,
} from "lucide-react"

const WorkerProfile = () => {
  const { workerId } = useParams()
  const { t } = useLanguage()
  // const { user } = useAuth()
  const user = useSelector((state) => state.user.user)
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    fetchWorkerProfile()
  }, [workerId])

  const fetchWorkerProfile = async () => {
    setLoading(true)

    // Mock data - in real app, fetch from API
    const mockWorker = {
      id: Number.parseInt(workerId),
      name: "Rajesh Kumar",
      profilePhoto: "/placeholder.svg?height=120&width=120",
      bio: "Experienced house cleaner with 5+ years of professional experience. I take pride in providing thorough and reliable cleaning services. I bring my own supplies and equipment, and I'm known for my attention to detail and punctuality.",
      location: {
        address: "Bandra West, Mumbai, Maharashtra 400050",
        pincode: "400050",
      },
      skills: ["House Cleaning", "Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning"],
      experience: "experienced",
      hourlyRate: 200,
      availability: ["morning", "afternoon", "weekends"],
      rating: 4.8,
      totalReviews: 47,
      jobsCompleted: 156,
      responseTime: "2 hours",
      verified: true,
      memberSince: "2022",
      languages: ["Hindi", "English", "Marathi"],
      portfolio: [
        { id: 1, image: "/placeholder.svg?height=200&width=200", title: "Kitchen Deep Clean" },
        { id: 2, image: "/placeholder.svg?height=200&width=200", title: "Living Room Cleaning" },
        { id: 3, image: "/placeholder.svg?height=200&width=200", title: "Bathroom Sanitization" },
        { id: 4, image: "/placeholder.svg?height=200&width=200", title: "Complete House Cleaning" },
      ],
      reviews: [
        {
          id: 1,
          reviewer: "Priya Sharma",
          rating: 5,
          comment: "Excellent work! Very thorough and professional. Will definitely hire again.",
          date: "2024-01-10",
          jobTitle: "House Cleaning",
        },
        {
          id: 2,
          reviewer: "Amit Patel",
          rating: 5,
          comment: "Rajesh did an amazing job cleaning our apartment. Very reliable and trustworthy.",
          date: "2024-01-05",
          jobTitle: "Deep Cleaning",
        },
        {
          id: 3,
          reviewer: "Sunita Mehta",
          rating: 4,
          comment: "Good service, arrived on time and completed the work as promised.",
          date: "2023-12-28",
          jobTitle: "Kitchen Cleaning",
        },
      ],
    }

    setTimeout(() => {
      setWorker(mockWorker)
      setLoading(false)
    }, 500)
  }

  const getExperienceLabel = (experience) => {
    const labels = {
      fresher: "Fresher (0-1 years)",
      beginner: "Beginner (1-2 years)",
      intermediate: "Intermediate (2-5 years)",
      experienced: "Experienced (5+ years)",
    }
    return labels[experience] || experience
  }

  const getAvailabilityLabel = (availability) => {
    const labels = {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
      weekends: "Weekends",
      flexible: "Flexible",
    }
    return labels[availability] || availability
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : index < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">The worker profile you're looking for doesn't exist.</p>
          <Link
            to="/poster/workers"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Workers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/poster/workers" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Workers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={worker.profilePhoto || "/placeholder.svg"}
                      alt={worker.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {worker.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{worker.name}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {worker.location.address.split(",")[0]}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Responds in {worker.responseTime}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(worker.rating)}
                            <span className="text-sm font-medium text-gray-900 ml-1">{worker.rating}</span>
                            <span className="text-sm text-gray-500">({worker.totalReviews} reviews)</span>
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{worker.jobsCompleted} jobs completed</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">₹{worker.hourlyRate}/hr</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {getExperienceLabel(worker.experience).split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { key: "about", label: "About" },
                    { key: "portfolio", label: "Portfolio" },
                    { key: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.availability.map((time, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                          >
                            {getAvailabilityLabel(time)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === "portfolio" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Portfolio</h3>
                    {worker.portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {worker.portfolio.map((item) => (
                          <div key={item.id} className="relative group">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No portfolio images available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({worker.totalReviews})</h3>
                    <div className="space-y-4">
                      {worker.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.reviewer}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center">{renderStars(review.rating)}</div>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{review.jobTitle}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            {user?.role === "poster" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>

                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Bookmark className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-gray-900">{worker.jobsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">{worker.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{worker.memberSince}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">{worker.location.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">₹{worker.hourlyRate}/hour</span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Always meet in a safe location first</li>
                <li>• Verify identity before hiring</li>
                <li>• Use Jobblet's messaging system</li>
                <li>• Report any suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile
