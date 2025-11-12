import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { Snippet } from '../lib/types';

export default function MySnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
    if (!window.confirm('Are you sure?')) return;
    
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Snippets</h1>
        <Link to="/create"><button>+ Create New Snippet</button></Link>
      </div>
      
      {snippets.length === 0 ? (
        <div className="card">
          <p>You haven't created any snippets yet.</p>
          <Link to="/create"><button>Create your first snippet</button></Link>
        </div>
      ) : (
        <div>
          {snippets.map(snippet => (
            <div key={snippet.id} className="card">
              <h3>{snippet.title}</h3>
              {snippet.description && <p>{snippet.description}</p>}
              
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '100px',
                fontSize: '12px'
              }}>
                {snippet.code.substring(0, 200)}{snippet.code.length > 200 ? '...' : ''}
              </pre>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span>📝 {snippet.language}</span>
                <span>🔒 {snippet.visibility}</span>
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

              {/* VS Code Share Slug */}
              {snippet.shareSlug && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  background: '#f8f9fa', 
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#666', fontWeight: '500' }}>VS Code Slug:</span>
                    <code style={{ 
                      flex: 1,
                      padding: '4px 8px', 
                      background: 'white', 
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}>
                      {snippet.shareSlug}
                    </code>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopySlug(snippet.shareSlug!);
                      }}
                      style={{ 
                        padding: '4px 12px',
                        fontSize: '11px',
                        background: copiedSlug === snippet.shareSlug ? '#28a745' : '#007bff',
                        color: 'white'
                      }}
                    >
                      {copiedSlug === snippet.shareSlug ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <Link to={`/snippet/${snippet.id}`}><button>View</button></Link>
                <button onClick={() => handleDelete(snippet.id)} style={{ background: '#fee', color: 'red' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
