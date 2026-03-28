const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', auth, (req, res) => {
  const blogs = global.db.blogs.map(b => ({ ...b, commentCount: b.comments.length }));
  res.json(blogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

router.post('/', auth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
  const user = global.db.users.find(u => u.id === req.user.id);
  const blog = {
    id: uuidv4(),
    authorId: req.user.id,
    authorName: user?.name || 'User',
    title, content,
    created_at: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: []
  };
  global.db.blogs.push(blog);
  res.status(201).json(blog);
});

router.put('/:id/like', auth, (req, res) => {
  const blog = global.db.blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  const alreadyLiked = blog.likedBy?.includes(req.user.id);
  if (alreadyLiked) {
    blog.likes = Math.max(0, blog.likes - 1);
    blog.likedBy = blog.likedBy.filter(id => id !== req.user.id);
  } else {
    blog.likes += 1;
    blog.likedBy = [...(blog.likedBy || []), req.user.id];
  }
  res.json({ likes: blog.likes, liked: !alreadyLiked });
});

router.post('/:id/comment', auth, (req, res) => {
  const blog = global.db.blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  const user = global.db.users.find(u => u.id === req.user.id);
  const comment = {
    id: uuidv4(),
    userId: req.user.id,
    userName: user?.name || 'User',
    comment: req.body.comment,
    commented_at: new Date().toISOString()
  };
  blog.comments.push(comment);
  res.status(201).json(comment);
});

router.delete('/:id', auth, (req, res) => {
  const idx = global.db.blogs.findIndex(b => b.id === req.params.id && b.authorId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Blog not found or not authorized' });
  global.db.blogs.splice(idx, 1);
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
