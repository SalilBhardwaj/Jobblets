"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { Search, Filter, MapPin, DollarSign, Clock, Star, Bookmark, Eye, ChevronDown } from "lucide-react"

const JobFeed = () => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: "",
    minBudget: "",
    maxBudget: "",
    urgency: "",
    sortBy: "newest",
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { key: "", label: "All Categories" },
    { key: "housekeeping", label: "Housekeeping", icon: "🏠" },
    { key: "plumbing", label: "Plumbing", icon: "🔧" },
    { key: "tutoring", label: "Tutoring", icon: "📚" },
    { key: "driving", label: "Driving", icon: "🚗" },
    { key: "cooking", label: "Cooking", icon: "👨‍🍳" },
    { key: "gardening", label: "Gardening", icon: "🌱" },
  ]

  const fetchJobs = useCallback(async () => {
    setLoading(true)

    // Mock data - used as fallback when backend isn't available or returns empty
    const mockJobs = [
      {
        id: 1,
        title: "House Cleaning Service Needed",
        category: "housekeeping",
        description:
          "Looking for a reliable house cleaner for weekly cleaning of 2BHK apartment. Must be experienced and have own cleaning supplies.",
        budget: 500,
        budgetType: "fixed",
        location: "Bandra West, Mumbai",
        pincode: "400050",
        urgency: "normal",
        postedAt: "2 hours ago",
        poster: {
          name: "Priya Sharma",
          rating: 4.8,
          jobsPosted: 12,
        },
        applicants: 5,
        saved: false,
      },
      {
        id: 2,
        title: "Math Tutor for 10th Grade",
        category: "tutoring",
        description:
          "Need an experienced math tutor for my daughter who is in 10th grade. Preferably someone who can come home 3 times a week.",
        budget: 800,
        budgetType: "hourly",
        location: "Andheri East, Mumbai",
        pincode: "400069",
        urgency: "urgent",
        postedAt: "4 hours ago",
        poster: {
          name: "Rajesh Kumar",
          rating: 4.6,
          jobsPosted: 8,
        },
        applicants: 12,
        saved: true,
      },
      {
        id: 3,
        title: "Plumbing Repair - Kitchen Sink",
        category: "plumbing",
        description:
          "Kitchen sink is leaking and needs immediate repair. Looking for an experienced plumber who can fix it today.",
        budget: 300,
        budgetType: "fixed",
        location: "Powai, Mumbai",
        pincode: "400076",
        urgency: "urgent",
        postedAt: "1 hour ago",
        poster: {
          name: "Amit Patel",
          rating: 4.9,
          jobsPosted: 15,
        },
        applicants: 3,
        saved: false,
      },
      {
        id: 4,
        title: "Weekend Cooking Service",
        category: "cooking",
        description:
          "Looking for someone to cook traditional Indian meals on weekends. Must be experienced in North Indian cuisine.",
        budget: 1200,
        budgetType: "fixed",
        location: "Juhu, Mumbai",
        pincode: "400049",
        urgency: "low",
        postedAt: "6 hours ago",
        poster: {
          name: "Sunita Mehta",
          rating: 4.7,
          jobsPosted: 6,
        },
        applicants: 8,
        saved: false,
      },
    ]

    // Try fetching from backend; on failure fallback to mockJobs
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.category) params.set('category', filters.category)
      if (filters.minBudget) params.set('budget_min', filters.minBudget)
      if (filters.maxBudget) params.set('budget_max', filters.maxBudget)
      if (filters.urgency) params.set('urgency', filters.urgency)

      const base = import.meta.env.VITE_BASE_URL || ''
      const url = `${base}/job/search?${params.toString()}`

      const resp = await fetch(url, { credentials: 'include' })
      if (resp.ok) {
        const body = await resp.json()
        const serverJobs = Array.isArray(body.jobs) ? body.jobs : []

        // Map server job shape to frontend mock shape
        let mapped = serverJobs.map((j) => ({
          id: j._id || j.id,
          title: j.title,
          category: Array.isArray(j.category) ? j.category[0] : j.category,
          description: j.description,
          budget: typeof j.budget === 'number' ? j.budget : Number(j.budget) || 0,
          budgetType: j.budgetType || 'fixed',
          location: j.address?.address || '',
          pincode: j.address?.pincode || '',
          urgency: j.urgency || 'normal',
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleString() : '',
          poster: {
            name: j.createdBy?.name || j.postedBy?.name || 'Unknown',
            rating: j.createdBy?.rating || 0,
            jobsPosted: j.createdBy?.jobsPosted || 0,
          },
          applicants: Array.isArray(j.active_bids) ? j.active_bids.length : (j.active_bids ? 1 : 0),
          saved: false,
        }))

        // Apply client-side sort
        switch (filters.sortBy) {
          case 'budget-high':
            mapped.sort((a, b) => b.budget - a.budget)
            break
          case 'budget-low':
            mapped.sort((a, b) => a.budget - b.budget)
            break
          case 'newest':
          default:
            mapped.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
            break
        }

        setJobs(mapped)
        setLoading(false)
        return
      }
      // non-ok response -> fallback to mock
      console.warn('Job search failed, falling back to mock', resp.status)
    } catch (err) {
      console.warn('Failed to fetch jobs from backend, using mock data', err)
    }

    // If we reached here, use mockJobs and apply client-side filters & sort
    let filteredJobs = mockJobs

    if (filters.search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.category) {
      filteredJobs = filteredJobs.filter((job) => job.category === filters.category)
    }

    if (filters.minBudget) {
      filteredJobs = filteredJobs.filter((job) => job.budget >= Number.parseInt(filters.minBudget))
    }

    if (filters.maxBudget) {
      filteredJobs = filteredJobs.filter((job) => job.budget <= Number.parseInt(filters.maxBudget))
    }

    if (filters.urgency) {
      filteredJobs = filteredJobs.filter((job) => job.urgency === filters.urgency)
    }

    // Sort jobs
    switch (filters.sortBy) {
      case 'budget-high':
        filteredJobs.sort((a, b) => b.budget - a.budget)
        break
      case 'budget-low':
        filteredJobs.sort((a, b) => a.budget - b.budget)
        break
      case 'newest':
      default:
        // Already sorted by newest in mock
        break
    }

    setJobs(filteredJobs)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Update URL params
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.category) params.set("category", filters.category)
    setSearchParams(params)
  }

  const toggleSaveJob = (jobId) => {
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, saved: !job.saved } : job)))
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category) => {
    const categoryData = categories.find((cat) => cat.key === category)
    return categoryData?.icon || "💼"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-600 mt-2">Find local gig opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex rounded-lg shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search for jobs..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget</label>
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => handleFilterChange("minBudget", e.target.value)}
                    placeholder="₹ Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget</label>
                  <input
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => handleFilterChange("maxBudget", e.target.value)}
                    placeholder="₹ Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="budget-high">Budget: High to Low</option>
                    <option value="budget-low">Budget: Low to High</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{loading ? "Loading..." : `${jobs.length} jobs found`}</p>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />₹{job.budget}{" "}
                              {job.budgetType === "hourly" ? "/hour" : ""}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.postedAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}
                          >
                            {job.urgency}
                          </span>
                          <span className="text-sm text-gray-500">{job.applicants} applicants</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {job.poster.rating} ({job.poster.jobsPosted} jobs)
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              job.saved
                                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            <Bookmark className={`h-5 w-5 ${job.saved ? "fill-current" : ""}`} />
                          </button>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{t("viewDetails")}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    search: "",
                    category: "",
                    location: "",
                    minBudget: "",
                    maxBudget: "",
                    urgency: "",
                    sortBy: "newest",
                  })
                  setSearchParams({})
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

export default JobFeed
