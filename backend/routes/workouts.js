const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET all workouts for user
router.get('/', auth, (req, res) => {
  const workouts = global.db.workouts.filter(w => w.userId === req.user.id);
  res.json(workouts);
});

// POST log a workout
router.post('/', auth, (req, res) => {
  const { exercise_type, duration_minutes, calories_burned, workout_date } = req.body;
  if (!exercise_type || !duration_minutes) {
    return res.status(400).json({ message: 'Exercise type and duration are required' });
  }
  const workout = {
    id: uuidv4(),
    userId: req.user.id,
    exercise_type,
    duration_minutes: parseInt(duration_minutes),
    calories_burned: calories_burned ? parseFloat(calories_burned) : Math.round(duration_minutes * 5),
    workout_date: workout_date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };
  global.db.workouts.push(workout);
  res.status(201).json(workout);
});

// DELETE a workout
router.delete('/:id', auth, (req, res) => {
  const idx = global.db.workouts.findIndex(w => w.id === req.params.id && w.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Workout not found' });
  global.db.workouts.splice(idx, 1);
  res.json({ message: 'Workout deleted' });
});

module.exports = router;
