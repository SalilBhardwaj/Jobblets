"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import LocationSelector from "../components/LocationSelector"
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Bookmark,
  MessageCircle,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"

const WorkerSearch = () => {
  const { t } = useLanguage()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
    minRate: "",
    maxRate: "",
    rating: "",
    experience: "",
    availability: "",
    sortBy: "rating",
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { key: "", label: "All Categories" },
    { key: "housekeeping", label: "Housekeeping" },
    { key: "plumbing", label: "Plumbing" },
    { key: "tutoring", label: "Tutoring" },
    { key: "driving", label: "Driving" },
    { key: "cooking", label: "Cooking" },
    { key: "gardening", label: "Gardening" },
  ]

  useEffect(() => {
    fetchWorkers()
  }, [filters])

  const fetchWorkers = async () => {
    setLoading(true)

    // Mock data - in real app, fetch from API with filters
    const mockWorkers = [
      {
        id: 1,
        name: "Rajesh Kumar",
        profilePhoto: "/placeholder.svg?height=80&width=80",
        bio: "Experienced house cleaner with 5+ years of professional experience.",
        location: "Bandra West, Mumbai",
        skills: ["House Cleaning", "Deep Cleaning", "Kitchen Cleaning"],
        experience: "experienced",
        hourlyRate: 200,
        rating: 4.8,
        totalReviews: 47,
        jobsCompleted: 156,
        responseTime: "2 hours",
        verified: true,
        availability: ["morning", "afternoon"],
        category: "housekeeping",
      },
      {
        id: 2,
        name: "Priya Sharma",
        profilePhoto: "/placeholder.svg?height=80&width=80",
        bio: "Professional math tutor specializing in high school curriculum.",
        location: "Andheri East, Mumbai",
        skills: ["Mathematics", "Physics", "Science"],
        experience: "intermediate",
        hourlyRate: 300,
        rating: 4.9,
        totalReviews: 32,
        jobsCompleted: 89,
        responseTime: "1 hour",
        verified: true,
        availability: ["evening", "weekends"],
        category: "tutoring",
      },
      {
        id: 3,
        name: "Amit Patel",
        profilePhoto: "/placeholder.svg?height=80&width=80",
        bio: "Licensed plumber with expertise in residential and commercial plumbing.",
        location: "Powai, Mumbai",
        skills: ["Plumbing Repair", "Installation", "Maintenance"],
        experience: "experienced",
        hourlyRate: 250,
        rating: 4.7,
        totalReviews: 63,
        jobsCompleted: 234,
        responseTime: "30 minutes",
        verified: true,
        availability: ["morning", "afternoon", "evening"],
        category: "plumbing",
      },
      {
        id: 4,
        name: "Sunita Mehta",
        profilePhoto: "/placeholder.svg?height=80&width=80",
        bio: "Expert cook specializing in North Indian and South Indian cuisine.",
        location: "Juhu, Mumbai",
        skills: ["Indian Cooking", "Meal Prep", "Catering"],
        experience: "experienced",
        hourlyRate: 180,
        rating: 4.6,
        totalReviews: 28,
        jobsCompleted: 67,
        responseTime: "3 hours",
        verified: true,
        availability: ["morning", "evening"],
        category: "cooking",
      },
    ]

    // Apply filters
    let filteredWorkers = mockWorkers

    if (filters.search) {
      filteredWorkers = filteredWorkers.filter(
        (worker) =>
          worker.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          worker.skills.some((skill) => skill.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    if (filters.category) {
      filteredWorkers = filteredWorkers.filter((worker) => worker.category === filters.category)
    }

    if (filters.minRate) {
      filteredWorkers = filteredWorkers.filter((worker) => worker.hourlyRate >= Number.parseInt(filters.minRate))
    }

    if (filters.maxRate) {
      filteredWorkers = filteredWorkers.filter((worker) => worker.hourlyRate <= Number.parseInt(filters.maxRate))
    }

    if (filters.rating) {
      filteredWorkers = filteredWorkers.filter((worker) => worker.rating >= Number.parseFloat(filters.rating))
    }

    if (filters.experience) {
      filteredWorkers = filteredWorkers.filter((worker) => worker.experience === filters.experience)
    }

    // Sort workers
    switch (filters.sortBy) {
      case "rating":
        filteredWorkers.sort((a, b) => b.rating - a.rating)
        break
      case "rate-low":
        filteredWorkers.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case "rate-high":
        filteredWorkers.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case "experience":
        filteredWorkers.sort((a, b) => b.jobsCompleted - a.jobsCompleted)
        break
      default:
        break
    }

    setTimeout(() => {
      setWorkers(filteredWorkers)
      setLoading(false)
    }, 500)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleLocationChange = (locationData) => {
    setFilters((prev) => ({
      ...prev,
      location: locationData,
    }))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getExperienceLabel = (experience) => {
    const labels = {
      fresher: "Fresher",
      beginner: "Beginner",
      intermediate: "Intermediate",
      experienced: "Experienced",
    }
    return labels[experience] || experience
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Workers</h1>
          <p className="text-gray-600 mt-2">Discover skilled professionals in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search by name or skills..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <LocationSelector
                value={filters.location}
                onChange={handleLocationChange}
                placeholder="Select location"
                showCurrentLocation={true}
              />

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={filters.minRate}
                    onChange={(e) => handleFilterChange("minRate", e.target.value)}
                    placeholder="Min rate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={filters.maxRate}
                    onChange={(e) => handleFilterChange("maxRate", e.target.value)}
                    placeholder="Max rate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange("rating", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange("experience", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Experience</option>
                    <option value="fresher">Fresher</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="rate-low">Rate: Low to High</option>
                  <option value="rate-high">Rate: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
              <span className="text-sm text-gray-600">
                {loading ? "Loading..." : `${workers.length} workers found`}
              </span>
            </div>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : workers.length > 0 ? (
            workers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={worker.profilePhoto || "/placeholder.svg"}
                        alt={worker.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {worker.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{worker.name}</h3>
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(worker.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {worker.rating} ({worker.totalReviews})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {worker.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{worker.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {worker.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {worker.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{worker.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />₹{worker.hourlyRate}/hr
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {worker.responseTime}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {getExperienceLabel(worker.experience)}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/poster/workers/${worker.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Profile
                    </Link>
                    <button className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new workers.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    search: "",
                    location: "",
                    category: "",
                    minRate: "",
                    maxRate: "",
                    rating: "",
                    experience: "",
                    availability: "",
                    sortBy: "rating",
                  })
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkerSearch
