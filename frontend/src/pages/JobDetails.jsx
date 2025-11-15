"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { useSelector } from "react-redux"
import { ArrowLeft, MapPin, DollarSign, Clock, Star, AlertCircle, Send, Bookmark, Share2 } from "lucide-react"

const JobDetail = () => {
  const { jobId } = useParams()
  const { t } = useLanguage()
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [bidData, setBidData] = useState({
    amount: "",
    message: "",
    timeline: "",
  })
  const [bidSubmitting, setBidSubmitting] = useState(false)

  useEffect(() => {
    fetchJobDetail()
  }, [jobId])

  const fetchJobDetail = async () => {
    setLoading(true)

    const safe = (v) => {
      if (v === undefined || v === null) return ''
      if (typeof v === 'string') return v
      try {
        return JSON.stringify(v)
      } catch {
        return String(v)
      }
    }

    // Try fetching job details from backend first
    try {
      if (!jobId) {
        throw new Error('Missing job id')
      }

      const base = import.meta.env.VITE_BASE_URL || ''
      const url = `${base}/job/${jobId}`
      const resp = await fetch(url, { credentials: 'include' })

      if (resp.ok) {
        const body = await resp.json()
        const j = body.job || body

        const mapped = {
          id: j._id || j.id,
          title: safe(j.title),
          category: Array.isArray(j.category) ? j.category[0] : j.category,
          description: safe(j.description),
          budget: typeof j.budget === 'number' ? j.budget : Number(j.budget) || 0,
          budgetType: j.budgetType || 'fixed',
          location: j.address?.address || '',
          pincode: j.address?.pincode || '',
          urgency: j.urgency || 'normal',
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleString() : '',
          startDate: j.start_date || j.startDate || '',
          endDate: j.end_date || j.endDate || '',
          timePreference: j.shift_preference || j.timePreference || '',
          requirements: safe(j.notes ?? j.requirements),
          poster: {
            id: j.createdBy?._id || j.createdBy?.id || null,
            name: j.createdBy?.name || 'Unknown',
            rating: j.createdBy?.rating || 0,
            jobsPosted: j.createdBy?.jobsPosted || 0,
            memberSince: j.createdBy?.memberSince || '',
            verified: j.createdBy?.verified || false,
            avatar: j.createdBy?.profileImage || '/placeholder.svg',
          },
          applicants: Array.isArray(j.active_bids) ? j.active_bids.length : (j.active_bids ? 1 : 0),
          saved: false,
          applied: j.applied || false,
        }

        setJob(mapped)
        setLoading(false)
        return
      }

      console.warn('Failed to fetch job details, status:', resp.status)
    } catch (err) {
      console.warn('Error fetching job details:', err)
    }

    // Fallback to mock data if backend fails or isn't available
    const mockJob = {
      id: Number.parseInt(jobId),
      title: 'House Cleaning Service Needed',
      category: 'housekeeping',
      description: `Looking for a reliable and experienced house cleaner for weekly cleaning of my 2BHK apartment in Bandra West. \n\nThe job includes:\n- Cleaning all rooms including bedrooms, living room, kitchen, and bathrooms\n- Dusting furniture and surfaces\n- Mopping floors\n- Cleaning windows (inside only)\n- Basic organizing\n\nRequirements:\n- Must have at least 2 years of experience in house cleaning\n- Should bring own cleaning supplies and equipment\n- Punctual and reliable\n- Good references preferred\n\nThe apartment is on the 5th floor with elevator access. Parking is available for two-wheelers.`,
      budget: 500,
      budgetType: 'fixed',
      location: 'Bandra West, Mumbai',
      pincode: '400050',
      urgency: 'normal',
      postedAt: '2 hours ago',
      startDate: '2024-01-20',
      endDate: '',
      timePreference: 'morning',
      requirements: 'Must have own cleaning supplies, 2+ years experience',
      poster: {
        id: 1,
        name: 'Priya Sharma',
        rating: 4.8,
        jobsPosted: 12,
        memberSince: '2023',
        verified: true,
        avatar: '/placeholder.svg?height=60&width=60',
      },
      applicants: 5,
      saved: false,
      applied: false,
    }

    // small delay to keep UX consistent with previous behavior
    setTimeout(() => {
      setJob(mockJob)
      setLoading(false)
    }, 300)
  }
  const toggleSaveJob = () => {
    setJob((prev) => ({
      ...prev,
      saved: !prev.saved,
    }))
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">{getCategoryIcon(job.category)}</span>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency}
                      </span>
                      <span className="text-sm text-gray-500">{job.applicants} applicants</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none">
                  {job.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Job Details */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Start Date</h3>
                    <p className="text-gray-600">{new Date(job.startDate).toLocaleDateString()}</p>
                  </div>
                  {job.endDate && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">End Date</h3>
                      <p className="text-gray-600">{new Date(job.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Time Preference</h3>
                    <p className="text-gray-600 capitalize">{job.timePreference || "Flexible"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Category</h3>
                    <p className="text-gray-600 capitalize">{job.category}</p>
                  </div>
                </div>

                {job.requirements && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-1">Requirements</h3>
                    <p className="text-gray-600">{job.requirements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                {user?.role === "worker" && (
                  <>
                    {job.applied ? (
                      <div className="flex items-center justify-center py-3 px-4 bg-green-100 text-green-800 rounded-lg">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Application Submitted
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowBidModal(true)}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="h-5 w-5" />
                        <span>{t("apply")}</span>
                      </button>
                    )}
                  </>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={toggleSaveJob}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 border rounded-lg transition-colors ${
                      job.saved
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${job.saved ? "fill-current" : ""}`} />
                    <span>{job.saved ? "Saved" : "Save"}</span>
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Poster Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted By</h3>
              <div className="flex items-start space-x-3">
                <img
                  src={job.poster.avatar || "/placeholder.svg"}
                  alt={job.poster.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{job.poster.name}</h4>
                    {job.poster.verified && <span className="text-blue-600">✓</span>}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{job.poster.rating}</span>
                    <span>•</span>
                    <span>{job.poster.jobsPosted} jobs posted</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Member since {job.poster.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Meet in a public place first</li>
                    <li>• Verify identity before starting work</li>
                    <li>• Use Jobblet's messaging system</li>
                    <li>• Report any suspicious activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Submit Your Bid</h3>
              <p className="text-gray-600 mt-1">Propose your rate and timeline for this job</p>
            </div>

            <form onSubmit={handleBidSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rate *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidData.amount}
                    onChange={(e) => setBidData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your rate"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Job budget: ₹{job.budget} {job.budgetType === "hourly" ? "/hour" : ""}
                </p>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  id="timeline"
                  value={bidData.timeline}
                  onChange={(e) => setBidData((prev) => ({ ...prev, timeline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select timeline</option>
                  <option value="immediately">Can start immediately</option>
                  <option value="within-24h">Within 24 hours</option>
                  <option value="within-week">Within a week</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Client *
                </label>
                <textarea
                  id="bidMessage"
                  rows={4}
                  value={bidData.message}
                  onChange={(e) => setBidData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain why you're the right person for this job..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={bidSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bidSubmitting ? "Submitting..." : "Submit Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetail
