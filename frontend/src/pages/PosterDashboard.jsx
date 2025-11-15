"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { Plus, Briefcase, Users, Clock, DollarSign, Eye, Edit, Trash2, Star, MapPin } from "lucide-react"
import { useSelector } from "react-redux"
const PosterDashboard = () => {
  const { t } = useLanguage()
  // const { user } = useAuth()
  const user = useSelector((state) => state.user.user)
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalBids: 0,
    completedJobs: 0,
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockJobs = [
      {
        id: 1,
        title: "House Cleaning Service",
        category: "housekeeping",
        budget: 500,
        location: "Mumbai, 400001",
        status: "active",
        bids: 5,
        createdAt: "2024-01-15",
        description: "Need regular house cleaning service for 2BHK apartment",
      },
      {
        id: 2,
        title: "Plumbing Repair",
        category: "plumbing",
        budget: 800,
        location: "Mumbai, 400001",
        status: "completed",
        bids: 3,
        createdAt: "2024-01-10",
        description: "Kitchen sink repair needed urgently",
      },
      {
        id: 3,
        title: "Math Tutoring",
        category: "tutoring",
        budget: 1200,
        location: "Mumbai, 400001",
        status: "active",
        bids: 8,
        createdAt: "2024-01-12",
        description: "Need math tutor for 10th grade student",
      },
    ]

    setJobs(mockJobs)
    setStats({
      totalJobs: mockJobs.length,
      activeJobs: mockJobs.filter((job) => job.status === "active").length,
      totalBids: mockJobs.reduce((sum, job) => sum + job.bids, 0),
      completedJobs: mockJobs.filter((job) => job.status === "completed").length,
    })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and connect with gig workers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/poster/jobs/new"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{t("postJob")}</h3>
                  <p className="text-sm text-gray-500">Create a new job posting</p>
                </div>
              </Link>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <Users className="h-8 w-8 text-gray-400" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Review Bids</h3>
                  <p className="text-sm text-gray-500">{stats.totalBids} pending bids</p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <DollarSign className="h-8 w-8 text-gray-400" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Payments</h3>
                  <p className="text-sm text-gray-500">Manage transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Jobs</h2>
              <Link to="/poster/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span>₹{job.budget}</span>
                          <span>{job.bids} bids</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{job.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosterDashboard
