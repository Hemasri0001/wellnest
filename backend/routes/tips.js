const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/daily', auth, (req, res) => {
  const tips = global.db.healthTips;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const tip = tips[dayOfYear % tips.length];
  res.json(tip);
});

router.get('/all', auth, (req, res) => {
  res.json(global.db.healthTips);
});

module.exports = router;
