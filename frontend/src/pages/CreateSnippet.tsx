import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import type { CreateSnippetData } from '../lib/types';
import { FloatingCode, GridDots } from '../svgs';

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
      const result = await snippetService.create(formData);
      alert(`Snippet created successfully!\n\nShare Code: ${result.shareCode}\n\nThis code expires in 5 minutes. You can use it in VS Code to import the snippet.\n\nCtrl+Shift+P → "SnippetSync: Import Snippet"`);
      navigate(`/snippet/${result.snippet.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create snippet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative SVGs */}
      <div className="absolute top-20 right-10 opacity-10 hidden lg:block">
        <GridDots color="#191A23" />
      </div>
      <div className="absolute bottom-20 left-10 floating-animation opacity-15 hidden lg:block" style={{ animationDelay: '1.5s' }}>
        <FloatingCode color="#B9FF66" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
          Create <span className="bg-[#B9FF66] px-2">Snippet</span>
        </h1>
        
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[8px_8px_0_#191A23]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-600 text-red-600 px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                placeholder="My awesome code snippet"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all resize-none"
                placeholder="What does this snippet do?"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={e => setFormData({ ...formData, language: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-medium bg-white"
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Visibility
                </label>
                <select
                  value={formData.visibility}
                  onChange={e => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-medium bg-white"
                >
                  <option value="PUBLIC">🌍 Public</option>
                  <option value="PRIVATE">🔒 Private</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Code *
              </label>
              <textarea
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                rows={15}
                required
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all font-mono text-sm bg-gray-900 text-[#B9FF66] resize-none"
                placeholder="// Your code here..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#B9FF66] focus:ring-2 focus:ring-[#B9FF66] transition-all"
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
  
                  Add Tag
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-[#B9FF66] text-gray-900 font-medium rounded-full border-2 border-gray-900 flex items-center gap-2">
                      #{tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-900 hover:text-red-600 font-bold text-lg"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-6 py-4 bg-[#B9FF66] text-gray-900 font-bold text-lg rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Snippet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
