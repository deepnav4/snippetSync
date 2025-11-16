import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { Snippet } from '../lib/types';

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    loadSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchTerm, languageFilter]);

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
    
    setFilteredSnippets(filtered);
  };

  const loadSnippets = async () => {
    try {
      const data = await snippetService.getAllPublic();
      // Backend returns { snippets: [], pagination: {} }
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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-900 border-t-[#B9FF66] rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">Loading snippets...</p></div></div>;
  if (error) return <div className="error p-4">Error: {error}. <button onClick={loadSnippets} className="underline">Retry</button></div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Public <span className="bg-[#B9FF66] px-2">Snippets</span>
          </h1>
          <Link to="/create">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#B9FF66] text-gray-900 font-bold text-base sm:text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23]">
              + Create Snippet
            </button>
          </Link>
        </div>
      
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-[4px_4px_0_#191A23]">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
            />
            <select 
              value={languageFilter} 
              onChange={e => setLanguageFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-medium bg-white"
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
        </div>
      </div>
      
      {!Array.isArray(filteredSnippets) || filteredSnippets.length === 0 ? (
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 sm:p-12 text-center shadow-[6px_6px_0_#191A23]">
          <div className="text-5xl sm:text-6xl mb-4">📝</div>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">{searchTerm || languageFilter !== 'all' ? 'No snippets match your filters.' : 'Be the first to share!'}</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredSnippets.map(snippet => (
            <div key={snippet.id} className="bg-white border-2 border-gray-900 rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[8px_8px_0_#191A23] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{snippet.title}</h3>
              {snippet.description && <p className="text-sm sm:text-base text-gray-600 mb-4">{snippet.description}</p>}
              
              <pre className="bg-gray-900 text-[#B9FF66] p-3 sm:p-4 rounded-lg overflow-auto max-h-[120px] sm:max-h-[150px] text-xs sm:text-sm font-mono mb-4">
                {snippet.code.substring(0, 300)}{snippet.code.length > 300 ? '...' : ''}
              </pre>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="px-3 py-1 bg-[#B9FF66] text-gray-900 font-bold rounded-full border-2 border-gray-900 text-xs sm:text-sm">
                  📝 {snippet.language}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 border-2 border-blue-600 font-semibold rounded-full text-xs sm:text-sm">
                  👤 {snippet.author.username}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 border-2 border-purple-600 font-semibold rounded-full text-xs sm:text-sm">
                  👍 {snippet._count.upvotes}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-green-600 font-semibold rounded-full text-xs sm:text-sm">
                  💬 {snippet._count.comments}
                </span>
              </div>
              
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map(tag => (
                    <span key={tag.id} className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full border border-gray-300 text-xs sm:text-sm">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div>
                <Link to={`/snippet/${snippet.id}`}>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
