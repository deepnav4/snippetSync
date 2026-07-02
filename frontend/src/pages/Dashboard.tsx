import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import userService from '../lib/users';
import type { Snippet } from '../lib/types';
import type { UserProfile, UserStats } from '../lib/users';
import { useAuth } from '../context/AuthContext';
import { GridDots, FloatingCode } from '../svgs';

export default function Dashboard() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [snippetsData, profileData, statsData] = await Promise.all([
        snippetService.getMySnippets(),
        userService.getCurrentProfile(),
        userService.getCurrentStats(),
      ]);
      setSnippets(snippetsData.slice(0, 6)); // Latest 6 snippets
      setProfile(profileData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-[#B9FF66] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const activityScore = profile 
    ? (profile._count.snippets * 10) + (profile._count.upvotes * 5) + (profile._count.comments * 2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative SVGs */}
      <div className="absolute top-20 right-10 opacity-10 hidden lg:block">
        <GridDots color="#191A23" />
      </div>
      <div className="absolute bottom-40 left-10 floating-animation opacity-10 hidden lg:block" style={{ animationDelay: '1s' }}>
        <FloatingCode color="#191A23" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#B9FF66] to-[#a3e655] border-2 border-gray-900 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-[8px_8px_0_#191A23] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gray-900 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gray-900 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-800">Here's what's happening with your snippets</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] sm:shadow-[6px_6px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] sm:hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <svg className="w-8 h-8 text-gray-900 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{profile?._count.snippets || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Total Snippets</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B9FF66] to-[#a3e655]" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] sm:shadow-[6px_6px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] sm:hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <svg className="w-8 h-8 text-blue-600 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{stats?.upvotesReceived || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Total Upvotes</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] sm:shadow-[6px_6px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] sm:hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <svg className="w-8 h-8 text-purple-600 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">{profile?._count.comments || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Comments</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] sm:shadow-[6px_6px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] sm:hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <svg className="w-8 h-8 text-orange-600 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">{activityScore}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold">Activity Score</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Snippets */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Recent <span className="bg-[#B9FF66] px-2 py-1 rounded">Snippets</span>
              </h2>
              <Link to="/my-snippets" className="text-gray-900 hover:text-[#B9FF66] font-semibold transition-colors text-sm sm:text-base">
                View All →
              </Link>
            </div>

            {snippets.length === 0 ? (
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 sm:p-12 text-center shadow-[6px_6px_0_#191A23]">
                <p className="text-lg sm:text-xl text-gray-600 font-medium mb-4 sm:mb-6">No snippets yet</p>
                <Link to="/create">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#B9FF66] text-gray-900 font-bold text-base sm:text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]">
                    Create First Snippet
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {snippets.map(snippet => (
                  <Link key={snippet.id} to={`/snippet/${snippet.id}`}>
                    <div className="bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-3">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#B9FF66] transition-colors flex-1 break-words">
                          {snippet.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-3 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
                          {formatDate(snippet.createdAt)}
                        </span>
                      </div>
                      
                      {snippet.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{snippet.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                        <span className="px-3 py-1 bg-[#B9FF66] text-gray-900 font-bold rounded-full border-2 border-gray-900">
                          {snippet.language}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 border-2 border-blue-600 font-semibold rounded-full">
                          Upvotes: {snippet._count.upvotes}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 border-2 border-purple-600 font-semibold rounded-full">
                          Comments: {snippet._count.comments}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 sm:p-6 shadow-[6px_6px_0_#191A23]">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/create">
                  <button className="w-full px-6 py-3 bg-[#B9FF66] text-gray-900 font-bold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Snippet</span>
                  </button>
                </Link>
                <Link to="/explore">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Explore Snippets</span>
                  </button>
                </Link>
                <Link to="/my-snippets">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>My Library</span>
                  </button>
                </Link>
                <Link to="/guide">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>VS Code Guide</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Top Languages */}
            {stats && stats.languageStats.length > 0 && (
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23]">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Top Languages</h3>
                <div className="space-y-3">
                  {stats.languageStats.slice(0, 5).map((lang, index) => {
                    const colors = [
                      'from-blue-400 to-blue-600',
                      'from-green-400 to-green-600',
                      'from-purple-400 to-purple-600',
                      'from-orange-400 to-orange-600',
                      'from-pink-400 to-pink-600'
                    ];
                    const maxCount = stats.languageStats[0].count;
                    const percentage = (lang.count / maxCount) * 100;
                    
                    return (
                      <div key={lang.language}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-lg">{index + 1}</span>
                            {lang.language}
                          </span>
                          <span className="text-sm font-semibold text-gray-600">{lang.count}</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-900">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Activity Tips */}
            <div className="bg-gradient-to-br from-[#B9FF66] to-[#a3e655] border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23]">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Pro Tip</h3>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">
                Share your snippets with the VS Code extension! Generate a share code and import directly into your editor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
