import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { snippetService } from '../lib/snippets';
import { useAuth } from '../context/AuthContext';
import type { Snippet, Comment } from '../lib/types';

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [slugCopied, setSlugCopied] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    if (id) {
      loadSnippet();
      loadComments();
      if (user) {
        checkUpvoteStatus();
      }
    }
  }, [id, user]);

  const checkUpvoteStatus = async () => {
    if (!id) return;
    try {
      const { upvoted } = await snippetService.checkUpvote(id);
      setIsUpvoted(upvoted);
    } catch (error) {
      console.error('Failed to check upvote status:', error);
    }
  };

  const loadSnippet = async () => {
    try {
      const data = await snippetService.getById(id!);
      setSnippet(data);
    } catch (error) {
      console.error('Failed to load snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await snippetService.getComments(id!);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCopySlug = () => {
    const shareCode = snippet?.shareCode?.[0];
    if (shareCode) {
      navigator.clipboard.writeText(shareCode.code);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    }
  };

  const handleGenerateCode = async () => {
    if (!snippet) return;
    
    setGeneratingCode(true);
    try {
      const result = await snippetService.generateShareCode(snippet.id);
      // Update snippet with new share code
      setSnippet({
        ...snippet,
        shareCode: [{
          code: result.code,
          expiresAt: result.expiresAt,
        }],
      });
      // Auto-copy the code
      navigator.clipboard.writeText(result.code);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate share code';
      alert(`❌ ${message}`);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleUpvote = async () => {
    if (!snippet) return;
    try {
      const { upvoted } = await snippetService.toggleUpvote(snippet.id);
      setIsUpvoted(upvoted);
      setSnippet({
        ...snippet,
        _count: {
          ...snippet._count,
          upvotes: upvoted ? snippet._count.upvotes + 1 : snippet._count.upvotes - 1,
        },
      });
    } catch (error) {
      console.error('Failed to toggle upvote:', error);
    }
  };

  const handleDelete = async () => {
    if (!snippet || !window.confirm('Are you sure?')) return;
    try {
      await snippetService.delete(snippet.id);
      navigate('/my-snippets');
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !snippet) return;

    try {
      const newComment = await snippetService.addComment(snippet.id, commentText);
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-900 border-t-[#B9FF66] mb-4"></div>
          <p className="text-lg text-gray-600">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Snippet not found</p>
          <p className="text-gray-600">The snippet you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === snippet.authorId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header Card */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{snippet.title}</h1>
        {snippet.description && (
          <p className="text-gray-600 text-lg mb-6">{snippet.description}</p>
        )}
        
        <div className="flex flex-wrap gap-6 items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Language:</span>
            <span className="bg-[#B9FF66] text-gray-900 px-3 py-1 rounded-lg font-bold text-sm border-2 border-gray-900">
              {snippet.language}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">By:</span>
            <span className="text-gray-900 font-bold">{snippet.author.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Visibility:</span>
            <span className="text-gray-900 font-bold capitalize">{snippet.visibility}</span>
          </div>
        </div>
        
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {snippet.tags.map(tag => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-medium border border-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Share Code Section */}
        <div className="mb-6">
          {snippet.shareCode && snippet.shareCode.length > 0 ? (
            <div className="bg-[#B9FF66] border-2 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_#191A23]">
              <div className="mb-3">
                <span className="text-sm font-bold text-gray-900">
                  ⚡ Temporary Share Code (Expires in 5 minutes)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <code className="flex-1 bg-white border-2 border-gray-900 rounded-lg px-4 py-3 font-mono text-xl font-bold text-gray-900 tracking-wider">
                  {snippet.shareCode[0].code}
                </code>
                <button
                  onClick={handleCopySlug}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold border-2 border-gray-900 hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  {slugCopied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-900 space-y-1">
                <p>📅 Expires: {new Date(snippet.shareCode[0].expiresAt).toLocaleString()}</p>
                <p>💡 Use in VS Code: <span className="font-bold">Ctrl+Shift+P → "SnippetSync: Import Snippet"</span></p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
              <p className="text-gray-600 text-sm mb-3">
                🔑 No active share code. Generate one to import this snippet in VS Code.
              </p>
              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="bg-[#B9FF66] text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingCode ? '⏳ Generating...' : '✨ Generate Share Code'}
              </button>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleUpvote}
            disabled={!user}
            className={`${
              isUpvoted ? 'bg-[#B9FF66]' : 'bg-white'
            } text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpvoted ? '✓ Upvoted' : '👍 Upvote'} ({snippet._count.upvotes})
          </button>
          <button
            onClick={handleCopy}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy Code'}
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Code</h3>
        <pre className="bg-gray-900 text-[#B9FF66] p-6 rounded-xl overflow-auto max-h-[500px] border-2 border-gray-900 font-mono text-sm leading-relaxed">
          {snippet.code}
        </pre>
      </div>

      {/* Comments Section */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-[8px_8px_0_#191A23] p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>
        
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={4}
              required
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B9FF66] resize-none mb-4"
            />
            <button
              type="submit"
              className="bg-[#B9FF66] text-gray-900 px-6 py-3 rounded-lg font-bold border-2 border-gray-900 shadow-[4px_4px_0_#191A23] hover:shadow-[2px_2px_0_#191A23] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-8 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
            Please login to comment
          </p>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map(comment => (
              <div
                key={comment.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-gray-900 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-900">{comment.author.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
