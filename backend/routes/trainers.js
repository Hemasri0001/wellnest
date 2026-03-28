const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json(global.db.trainers);
});

router.get('/match', auth, (req, res) => {
  const user = global.db.users.find(u => u.id === req.user.id);
  const goal = user?.fitness_goal || 'general_health';

  const scored = global.db.trainers.map(t => {
    let score = 0;
    if (t.goals?.includes(goal)) score += 3;
    if (t.experience_years >= 5) score += 2;
    if (t.experience_years >= 3) score += 1;
    return { ...t, matchScore: score, matchReason: `Matched for your goal: ${goal.replace('_', ' ')}` };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  res.json(scored);
});

module.exports = router;
