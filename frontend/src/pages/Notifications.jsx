"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { useSelector } from "react-redux"
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Briefcase,
  MessageCircle,
  Star,
  DollarSign,
  Calendar,
} from "lucide-react"

const Notifications = () => {
  const { t } = useLanguage()
  // const { user } = useAuth()/
  const user = useSelector((state) => state.user.user)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)

    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        type: "bid_received",
        title: "New Bid Received",
        message: "Rajesh Kumar submitted a bid of ₹200/hr for your House Cleaning job",
        data: { jobId: 1, bidAmount: 200, workerName: "Rajesh Kumar" },
        read: false,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        type: "job_hired",
        title: "Job Assignment",
        message: "You have been hired for the Math Tutoring job by Priya Sharma",
        data: { jobId: 2, posterName: "Priya Sharma" },
        read: false,
        createdAt: "2024-01-15T09:15:00Z",
      },
      {
        id: 3,
        type: "message_received",
        title: "New Message",
        message: "Amit Patel sent you a message about the Plumbing Repair job",
        data: { conversationId: "3", senderName: "Amit Patel" },
        read: true,
        createdAt: "2024-01-15T08:45:00Z",
      },
      {
        id: 4,
        type: "job_completed",
        title: "Job Completed",
        message: "House Cleaning job has been marked as completed. Please leave a review.",
        data: { jobId: 4, workerName: "Sunita Mehta" },
        read: true,
        createdAt: "2024-01-14T16:20:00Z",
      },
      {
        id: 5,
        type: "review_received",
        title: "New Review",
        message: "You received a 5-star review from Rajesh Kumar",
        data: { rating: 5, reviewerName: "Rajesh Kumar" },
        read: true,
        createdAt: "2024-01-14T14:10:00Z",
      },
      {
        id: 6,
        type: "payment_received",
        title: "Payment Received",
        message: "Payment of ₹800 has been credited to your account",
        data: { amount: 800, jobTitle: "Kitchen Cleaning" },
        read: true,
        createdAt: "2024-01-14T12:30:00Z",
      },
    ]

    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 500)
  }

  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case "bid_received":
        return <DollarSign className={`${iconClass} text-green-600`} />
      case "job_hired":
        return <Briefcase className={`${iconClass} text-blue-600`} />
      case "message_received":
        return <MessageCircle className={`${iconClass} text-purple-600`} />
      case "job_completed":
        return <CheckCheck className={`${iconClass} text-green-600`} />
      case "review_received":
        return <Star className={`${iconClass} text-yellow-600`} />
      case "payment_received":
        return <DollarSign className={`${iconClass} text-green-600`} />
      case "job_reminder":
        return <Calendar className={`${iconClass} text-orange-600`} />
      default:
        return <Bell className={`${iconClass} text-gray-600`} />
    }
  }

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "bid_received":
        return "bg-green-100"
      case "job_hired":
        return "bg-blue-100"
      case "message_received":
        return "bg-purple-100"
      case "job_completed":
        return "bg-green-100"
      case "review_received":
        return "bg-yellow-100"
      case "payment_received":
        return "bg-green-100"
      case "job_reminder":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - time) / (1000 * 60))
      return `${diffInMinutes} min ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((notification) => !selectedNotifications.includes(notification.id)))
    setSelectedNotifications([])
  }

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId],
    )
  }

  const selectAll = () => {
    const filteredNotifications = getFilteredNotifications()
    setSelectedNotifications(filteredNotifications.map((n) => n.id))
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read)
      case "read":
        return notifications.filter((n) => n.read)
      case "jobs":
        return notifications.filter((n) => ["bid_received", "job_hired", "job_completed"].includes(n.type))
      case "messages":
        return notifications.filter((n) => n.type === "message_received")
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>

                <div className="flex space-x-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "unread", label: "Unread" },
                    { key: "jobs", label: "Jobs" },
                    { key: "messages", label: "Messages" },
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterOption.key
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedNotifications.length} selected</span>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredNotifications.length > 0 && (
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={() => {
                    if (selectedNotifications.length === filteredNotifications.length) {
                      setSelectedNotifications([])
                    } else {
                      selectAll()
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Select all</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                  !notification.read ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className={`p-2 rounded-full ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellOff className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === "all" ? "You're all caught up! No new notifications." : `No ${filter} notifications found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
