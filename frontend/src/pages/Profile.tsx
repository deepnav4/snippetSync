import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../lib/users';
import type { UserProfile, UserStats } from '../lib/users';

const Profile: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwnProfile = !username || (currentUser && username === currentUser.username);

  useEffect(() => {
    loadProfile();
  }, [username, currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      let profileData: UserProfile;
      let statsData: UserStats;

      if (isOwnProfile && currentUser) {
        // Load current user's profile
        [profileData, statsData] = await Promise.all([
          userService.getCurrentProfile(),
          userService.getCurrentStats(),
        ]);
      } else if (username) {
        // Load public profile
        [profileData, statsData] = await Promise.all([
          userService.getPublicProfile(username),
          userService.getPublicStats(username),
        ]);
      } else {
        return;
      }

      setProfile(profileData);
      setStats(statsData);
      setBio(profileData.bio || '');
      setProfilePicture(profileData.profilePicture || '');
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      alert(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await userService.updateProfile({
        bio,
        profilePicture: profilePicture || undefined,
      });
      setProfile(updated);
      setEditMode(false);
      alert('✅ Profile updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-900 border-t-[#B9FF66] mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Profile not found</p>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12">
        {/* Header Card with Decorative Elements */}
        <div className="relative bg-[#B9FF66] border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-6 sm:p-8 mb-6 sm:mb-8 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white opacity-10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gray-900 opacity-5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Avatar with badge */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-900 shadow-[6px_6px_0_#191A23] flex items-center justify-center bg-white text-gray-900 text-4xl sm:text-5xl font-bold overflow-hidden">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  profile.username[0].toUpperCase()
                )}
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 bg-gray-900 text-[#B9FF66] w-10 h-10 rounded-full border-2 border-[#B9FF66] flex items-center justify-center font-bold shadow-lg">
                ✓
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {profile.username}
              </h1>
              {editMode ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself..."
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none mb-3 bg-white"
                  rows={3}
                />
              ) : (
                <p className="text-gray-900 text-lg mb-4 max-w-2xl">
                  {profile.bio || '✨ No bio yet - Click Edit Profile to add one!'}
                </p>
              )}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold border-2 border-gray-900 text-sm">
                  📅 Joined {memberSince}
                </span>
                <span className="bg-gray-900 text-[#B9FF66] px-4 py-2 rounded-full font-semibold border-2 border-gray-900 text-sm">
                  🎯 Level {Math.floor(profile._count.snippets / 10) + 1}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {isOwnProfile && (
              <div className="flex-shrink-0">
                {editMode ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setBio(profile.bio || '');
                        setProfilePicture(profile.profilePicture || '');
                      }}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      ✖️ Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - 4 Column Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Snippets */}
          <div className="bg-white border-2 border-gray-900 rounded-xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Total Snippets</div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2 sm:mb-3">{profile._count.snippets}</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Upvotes Received */}
          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Upvotes Received</div>
            <div className="text-4xl font-bold text-green-600 mb-3">{stats.upvotesReceived}</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Total Comments */}
          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Comments Made</div>
            <div className="text-4xl font-bold text-purple-600 mb-3">{profile._count.comments}</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Activity Score */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-900 rounded-xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Activity Score</div>
            <div className="text-4xl font-bold text-[#B9FF66] mb-3">
              {profile._count.snippets * 10 + stats.upvotesReceived * 5 + profile._count.comments * 2}
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B9FF66] to-[#a3e655]" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Language Stats with Enhanced Design */}
        {stats.languageStats.length > 0 && (
          <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">💻</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Language <span className="bg-[#B9FF66] px-2">Contributions</span>
              </h2>
            </div>
            
            {/* Two Column Layout: Bar Graph and Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Bar Graph */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Bars</h3>
                <div className="space-y-4">
                  {stats.languageStats.slice(0, 5).map((stat, index) => {
                    const percentage = (stat.count / profile._count.snippets) * 100;
                    const colors = [
                      { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
                      { gradient: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
                      { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
                      { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
                      { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-500' },
                    ];
                    const color = colors[index] || colors[0];
                    
                    return (
                      <div key={stat.language} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`${color.bg} ${color.text} px-3 py-1 rounded-full font-bold text-sm border-2 ${color.border}`}>
                              #{index + 1}
                            </span>
                            <span className="font-bold text-gray-900 text-lg">{stat.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${color.text} text-xl`}>{stat.count}</span>
                            <span className="text-gray-500 text-sm">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-900">
                          <div 
                            className={`h-full bg-gradient-to-r ${color.gradient} transition-all duration-1000 ease-out`}
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
                  {stats.languageStats.slice(0, 5).map((stat, index) => {
                    const percentage = (stat.count / profile._count.snippets) * 100;
                    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];
                    return (
                      <div key={stat.language} className="text-center group hover:scale-110 transition-transform">
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
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-bold text-gray-900">{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: colors[index] }}></div>
                        <p className="text-sm font-semibold text-gray-700">{stat.language}</p>
                        <p className="text-xs text-gray-500">{stat.count} snippets</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Card (if own profile) */}
        {isOwnProfile && (
          <div className="bg-[#B9FF66] border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/create')}
                className="bg-white text-gray-900 px-6 py-4 rounded-lg font-bold border-2 border-gray-900 hover:shadow-[4px_4px_0_#191A23] hover:-translate-y-1 transition-all text-left"
              >
                <div className="text-2xl mb-2">📝</div>
                <div>Create New Snippet</div>
                <div className="text-sm text-gray-600 mt-1">Share your code</div>
              </button>
              <button
                onClick={() => navigate('/my-snippets')}
                className="bg-white text-gray-900 px-6 py-4 rounded-lg font-bold border-2 border-gray-900 hover:shadow-[4px_4px_0_#191A23] hover:-translate-y-1 transition-all text-left"
              >
                <div className="text-2xl mb-2">📚</div>
                <div>My Snippets</div>
                <div className="text-sm text-gray-600 mt-1">Manage your library</div>
              </button>
              <button
                onClick={() => navigate('/explore')}
                className="bg-white text-gray-900 px-6 py-4 rounded-lg font-bold border-2 border-gray-900 hover:shadow-[4px_4px_0_#191A23] hover:-translate-y-1 transition-all text-left"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div>Explore</div>
                <div className="text-sm text-gray-600 mt-1">Discover snippets</div>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Snippets */}
          <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🕒</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Recent Snippets
                </h2>
              </div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold border-2 border-gray-300">
                {stats.recentSnippets.length}
              </span>
            </div>
            {stats.recentSnippets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 mb-4">No public snippets yet</p>
                {isOwnProfile && (
                  <button
                    onClick={() => navigate('/create')}
                    className="px-6 py-3 bg-[#B9FF66] text-gray-900 font-bold rounded-lg border-2 border-gray-900 hover:shadow-[4px_4px_0_#191A23] transition-all"
                  >
                    Create Your First Snippet
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} navigate={navigate} />
                ))}
              </div>
            )}
          </div>

          {/* Top Snippets */}
          <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Top Snippets
                </h2>
              </div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold border-2 border-gray-300">
                {stats.topSnippets.length}
              </span>
            </div>
            {stats.topSnippets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-gray-600">No top snippets yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SnippetCard: React.FC<{ snippet: any; navigate: any }> = ({ snippet, navigate }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => navigate(`/snippet/${snippet.id}`)}
      className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-300 rounded-xl p-5 cursor-pointer hover:border-gray-900 hover:shadow-[6px_6px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="font-bold text-gray-900 text-lg group-hover:text-[#B9FF66] transition-colors flex-1">
          {snippet.title}
        </div>
        <span className="text-xs text-gray-500 ml-3 flex-shrink-0">
          {formatDate(snippet.createdAt)}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300">
          <span className="font-semibold">💻</span> {snippet.language}
        </span>
        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300">
          <span className="font-semibold">👍</span> {snippet._count.upvotes}
        </span>
        <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300">
          <span className="font-semibold">💬</span> {snippet._count.comments}
        </span>
      </div>
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag: any) => (
            <span
              key={tag.id}
              className="bg-[#B9FF66] text-gray-900 px-2 py-1 rounded-full text-xs font-bold border border-gray-900"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
