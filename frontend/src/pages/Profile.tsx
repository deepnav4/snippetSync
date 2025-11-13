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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Card with Decorative Elements */}
        <div className="relative bg-[#B9FF66] border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-900 opacity-5 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with badge */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-[6px_6px_0_#191A23] flex items-center justify-center bg-white text-gray-900 text-5xl font-bold overflow-hidden">
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
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                {profile.username}
              </h1>
              {profile.fullName && (
                <p className="text-xl text-gray-800 mb-3">{profile.fullName}</p>
              )}
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

        {/* Stats Cards with Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon="📝"
            label="Total Snippets"
            value={profile._count.snippets}
            color="bg-gradient-to-br from-white to-gray-50"
            accentColor="text-blue-600"
          />
          <StatCard
            icon="👍"
            label="Upvotes Received"
            value={stats.upvotesReceived}
            color="bg-gradient-to-br from-white to-gray-50"
            accentColor="text-green-600"
          />
          <StatCard
            icon="💬"
            label="Comments"
            value={profile._count.comments}
            color="bg-gradient-to-br from-white to-gray-50"
            accentColor="text-purple-600"
          />
          <StatCard
            icon="❤️"
            label="Upvotes Given"
            value={profile._count.upvotes}
            color="bg-gradient-to-br from-white to-gray-50"
            accentColor="text-red-600"
          />
        </div>

        {/* Activity Summary Banner */}
        <div className="bg-gray-900 border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#B9FF66] p-3 rounded-lg border-2 border-[#B9FF66]">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Activity Score</h3>
                <p className="text-gray-400 text-sm">Based on your contributions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-[#B9FF66]">
                {profile._count.snippets * 10 + stats.upvotesReceived * 5 + profile._count.comments * 2}
              </div>
              <p className="text-gray-400 text-sm">Total Points</p>
            </div>
          </div>
        </div>

        {/* Language Stats with Enhanced Design */}
        {stats.languageStats.length > 0 && (
          <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎨</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Language Expertise
              </h2>
            </div>
            <div className="space-y-5">
              {stats.languageStats.map((stat, index) => (
                <LanguageBar
                  key={stat.language}
                  language={stat.language}
                  count={stat.count}
                  total={profile._count.snippets}
                  rank={index + 1}
                />
              ))}
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

// Helper Components
const StatCard: React.FC<{ icon: string; label: string; value: number; color: string; accentColor: string }> = ({
  icon,
  label,
  value,
  color,
  accentColor,
}) => (
  <div className={`${color} border-2 border-gray-900 rounded-xl shadow-[6px_6px_0_#191A23] p-6 text-center hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group`}>
    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <div className={`text-3xl font-bold ${accentColor} mb-2`}>
      {value}
    </div>
    <div className="text-sm font-semibold text-gray-600">{label}</div>
  </div>
);

const LanguageBar: React.FC<{
  language: string;
  count: number;
  total: number;
  rank: number;
}> = ({ language, count, total, rank }) => {
  const percentage = ((count / total) * 100).toFixed(1);
  const colors = ['#B9FF66', '#a3e655', '#8fd43a', '#7bc220', '#67b010'];
  const barColor = colors[rank - 1] || '#B9FF66';

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span className="bg-gray-900 text-[#B9FF66] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-gray-900">
            {rank}
          </span>
          <span className="font-bold text-gray-900 text-lg">
            {language}
          </span>
        </div>
        <span className="text-gray-600 font-semibold text-sm bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="h-5 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300 relative">
        <div
          className="h-full border-r-2 border-gray-900 transition-all duration-700 ease-out group-hover:animate-pulse"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
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
