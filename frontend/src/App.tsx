import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import notificationService from './lib/notifications';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateSnippet from './pages/CreateSnippet.tsx';
import SnippetDetail from './pages/SnippetDetail.tsx';
import MySnippets from './pages/MySnippets.tsx';
import Profile from './pages/Profile.tsx';
import Guide from './pages/Guide.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PublicProfile from './pages/PublicProfile.tsx';
import Notifications from './pages/Notifications.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotificationCount();
      // Poll for updates every 30 seconds
      const interval = setInterval(loadNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Failed to load notification count:', error);
    }
  };
  
  return (
    <nav className="bg-white border-b-2 border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
              <span className="bg-[#B9FF66] text-gray-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Snippet</span>
              <span className="text-gray-900">Sync</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors text-sm lg:text-base"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/explore" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors text-sm lg:text-base"
                >
                  Explore
                </Link>
                
                {/* Notification Bell */}
                <Link to="/notifications" className="relative">
                  <button className="p-2 bg-gray-100 rounded-full border-2 border-gray-900 hover:bg-[#B9FF66] transition-colors relative">
                    <span className="text-lg sm:text-xl">🔔</span>
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>
                </Link>

                <Link 
                  to="/create" 
                  className="px-4 lg:px-5 py-2 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[3px_3px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[1px] hover:translate-y-[1px] text-sm lg:text-base"
                >
                  + New
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900 text-sm lg:text-base"
                  >
                    <span className="font-medium">{user.username}</span>
                    <span className="text-xs">{showProfileMenu ? '▲' : '▼'}</span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0_#191A23] overflow-hidden z-50">
                      <Link 
                        to="/profile" 
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-3 text-gray-900 hover:bg-[#B9FF66] transition-colors font-medium border-b border-gray-200"
                      >
                        👤 My Profile
                      </Link>
                      <Link 
                        to="/my-snippets" 
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-3 text-gray-900 hover:bg-[#B9FF66] transition-colors font-medium border-b border-gray-200"
                      >
                        📚 My Snippets
                      </Link>
                      <button 
                        onClick={() => { logout(); setShowProfileMenu(false); }} 
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/explore" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors text-sm lg:text-base"
                >
                  Explore
                </Link>
                <Link 
                  to="/guide" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors text-sm lg:text-base"
                >
                  Guide
                </Link>
                <Link to="/login">
                  <button className="px-4 lg:px-6 py-2 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm lg:text-base">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 lg:px-6 py-2 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] text-sm lg:text-base">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2.5 bg-gray-100 rounded-lg border-2 border-gray-900 hover:bg-[#B9FF66] transition-all duration-300 active:bg-[#a3e655] relative z-50"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out origin-center ${
                showMobileMenu ? 'rotate-45 translate-y-2' : 'rotate-0'
              }`}></span>
              <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${
                showMobileMenu ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}></span>
              <span className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out origin-center ${
                showMobileMenu ? '-rotate-45 -translate-y-2' : 'rotate-0'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 top-full bg-white border-b-2 border-gray-900 shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out overflow-hidden ${
          showMobileMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 border-0'
        }`}>
          <div className="py-3 space-y-1.5 px-3 sm:px-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/explore" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  🔍 Explore
                </Link>
                <Link 
                  to="/notifications" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg relative text-base"
                >
                  🔔 Notifications {notificationCount > 0 && `(${notificationCount})`}
                </Link>
                <Link 
                  to="/create" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  ➕ Create Snippet
                </Link>
                <Link 
                  to="/my-snippets" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  📚 My Snippets
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  👤 Profile
                </Link>
                <button 
                  onClick={() => { logout(); setShowMobileMenu(false); }}
                  className="w-full text-left px-4 py-3.5 text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors font-medium rounded-lg text-base"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/explore" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  🔍 Explore
                </Link>
                <Link 
                  to="/guide" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-[#B9FF66] active:bg-[#a3e655] transition-colors font-medium rounded-lg text-base"
                >
                  📖 Guide
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors font-medium rounded-lg text-base"
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3.5 bg-[#B9FF66] text-gray-900 hover:bg-[#a3e655] active:bg-[#8fd645] transition-colors font-bold rounded-lg border-2 border-gray-900 shadow-[4px_4px_0_#191A23] text-center text-base"
                >
                  ✨ Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/snippet/:id" element={<SnippetDetail />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateSnippet /></ProtectedRoute>} />
            <Route path="/my-snippets" element={<ProtectedRoute><MySnippets /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user/:username" element={<PublicProfile />} />
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl font-bold text-gray-900">404 Not Found</div></div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

