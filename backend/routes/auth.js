const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'wellnest_secret_2024';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, age, height, weight, fitness_goal } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (global.db.users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name, email,
      password: hashedPassword,
      role: role || 'user',
      age: age || null,
      height: height || null,
      weight: weight || null,
      fitness_goal: fitness_goal || 'general_health',
      created_at: new Date().toISOString()
    };
    global.db.users.push(user);

    // If trainer role, add to trainers list
    if (role === 'trainer') {
      global.db.trainers.push({
        id: global.db.trainers.length + 10,
        userId: user.id,
        name: user.name,
        specialization: 'General Fitness',
        experience_years: 1,
        availability: 'Flexible',
        bio: 'New trainer on WellNest.',
        goals: ['general_health']
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = global.db.users.find(u => u.email === email && u.role === role);
    if (!user) return res.status(400).json({ message: 'Invalid credentials or role' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const user = global.db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT /api/auth/profile
router.put('/profile', auth, (req, res) => {
  const idx = global.db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const { name, age, height, weight, fitness_goal } = req.body;
  global.db.users[idx] = { ...global.db.users[idx], name, age, height, weight, fitness_goal };
  const { password: _, ...userWithoutPassword } = global.db.users[idx];
  res.json(userWithoutPassword);
});

module.exports = router;
