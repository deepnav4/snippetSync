import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { CreateSnippetData } from '../lib/types';

export default function CreateSnippet() {
  const [formData, setFormData] = useState<CreateSnippetData>({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    visibility: 'PUBLIC',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) || [] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const snippet = await snippetService.create(formData);
      navigate(`/snippet/${snippet.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create snippet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Snippet</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <div>
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label>Language *</label>
            <select
              value={formData.language}
              onChange={e => setFormData({ ...formData, language: e.target.value })}
              required
            >
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

          <div>
            <label>Code *</label>
            <textarea
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              rows={15}
              style={{ fontFamily: 'monospace' }}
              required
            />
          </div>

          <div>
            <label>Visibility</label>
            <select
              value={formData.visibility}
              onChange={e => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <div>
            <label>Tags</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" onClick={handleAddTag}>Add Tag</button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <span key={tag} style={{ 
                    background: '#e0e0e0', 
                    padding: '5px 10px', 
                    borderRadius: '15px',
                    fontSize: '14px'
                  }}>
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      style={{ 
                        marginLeft: '5px', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '0 5px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Snippet'}
          </button>
        </form>
      </div>
    </div>
  );
}
