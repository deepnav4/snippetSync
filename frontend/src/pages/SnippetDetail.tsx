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
    if (snippet?.shareSlug) {
      navigator.clipboard.writeText(snippet.shareSlug);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
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

  if (loading) return <div>Loading...</div>;
  if (!snippet) return <div>Snippet not found</div>;

  const isOwner = user?.id === snippet.authorId;

  return (
    <div>
      <div className="card">
        <h1>{snippet.title}</h1>
        {snippet.description && <p>{snippet.description}</p>}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
          <span>Language: <strong>{snippet.language}</strong></span>
          <span>By: <strong>{snippet.author.username}</strong></span>
          <span>Visibility: <strong>{snippet.visibility}</strong></span>
        </div>
        
        {snippet.tags && snippet.tags.length > 0 && (
          <div style={{ marginTop: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {snippet.tags.map(tag => (
              <span key={tag.id} style={{ 
                background: '#e0e0e0', 
                padding: '5px 10px', 
                borderRadius: '15px',
                fontSize: '14px'
              }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Share Slug for VS Code Extension */}
        {snippet.shareSlug && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <span style={{ fontWeight: '600', fontSize: '14px', color: '#555' }}>
                🔗 VS Code Extension Import:
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code style={{ 
                flex: 1,
                padding: '8px 12px', 
                background: 'white', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#333'
              }}>
                {snippet.shareSlug}
              </code>
              <button 
                onClick={handleCopySlug}
                style={{ 
                  padding: '8px 16px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap'
                }}
              >
                {slugCopied ? '✓ Copied!' : '📋 Copy Slug'}
              </button>
            </div>
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '12px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              Use this slug in VS Code: Ctrl+Shift+P → "SnippetSync: Import Snippet"
            </p>
          </div>
        )}
        
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleUpvote} 
            disabled={!user}
            style={{ 
              background: isUpvoted ? '#28a745' : '#007bff',
              color: 'white'
            }}
          >
            {isUpvoted ? '✓ Upvoted' : '👍 Upvote'} ({snippet._count.upvotes})
          </button>
          <button onClick={handleCopy}>
            {copySuccess ? '✓ Copied!' : '📋 Copy Code'}
          </button>
          {isOwner && (
            <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white' }}>🗑️ Delete</button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Code</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          maxHeight: '500px'
        }}>{snippet.code}</pre>
      </div>

      <div className="card">
        <h3>Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>Please login to comment</p>
        )}

        <div>
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{ 
                padding: '15px', 
                background: '#f9f9f9', 
                borderRadius: '5px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>{comment.author.username}</strong>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
                <p style={{ margin: '5px 0' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
