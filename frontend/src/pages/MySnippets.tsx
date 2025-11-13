import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { Snippet } from '../lib/types';

export default function MySnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const data = await snippetService.getMySnippets();
      setSnippets(data);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    
    try {
      await snippetService.delete(id);
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleGenerateCode = async (snippetId: string) => {
    setGeneratingCode(snippetId);
    try {
      const result = await snippetService.generateShareCode(snippetId);
      setSnippets(prev => prev.map(s => 
        s.id === snippetId 
          ? { ...s, shareCode: [{ code: result.code, expiresAt: result.expiresAt }] }
          : s
      ));
      navigator.clipboard.writeText(result.code);
      setCopiedSlug(result.code);
      setTimeout(() => setCopiedSlug(null), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate share code';
      alert(`❌ ${message}`);
    } finally {
      setGeneratingCode(null);
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

  const filteredAndSortedSnippets = snippets
    .filter(snippet => {
      if (filter === 'public') return snippet.visibility === 'PUBLIC';
      if (filter === 'private') return snippet.visibility === 'PRIVATE';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'popular') {
        return b._count.upvotes - a._count.upvotes;
      }
      return 0;
    });

  const stats = {
    total: snippets.length,
    public: snippets.filter(s => s.visibility === 'PUBLIC').length,
    private: snippets.filter(s => s.visibility === 'PRIVATE').length,
    totalUpvotes: snippets.reduce((sum, s) => sum + s._count.upvotes, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-[#B9FF66] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              My <span className="bg-[#B9FF66] px-3 py-1 rounded">Snippets</span>
            </h1>
            <p className="text-gray-600 text-lg">Manage your code library</p>
          </div>
          <Link to="/create">
            <button className="px-8 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
              + Create New
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        {snippets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600 font-semibold">Total Snippets</div>
            </div>
            <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-3xl font-bold text-green-600">{stats.public}</div>
              <div className="text-sm text-gray-600 font-semibold">Public</div>
            </div>
            <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-3xl font-bold text-purple-600">{stats.private}</div>
              <div className="text-sm text-gray-600 font-semibold">Private</div>
            </div>
            <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-2">👍</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalUpvotes}</div>
              <div className="text-sm text-gray-600 font-semibold">Total Upvotes</div>
            </div>
          </div>
        )}

        {/* Filters */}
        {snippets.length > 0 && (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 mb-8 shadow-[6px_6px_0_#191A23]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-lg font-bold border-2 border-gray-900 transition-all ${
                    filter === 'all'
                      ? 'bg-[#B9FF66] text-gray-900'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('public')}
                  className={`px-6 py-3 rounded-lg font-bold border-2 border-gray-900 transition-all ${
                    filter === 'public'
                      ? 'bg-[#B9FF66] text-gray-900'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🌍 Public ({stats.public})
                </button>
                <button
                  onClick={() => setFilter('private')}
                  className={`px-6 py-3 rounded-lg font-bold border-2 border-gray-900 transition-all ${
                    filter === 'private'
                      ? 'bg-[#B9FF66] text-gray-900'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🔒 Private ({stats.private})
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] font-semibold bg-white"
              >
                <option value="recent">📅 Most Recent</option>
                <option value="oldest">🕐 Oldest First</option>
                <option value="popular">👍 Most Popular</option>
              </select>
            </div>
          </div>
        )}
        
        {filteredAndSortedSnippets.length === 0 ? (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-16 text-center shadow-[8px_8px_0_#191A23]">
            <div className="text-8xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {snippets.length === 0 ? 'No snippets yet' : 'No snippets match your filter'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {snippets.length === 0 
                ? 'Start building your code library today!'
                : 'Try changing your filter settings'}
            </p>
            {snippets.length === 0 && (
              <Link to="/create">
                <button className="px-10 py-5 bg-[#B9FF66] text-gray-900 font-bold text-xl rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[6px_6px_0_#191A23] hover:shadow-[3px_3px_0_#191A23] hover:translate-x-[3px] hover:translate-y-[3px]">
                  Create Your First Snippet
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAndSortedSnippets.map(snippet => (
              <div key={snippet.id} className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[10px_10px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                {/* Header with timestamp */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#B9FF66] transition-colors flex-1">
                    {snippet.title}
                  </h3>
                  <span className="text-xs text-gray-500 ml-3 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 flex-shrink-0">
                    {formatDate(snippet.createdAt)}
                  </span>
                </div>

                {snippet.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{snippet.description}</p>
                )}
                
                {/* Code Preview */}
                <pre className="bg-gradient-to-r from-gray-900 to-gray-800 text-[#B9FF66] p-4 rounded-xl overflow-hidden max-h-24 text-xs mb-4 font-mono border-2 border-gray-900 relative">
                  <div className="absolute top-2 right-2 text-[10px] text-gray-600 bg-gray-800 px-2 py-1 rounded">
                    {snippet.code.length} chars
                  </div>
                  {snippet.code.substring(0, 200)}{snippet.code.length > 200 ? '...' : ''}
                </pre>
                
                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#B9FF66] text-gray-900 font-bold rounded-full border-2 border-gray-900 text-sm">
                    💻 {snippet.language}
                  </span>
                  <span className={`px-3 py-1 ${snippet.visibility === 'PUBLIC' ? 'bg-green-100 text-green-700 border-green-600' : 'bg-purple-100 text-purple-700 border-purple-600'} font-semibold rounded-full border-2 text-sm`}>
                    {snippet.visibility === 'PUBLIC' ? '🌍 Public' : '🔒 Private'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 border-2 border-blue-600 font-semibold rounded-full text-sm">
                    👍 {snippet._count.upvotes}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 border-2 border-purple-600 font-semibold rounded-full text-sm">
                    💬 {snippet._count.comments}
                  </span>
                </div>
                
                {/* Tags */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags.map(tag => (
                      <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-900 text-xs font-semibold rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Code Section */}
                {snippet.shareCode && snippet.shareCode.length > 0 ? (
                  <div className="mb-4 p-4 bg-gradient-to-r from-[#B9FF66] to-[#a3e655] border-2 border-gray-900 rounded-xl shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-900">⚡ ACTIVE SHARE CODE</span>
                      <span className="text-xs text-gray-700 bg-white px-2 py-1 rounded-full border border-gray-900">
                        Expires in 5min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-3 bg-white border-2 border-gray-900 rounded-lg font-mono text-lg font-bold text-gray-900 tracking-wider">
                        {snippet.shareCode[0].code}
                      </code>
                      <button 
                        onClick={() => handleCopySlug(snippet.shareCode![0].code)}
                        className="px-4 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900"
                      >
                        {copiedSlug === snippet.shareCode[0].code ? '✓' : '📋'}
                      </button>
                    </div>
                    <div className="text-xs text-gray-900 mt-2 font-semibold">
                      ⏰ {new Date(snippet.shareCode[0].expiresAt).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleGenerateCode(snippet.id)}
                    disabled={generatingCode === snippet.id}
                    className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-[#B9FF66] to-[#a3e655] text-gray-900 font-bold rounded-lg hover:from-[#a3e655] hover:to-[#8fd43a] transition-all border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingCode === snippet.id ? '⏳ Generating...' : '✨ Generate Share Code'}
                  </button>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link to={`/snippet/${snippet.id}`} className="flex-1">
                    <button className="w-full px-4 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900">
                      👁️ View Details
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(snippet.id)} 
                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors border-2 border-gray-900"
                    title="Delete snippet"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
