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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative SVGs */}
      <div className="absolute top-20 right-10 opacity-10">
        <GridDots color="#191A23" />
      </div>
      <div className="absolute bottom-40 left-10 floating-animation opacity-10" style={{ animationDelay: '1s' }}>
        <FloatingCode color="#191A23" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#B9FF66] to-[#a3e655] border-2 border-gray-900 rounded-2xl p-8 mb-8 shadow-[8px_8px_0_#191A23] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 rounded-full -mr-16 -mt-16 opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-900 rounded-full -ml-12 -mb-12 opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-xl text-gray-800">Here's what's happening with your snippets</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📚</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">{profile?._count.snippets || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Total Snippets</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B9FF66] to-[#a3e655]" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">👍</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">{stats?.upvotesReceived || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Total Upvotes</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">💬</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600">{profile?._count.comments || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Comments</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⚡</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">{activityScore}</div>
                <div className="text-sm text-gray-600 font-semibold">Activity Score</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Snippets */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Recent <span className="bg-[#B9FF66] px-2 py-1 rounded">Snippets</span>
              </h2>
              <Link to="/my-snippets" className="text-gray-900 hover:text-[#B9FF66] font-semibold transition-colors">
                View All →
              </Link>
            </div>

            {snippets.length === 0 ? (
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-12 text-center shadow-[6px_6px_0_#191A23]">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-600 font-medium mb-6">No snippets yet</p>
                <Link to="/create">
                  <button className="px-8 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]">
                    Create First Snippet
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {snippets.map(snippet => (
                  <Link key={snippet.id} to={`/snippet/${snippet.id}`}>
                    <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#B9FF66] transition-colors flex-1">
                          {snippet.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-3 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
                          {formatDate(snippet.createdAt)}
                        </span>
                      </div>
                      
                      {snippet.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{snippet.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#B9FF66] text-gray-900 font-bold rounded-full border-2 border-gray-900 text-sm">
                          💻 {snippet.language}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 border-2 border-blue-600 font-semibold rounded-full text-sm">
                          👍 {snippet._count.upvotes}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 border-2 border-purple-600 font-semibold rounded-full text-sm">
                          💬 {snippet._count.comments}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/create">
                  <button className="w-full px-6 py-3 bg-[#B9FF66] text-gray-900 font-bold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <span>Create Snippet</span>
                  </button>
                </Link>
                <Link to="/explore">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <span className="text-2xl">🔍</span>
                    <span>Explore Snippets</span>
                  </button>
                </Link>
                <Link to="/my-snippets">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <span>My Library</span>
                  </button>
                </Link>
                <Link to="/guide">
                  <button className="w-full px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-left flex items-center gap-3">
                    <span className="text-2xl">📖</span>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">💡 Pro Tip</h3>
              <p className="text-gray-900 font-medium">
                Share your snippets with the VS Code extension! Generate a share code and import directly into your editor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
