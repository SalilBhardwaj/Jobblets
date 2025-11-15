"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { Send, Paperclip, ImageIcon, Phone, Video, MoreVertical, Search } from "lucide-react"
import { useSelector } from "react-redux"

const Messages = () => {
  const { threadId } = useParams()
  const { t } = useLanguage()
  // const { user } = useAuth()
  const user = useSelector((state) => state.user.user)
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId)
    }
  }, [threadId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    // Mock data - in real app, fetch from API
    const mockConversations = [
      {
        id: "1",
        participant: {
          id: 2,
          name: "Priya Sharma",
          avatar: "/placeholder.svg?height=40&width=40",
          role: user?.role === "poster" ? "worker" : "poster",
          online: true,
        },
        lastMessage: "Thank you for considering me for the job!",
        lastMessageTime: "2 min ago",
        unreadCount: 2,
        jobTitle: "House Cleaning Service",
      },
      {
        id: "2",
        participant: {
          id: 3,
          name: "Rajesh Kumar",
          avatar: "/placeholder.svg?height=40&width=40",
          role: user?.role === "poster" ? "worker" : "poster",
          online: false,
        },
        lastMessage: "When would you like me to start?",
        lastMessageTime: "1 hour ago",
        unreadCount: 0,
        jobTitle: "Plumbing Repair",
      },
      {
        id: "3",
        participant: {
          id: 4,
          name: "Amit Patel",
          avatar: "/placeholder.svg?height=40&width=40",
          role: user?.role === "poster" ? "worker" : "poster",
          online: true,
        },
        lastMessage: "I can complete this by tomorrow evening.",
        lastMessageTime: "3 hours ago",
        unreadCount: 1,
        jobTitle: "Math Tutoring",
      },
    ]

    setConversations(mockConversations)

    if (threadId) {
      const activeConv = mockConversations.find((conv) => conv.id === threadId)
      setActiveConversation(activeConv)
    } else if (mockConversations.length > 0) {
      setActiveConversation(mockConversations[0])
    }

    setLoading(false)
  }

  const fetchMessages = async (conversationId) => {
    // Mock messages data
    const mockMessages = [
      {
        id: 1,
        senderId: user?.role === "poster" ? user.id : 2,
        senderName: user?.role === "poster" ? user.fullName : "Priya Sharma",
        message: "Hi! I'm interested in your house cleaning job posting.",
        timestamp: "2024-01-15T10:00:00Z",
        type: "text",
      },
      {
        id: 2,
        senderId: user?.role === "poster" ? user.id : user.id,
        senderName: user?.fullName || "You",
        message: "Great! Can you tell me about your experience?",
        timestamp: "2024-01-15T10:05:00Z",
        type: "text",
      },
      {
        id: 3,
        senderId: user?.role === "poster" ? 2 : user.id,
        senderName: user?.role === "poster" ? "Priya Sharma" : user.fullName,
        message: "I have 3 years of experience in house cleaning. I bring my own supplies and can work flexible hours.",
        timestamp: "2024-01-15T10:10:00Z",
        type: "text",
      },
      {
        id: 4,
        senderId: user?.role === "poster" ? user.id : user.id,
        senderName: user?.fullName || "You",
        message: "That sounds perfect. What's your rate?",
        timestamp: "2024-01-15T10:15:00Z",
        type: "text",
      },
      {
        id: 5,
        senderId: user?.role === "poster" ? 2 : user.id,
        senderName: user?.role === "poster" ? "Priya Sharma" : user.fullName,
        message: "I charge ₹200 per hour. For a 2BHK, it usually takes 3-4 hours for thorough cleaning.",
        timestamp: "2024-01-15T10:20:00Z",
        type: "text",
      },
      {
        id: 6,
        senderId: user?.role === "poster" ? 2 : user.id,
        senderName: user?.role === "poster" ? "Priya Sharma" : user.fullName,
        message: "Thank you for considering me for the job!",
        timestamp: "2024-01-15T10:25:00Z",
        type: "text",
      },
    ]

    setMessages(mockMessages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: user.id,
      senderName: user.fullName,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation?.id ? { ...conv, lastMessage: newMessage, lastMessageTime: "now" } : conv,
      ),
    )
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastMessageTime = (timeStr) => {
    if (timeStr === "now") return "now"
    return timeStr
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: "calc(100vh - 8rem)" }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setActiveConversation(conversation)
                      fetchMessages(conversation.id)
                    }}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${activeConversation?.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.participant.avatar || "/placeholder.svg"}
                          alt={conversation.participant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.participant.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.participant.name}</h3>
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(conversation.lastMessageTime)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate">Re: {conversation.jobTitle}</span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={activeConversation.participant.avatar || "/placeholder.svg"}
                          alt={activeConversation.participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{activeConversation.participant.name}</h3>
                          <p className="text-sm text-gray-500">
                            {activeConversation.participant.online ? "Online" : "Offline"} • Re:{" "}
                            {activeConversation.jobTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === user.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                            }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${message.senderId === user.id ? "text-blue-100" : "text-gray-500"
                              }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
