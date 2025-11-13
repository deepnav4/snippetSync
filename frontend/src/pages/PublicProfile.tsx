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

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-gray-900">{profile._count.snippets}</div>
            <div className="text-sm text-gray-600 font-semibold">Public Snippets</div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-2">👍</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.upvotesReceived || 0}</div>
            <div className="text-sm text-gray-600 font-semibold">Total Upvotes</div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-3xl font-bold text-purple-600">{profile._count.comments}</div>
            <div className="text-sm text-gray-600 font-semibold">Comments</div>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-orange-600">{activityScore}</div>
            <div className="text-sm text-gray-600 font-semibold">Activity Score</div>
          </div>
        </div>

        {/* Language Stats */}
        {stats && stats.languageStats.length > 0 && (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 mb-8 shadow-[6px_6px_0_#191A23]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Top <span className="bg-[#B9FF66] px-2 py-1 rounded">Languages</span>
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {stats.languageStats.slice(0, 5).map((lang, index) => {
                const colors = [
                  { bg: 'from-blue-400 to-blue-600', text: 'text-blue-600' },
                  { bg: 'from-green-400 to-green-600', text: 'text-green-600' },
                  { bg: 'from-purple-400 to-purple-600', text: 'text-purple-600' },
                  { bg: 'from-orange-400 to-orange-600', text: 'text-orange-600' },
                  { bg: 'from-pink-400 to-pink-600', text: 'text-pink-600' },
                ];
                return (
                  <div key={lang.language} className="bg-gray-50 border-2 border-gray-900 rounded-xl p-4 hover:scale-105 transition-transform">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colors[index].bg} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-3 border-2 border-gray-900`}>
                      {index + 1}
                    </div>
                    <div className={`text-2xl font-bold ${colors[index].text}`}>{lang.count}</div>
                    <div className="text-sm font-semibold text-gray-900">{lang.language}</div>
                  </div>
                );
              })}
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
