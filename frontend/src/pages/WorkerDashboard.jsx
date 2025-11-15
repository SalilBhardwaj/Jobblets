"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { Search, Calendar, DollarSign, Star, Clock, MapPin, Bookmark, TrendingUp, Award, Eye } from "lucide-react"
import { useSelector } from "react-redux"
const WorkerDashboard = () => {
  const { t } = useLanguage()
  // const { user } = useAuth()
  const user = useSelector((state) => state.user.user)
  const [todayJobs, setTodayJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    rating: 0,
    activeApplications: 0,
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockTodayJobs = [
      {
        id: 1,
        title: "House Cleaning",
        client: "Priya Sharma",
        time: "10:00 AM",
        location: "Bandra West",
        payment: 500,
        status: "confirmed",
      },
      {
        id: 2,
        title: "Math Tutoring",
        client: "Rajesh Kumar",
        time: "4:00 PM",
        location: "Andheri East",
        payment: 800,
        status: "pending",
      },
    ]

    const mockSavedJobs = [
      {
        id: 3,
        title: "Weekend Cooking Service",
        budget: 1200,
        location: "Powai",
        postedAt: "2 hours ago",
        category: "cooking",
      },
      {
        id: 4,
        title: "Garden Maintenance",
        budget: 600,
        location: "Juhu",
        postedAt: "5 hours ago",
        category: "gardening",
      },
    ]

    setTodayJobs(mockTodayJobs)
    setSavedJobs(mockSavedJobs)
    setStats({
      totalEarnings: 15420,
      completedJobs: 23,
      rating: 4.8,
      activeApplications: 5,
    })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      housekeeping: "🏠",
      plumbing: "🔧",
      tutoring: "📚",
      driving: "🚗",
      cooking: "👨‍🍳",
      gardening: "🌱",
    }
    return icons[category] || "💼"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Good morning, {user?.fullName}!</h1>
          <p className="text-gray-600 mt-2">Ready to take on new opportunities today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Schedule
                  </h2>
                  <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {todayJobs.length > 0 ? (
                  todayJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex-shrink-0">
                              <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">Client: {job.client}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 ml-8">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />₹{job.payment}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs scheduled today</h3>
                    <p className="text-gray-500 mb-4">Browse available jobs to fill your schedule</p>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/jobs"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <Search className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600">Browse Jobs</h3>
                      <p className="text-sm text-gray-500">Find new opportunities</p>
                    </div>
                  </Link>

                  <Link
                    to="/worker/saved"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                  >
                    <Bookmark className="h-8 w-8 text-gray-400 group-hover:text-green-500" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-green-600">Saved Jobs</h3>
                      <p className="text-sm text-gray-500">{savedJobs.length} saved jobs</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Saved Jobs */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bookmark className="h-5 w-5 mr-2" />
                    Saved Jobs
                  </h2>
                  <Link to="/worker/saved" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {savedJobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getCategoryIcon(job.category)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{job.title}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>₹{job.budget}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{job.postedAt}</p>
                      </div>
                      <button className="text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile completeness</span>
                    <span className="font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Basic info completed
                    </div>
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Skills added
                    </div>
                    <div className="flex items-center text-gray-400">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      Portfolio images
                    </div>
                    <div className="flex items-center text-gray-400">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      Verification documents
                    </div>
                  </div>
                  <Link
                    to="/profile/edit"
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mt-4"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDashboard
