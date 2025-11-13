import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { Snippet } from '../lib/types';

export default function Explore() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchTerm, languageFilter, sortBy]);

  const filterSnippets = () => {
    let filtered = snippets;
    
    if (searchTerm) {
      filtered = filtered.filter(snippet => 
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags?.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (languageFilter !== 'all') {
      filtered = filtered.filter(snippet => snippet.language === languageFilter);
    }
    
    // Sort snippets
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'mostUpvoted':
          return b._count.upvotes - a._count.upvotes;
        case 'mostCommented':
          return b._count.comments - a._count.comments;
        default:
          return 0;
      }
    });
    
    setFilteredSnippets(filtered);
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

  const loadSnippets = async () => {
    try {
      const data = await snippetService.getAllPublic();
      if (data && Array.isArray(data.snippets)) {
        setSnippets(data.snippets);
      } else if (Array.isArray(data)) {
        setSnippets(data);
      } else {
        setSnippets([]);
      }
      setError('');
    } catch (error: any) {
      console.error('Failed to load snippets:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load snippets');
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B9FF66] border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading snippets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-8 max-w-md shadow-[8px_8px_0_#DC2626]">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={loadSnippets}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Explore <span className="bg-[#B9FF66] px-2">Snippets</span>
          </h1>
          <Link to="/create">
            <button className="px-6 py-3 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px]">
              + Create Snippet
            </button>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 mb-8 shadow-[6px_6px_0_#191A23]">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Search snippets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
            />
            <select 
              value={languageFilter} 
              onChange={e => setLanguageFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-medium bg-white"
            >
              <option value="all">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="other">Other</option>
            </select>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-medium bg-white"
            >
              <option value="recent">📅 Most Recent</option>
              <option value="oldest">🕐 Oldest First</option>
              <option value="mostUpvoted">👍 Most Upvoted</option>
              <option value="mostCommented">💬 Most Commented</option>
            </select>
            {(searchTerm || languageFilter !== 'all' || sortBy !== 'recent') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLanguageFilter('all');
                  setSortBy('recent');
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors border-2 border-gray-900 whitespace-nowrap"
              >
                ✖ Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Snippets Grid */}
        {!Array.isArray(filteredSnippets) || filteredSnippets.length === 0 ? (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-12 text-center shadow-[6px_6px_0_#191A23]">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600 font-medium">
              {searchTerm || languageFilter !== 'all' ? 'No snippets match your filters.' : 'No snippets yet. Be the first to share!'}</p>
            <p className="text-xl text-gray-600 font-medium">
              {searchTerm || languageFilter !== 'all' ? 'No snippets match your filters.' : 'No snippets yet. Be the first to share!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSnippets.map(snippet => (
              <div key={snippet.id} className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{snippet.title}</h3>
                {snippet.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{snippet.description}</p>
                )}
                
                {/* Code Preview */}
                <pre className="bg-gray-900 text-[#B9FF66] p-4 rounded-lg overflow-hidden max-h-32 text-sm mb-4 font-mono border-2 border-gray-900">
                  {snippet.code.substring(0, 300)}{snippet.code.length > 300 ? '...' : ''}
                </pre>
                
                {/* Meta Information */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm">
                  <span className="px-3 py-1 bg-[#B9FF66] text-gray-900 font-semibold rounded-full border-2 border-gray-900">
                    {snippet.language}
                  </span>
                  <Link to={`/user/${snippet.author.username}`} onClick={(e) => e.stopPropagation()}>
                    <span className="px-3 py-1 bg-gray-100 text-gray-900 font-medium rounded-full border-2 border-gray-900 hover:bg-[#B9FF66] transition-colors cursor-pointer">
                      👤 {snippet.author.username}
                    </span>
                  </Link>
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 font-medium rounded-full border-2 border-gray-900">
                    👍 {snippet._count.upvotes}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 font-medium rounded-full border-2 border-gray-900">
                    💬 {snippet._count.comments}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 font-medium rounded-full border-2 border-gray-900">
                    🕐 {formatDate(snippet.createdAt)}
                  </span>
                </div>
                
                {/* Tags */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags.map(tag => (
                      <span key={tag.id} className="px-3 py-1 bg-white text-gray-900 text-xs font-medium rounded-full border-2 border-gray-900">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link to={`/snippet/${snippet.id}`}>
                  <button className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    View Details →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
