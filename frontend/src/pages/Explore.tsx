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

  if (loading) return <div>Loading snippets...</div>;
  if (error) return <div className="error">Error: {error}. <button onClick={loadSnippets}>Retry</button></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Public Snippets</h1>
        <Link to="/create"><button>+ Create Snippet</button></Link>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select 
            value={languageFilter} 
            onChange={e => setLanguageFilter(e.target.value)}
            style={{ minWidth: '150px' }}
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
        <div className="card">
          <p>No snippets found. {searchTerm || languageFilter !== 'all' ? 'Try adjusting your filters.' : 'Be the first to share!'}</p>
        </div>
      ) : (
        <div>
          {filteredSnippets.map(snippet => (
            <div key={snippet.id} className="card">
              <h3>{snippet.title}</h3>
              {snippet.description && <p>{snippet.description}</p>}
              
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '150px',
                fontSize: '12px'
              }}>
                {snippet.code.substring(0, 300)}{snippet.code.length > 300 ? '...' : ''}
              </pre>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span>📝 {snippet.language}</span>
                <span>👤 {snippet.author.username}</span>
                <span>👍 {snippet._count.upvotes}</span>
                <span>💬 {snippet._count.comments}</span>
              </div>
              
              {snippet.tags && snippet.tags.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {snippet.tags.map(tag => (
                    <span key={tag.id} style={{ 
                      background: '#e0e0e0', 
                      padding: '3px 8px', 
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div style={{ marginTop: '15px' }}>
                <Link to={`/snippet/${snippet.id}`}><button>View Details</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
