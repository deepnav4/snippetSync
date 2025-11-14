import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../lib/users';
import { snippetService } from '../lib/snippets';
import type { UserProfile, UserStats } from '../lib/users';
import type { Snippet } from '../lib/types';

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        userService.getPublicProfile(username!),
        userService.getPublicStats(username!),
      ]);
      setProfile(profileData);
      setStats(statsData);
      
      // Get user's public snippets
      const allSnippets = await snippetService.getAllPublic();
      const userSnippets = allSnippets.snippets.filter(
        s => s.author.username === username
      );
      setSnippets(userSnippets);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleFollow = () => {
    // TODO: Implement follow API when backend is ready
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-[#B9FF66] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-12 text-center shadow-[8px_8px_0_#191A23]">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">User not found</h2>
          <p className="text-xl text-gray-600 mb-8">This user doesn't exist or has been removed.</p>
          <Link to="/explore">
            <button className="px-8 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23]">
              Back to Explore
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const activityScore = (profile._count.snippets * 10) + (profile._count.upvotes * 5) + (profile._count.comments * 2);
  const level = Math.floor(profile._count.snippets / 10) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-900 rounded-2xl p-8 mb-8 shadow-[8px_8px_0_#191A23] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B9FF66] rounded-full -mr-16 -mt-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#B9FF66] rounded-full -ml-12 -mb-12 opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-[#B9FF66] to-[#a3e655] rounded-full border-4 border-gray-900 flex items-center justify-center text-6xl font-bold text-gray-900 shadow-[6px_6px_0_#191A23]">
                {profile.username[0].toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-5xl font-bold text-gray-900">{profile.username}</h1>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 border-2 border-blue-600 rounded-full text-sm font-bold">
                  ✓ Verified
                </span>
                <span className="px-4 py-2 bg-[#B9FF66] text-gray-900 border-2 border-gray-900 rounded-full text-sm font-bold">
                  Level {level}
                </span>
              </div>
              
              {profile.bio && (
                <p className="text-xl text-gray-700 mb-4">{profile.bio}</p>
              )}
              
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span className="font-semibold">Joined {formatDate(profile.createdAt)}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleFollow}
                  className={`px-8 py-3 ${isFollowing ? 'bg-gray-200 text-gray-900' : 'bg-[#B9FF66] text-gray-900'} font-bold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
                <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]">
                  📧 Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Compact 3 Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📚</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">{profile._count.snippets}</div>
                <div className="text-sm text-gray-600 font-semibold">Snippets</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👍</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">{stats?.upvotesReceived || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Upvotes</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">⚡</div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[#B9FF66]">{activityScore}</div>
                <div className="text-sm text-gray-400 font-semibold">Activity</div>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B9FF66] to-[#a3e655]" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Language Stats */}
        {stats && stats.languageStats.length > 0 && (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 mb-8 shadow-[6px_6px_0_#191A23]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>💻</span>
              Language <span className="bg-[#B9FF66] px-2">Contributions</span>
            </h2>
            
            {/* Two Column Layout: Bar Graph and Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Bar Graph */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Bars</h3>
                <div className="space-y-4">
                  {stats.languageStats.slice(0, 5).map((lang, index) => {
                    const percentage = (lang.count / profile._count.snippets) * 100;
                    const colors = [
                      { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
                      { gradient: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
                      { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
                      { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
                      { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-500' },
                    ];
                    const color = colors[index];
                    
                    return (
                      <div key={lang.language}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`${color.bg} ${color.text} px-3 py-1 rounded-full font-bold text-sm border-2 ${color.border}`}>
                              #{index + 1}
                            </span>
                            <span className="font-bold text-gray-900 text-lg">{lang.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${color.text} text-xl`}>{lang.count}</span>
                            <span className="text-gray-500 text-sm">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-900">
                          <div 
                            className={`h-full bg-gradient-to-r ${color.gradient} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            
              {/* Right Column - Circular Pie Chart */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Distribution Chart</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {stats.languageStats.slice(0, 5).map((lang, index) => {
                    const percentage = (lang.count / profile._count.snippets) * 100;
                    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];
                    return (
                      <div key={lang.language} className="text-center hover:scale-110 transition-transform">
                        <div className="relative w-24 h-24 mb-2">
                          <svg className="transform -rotate-90" width="96" height="96">
                            <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                            <circle 
                              cx="48" 
                              cy="48" 
                              r="40" 
                              stroke={colors[index]} 
                              strokeWidth="10" 
                              fill="none"
                              strokeDasharray={`${(percentage / 100) * 251} 251`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-bold text-gray-900">{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: colors[index] }}></div>
                        <p className="text-sm font-semibold text-gray-700">{lang.language}</p>
                        <p className="text-xs text-gray-500">{lang.count} snippets</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Public Snippets */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Public <span className="bg-[#B9FF66] px-2 py-1 rounded">Snippets</span>
          </h2>

          {snippets.length === 0 ? (
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-12 text-center shadow-[6px_6px_0_#191A23]">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600 font-medium">No public snippets yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {snippets.map(snippet => (
                <Link key={snippet.id} to={`/snippet/${snippet.id}`}>
                  <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#B9FF66] transition-colors mb-2">
                      {snippet.title}
                    </h3>
                    
                    {snippet.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{snippet.description}</p>
                    )}
                    
                    <pre className="bg-gradient-to-r from-gray-900 to-gray-800 text-[#B9FF66] p-4 rounded-xl overflow-hidden max-h-24 text-xs mb-4 font-mono border-2 border-gray-900">
                      {snippet.code.substring(0, 200)}{snippet.code.length > 200 ? '...' : ''}
                    </pre>
                    
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
      </div>
    </div>
  );
}
