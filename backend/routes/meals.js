const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', auth, (req, res) => {
  const meals = global.db.meals.filter(m => m.userId === req.user.id);
  res.json(meals);
});

router.post('/', auth, (req, res) => {
  const { meal_type, calorie_count, protein, carbs, fats, meal_date } = req.body;
  if (!meal_type || !calorie_count) {
    return res.status(400).json({ message: 'Meal type and calories are required' });
  }
  const meal = {
    id: uuidv4(),
    userId: req.user.id,
    meal_type,
    calorie_count: parseFloat(calorie_count),
    protein: protein ? parseFloat(protein) : null,
    carbs: carbs ? parseFloat(carbs) : null,
    fats: fats ? parseFloat(fats) : null,
    meal_date: meal_date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };
  global.db.meals.push(meal);
  res.status(201).json(meal);
});

router.delete('/:id', auth, (req, res) => {
  const idx = global.db.meals.findIndex(m => m.id === req.params.id && m.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Meal not found' });
  global.db.meals.splice(idx, 1);
  res.json({ message: 'Meal deleted' });
});

module.exports = router;
