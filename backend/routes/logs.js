const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', auth, (req, res) => {
  const logs = global.db.logs.filter(l => l.userId === req.user.id);
  res.json(logs);
});

router.post('/', auth, (req, res) => {
  const { water_intake_liters, sleep_hours, notes, log_date } = req.body;
  const date = log_date || new Date().toISOString().split('T')[0];
  // Upsert - update existing log for same date or create new
  const existingIdx = global.db.logs.findIndex(l => l.userId === req.user.id && l.log_date === date);
  if (existingIdx !== -1) {
    global.db.logs[existingIdx] = {
      ...global.db.logs[existingIdx],
      water_intake_liters: water_intake_liters !== undefined ? parseFloat(water_intake_liters) : global.db.logs[existingIdx].water_intake_liters,
      sleep_hours: sleep_hours !== undefined ? parseFloat(sleep_hours) : global.db.logs[existingIdx].sleep_hours,
      notes: notes || global.db.logs[existingIdx].notes,
      updated_at: new Date().toISOString()
    };
    return res.json(global.db.logs[existingIdx]);
  }
  const log = {
    id: uuidv4(),
    userId: req.user.id,
    water_intake_liters: water_intake_liters ? parseFloat(water_intake_liters) : 0,
    sleep_hours: sleep_hours ? parseFloat(sleep_hours) : 0,
    notes: notes || '',
    log_date: date,
    created_at: new Date().toISOString()
  };
  global.db.logs.push(log);
  res.status(201).json(log);
});

module.exports = router;
