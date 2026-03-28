import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function BlogPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [commenting, setCommenting] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios.get('/api/blogs').then(r => setBlogs(r.data)).catch(() => {});
  }, []);

  const createBlog = async e => {
    e.preventDefault();
    const r = await axios.post('/api/blogs', form);
    setBlogs([r.data, ...blogs]);
    setForm({ title: '', content: '' });
    setShowForm(false);
  };

  const likeBlog = async id => {
    const r = await axios.put(`/api/blogs/${id}/like`);
    setBlogs(blogs.map(b => b.id === id ? { ...b, likes: r.data.likes } : b));
  };

  const addComment = async (id, comment) => {
    if (!comment.trim()) return;
    const r = await axios.post(`/api/blogs/${id}/comment`, { comment });
    setBlogs(blogs.map(b => b.id === id ? { ...b, comments: [...(b.comments || []), r.data] } : b));
    setCommenting({ ...commenting, [id]: '' });
  };

  const deleteBlog = async id => {
    await axios.delete(`/api/blogs/${id}`);
    setBlogs(blogs.filter(b => b.id !== id));
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Health Blog 📝</h1>
          <p>Community health articles and fitness stories</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '✏️ Write Post'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-title">✏️ New Post</div>
          <form onSubmit={createBlog}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="Post title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-input" rows={5} placeholder="Share your health journey, tips, or advice..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" type="submit">Publish Post</button>
          </form>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📝</div><p>No posts yet. Be the first to write!</p></div>
      ) : blogs.map(b => (
        <div className="blog-card" key={b.id}>
          <div className="blog-meta">
            By <strong>{b.authorName}</strong> · {new Date(b.created_at).toLocaleDateString()}
          </div>
          <div className="blog-title">{b.title}</div>
          <div className="blog-content">
            {expanded[b.id] ? b.content : b.content.slice(0, 180) + (b.content.length > 180 ? '...' : '')}
            {b.content.length > 180 && (
              <button onClick={() => setExpanded({...expanded, [b.id]: !expanded[b.id]})}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, marginLeft: 4 }}>
                {expanded[b.id] ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
          <div className="blog-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => likeBlog(b.id)}>❤️ {b.likes}</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💬 {(b.comments || []).length} comments</span>
            {b.authorId === user?.id && (
              <button className="btn btn-danger btn-sm" onClick={() => deleteBlog(b.id)}>🗑️</button>
            )}
          </div>

          {(b.comments || []).length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {b.comments.slice(-2).map(c => (
                <div key={c.id} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <strong style={{ color: 'var(--text)' }}>{c.userName}:</strong> {c.comment}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input className="form-input" placeholder="Add a comment..." style={{ fontSize: 12, padding: '6px 10px' }}
              value={commenting[b.id] || ''}
              onChange={e => setCommenting({...commenting, [b.id]: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && addComment(b.id, commenting[b.id] || '')}
            />
            <button className="btn btn-secondary btn-sm" onClick={() => addComment(b.id, commenting[b.id] || '')}>Post</button>
          </div>
        </div>
      ))}
    </div>
  );
}
