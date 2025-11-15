"use client"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"
import { Languages, User, LogOut, Briefcase } from "lucide-react"

import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/slices/userSlice";
import { useEffect } from "react"

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    console.log("head: ",user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/")
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Jobblet</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t("home")}
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t("findWork")}
            </Link>
            <Link to="/poster/jobs/new" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t("postJob")}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* User Menu */}
            {user.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === "poster" ? "/poster/dashboard" : "/worker/dashboard"}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("dashboard")}</span>
                </Link>
                <button
                  onClick={() => { handleLogout() }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("logout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
