import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./contexts/LanguageContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import PosterDashboard from "./pages/PosterDashboard"
import WorkerDashboard from "./pages/WorkerDashboard"
import CreateJob from "./pages/CreateJob"
import JobFeed from "./pages/JobFeed"
import JobDetail from "./pages/JobDetails"
import ProfileComplete from "./pages/ProfileComplete"
import WorkerProfile from "./pages/WorkerProfile"
import WorkerSearch from "./pages/WorkerSearch"
import Messages from "./pages/Messages"
import Notifications from "./pages/Notifications"
import ProfileEdit from "./pages/ProfileEdit"
import "./App.css"
import 'maplibre-gl/dist/maplibre-gl.css';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/poster/dashboard" element={<PosterDashboard />} />
                  <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                  <Route path="/poster/jobs/new" element={<CreateJob />} />
                  <Route path="/jobs" element={<JobFeed />} />
                  <Route path="/jobs/:jobId" element={<JobDetail />} />
                  <Route path="/profile/complete" element={<ProfileComplete />} />
                  <Route path="/poster/workers" element={<WorkerSearch />} />
                  <Route path="/poster/workers/:workerId" element={<WorkerProfile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:threadId" element={<Messages />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
      </LanguageProvider>
    </>
  )
}

export default App
