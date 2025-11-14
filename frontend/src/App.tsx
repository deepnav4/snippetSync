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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="bg-[#B9FF66] text-gray-900 px-2 py-1 rounded">Snippet</span>
              <span className="text-gray-900">Sync</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/explore" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors"
                >
                  Explore
                </Link>
                
                {/* Notification Bell */}
                <Link to="/notifications" className="relative">
                  <button className="p-2 bg-gray-100 rounded-full border-2 border-gray-900 hover:bg-[#B9FF66] transition-colors relative">
                    <span className="text-xl">🔔</span>
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>
                </Link>

                <Link 
                  to="/create" 
                  className="px-5 py-2 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[3px_3px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  + New
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900"
                  >
                    <span className="font-medium">{user.username}</span>
                    <span className="text-sm">{showProfileMenu ? '▲' : '▼'}</span>
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
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors"
                >
                  Explore
                </Link>
                <Link 
                  to="/guide" 
                  className="text-gray-900 hover:text-[#B9FF66] font-medium transition-colors"
                >
                  Guide
                </Link>
                <Link to="/login">
                  <button className="px-6 py-2 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]">
                    Sign Up
                  </button>
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

