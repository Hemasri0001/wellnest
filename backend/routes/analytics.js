const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/dashboard', auth, (req, res) => {
  const userId = req.user.id;
  const user = global.db.users.find(u => u.id === userId);

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const workouts = global.db.workouts.filter(w => w.userId === userId);
  const meals = global.db.meals.filter(m => m.userId === userId);
  const logs = global.db.logs.filter(l => l.userId === userId);

  // Weekly workout data
  const weeklyWorkouts = last7Days.map(date => ({
    date,
    duration: workouts.filter(w => w.workout_date === date).reduce((s, w) => s + w.duration_minutes, 0),
    calories: workouts.filter(w => w.workout_date === date).reduce((s, w) => s + w.calories_burned, 0)
  }));

  // Weekly calorie data
  const weeklyCalories = last7Days.map(date => ({
    date,
    consumed: meals.filter(m => m.meal_date === date).reduce((s, m) => s + m.calorie_count, 0),
    burned: workouts.filter(w => w.workout_date === date).reduce((s, w) => s + w.calories_burned, 0)
  }));

  // Weekly sleep & water
  const weeklyLogs = last7Days.map(date => {
    const log = logs.find(l => l.log_date === date);
    return { date, water: log?.water_intake_liters || 0, sleep: log?.sleep_hours || 0 };
  });

  // Totals
  const totalWorkouts = workouts.length;
  const totalCaloriesBurned = workouts.reduce((s, w) => s + w.calories_burned, 0);
  const totalCaloriesConsumed = meals.reduce((s, m) => s + m.calorie_count, 0);
  const avgSleep = logs.length ? (logs.reduce((s, l) => s + l.sleep_hours, 0) / logs.length).toFixed(1) : 0;
  const avgWater = logs.length ? (logs.reduce((s, l) => s + l.water_intake_liters, 0) / logs.length).toFixed(1) : 0;

  // Goal progress
  const goalProgress = {
    workouts: { current: totalWorkouts, target: 20, label: 'Total Workouts' },
    calories_burned: { current: totalCaloriesBurned, target: 10000, label: 'Calories Burned' },
    sleep: { current: parseFloat(avgSleep), target: 8, label: 'Avg Sleep (hrs)' },
    water: { current: parseFloat(avgWater), target: 2.5, label: 'Avg Water (L)' }
  };

  res.json({
    summary: { totalWorkouts, totalCaloriesBurned, totalCaloriesConsumed, avgSleep, avgWater },
    weeklyWorkouts,
    weeklyCalories,
    weeklyLogs,
    goalProgress,
    fitnessGoal: user?.fitness_goal || 'general_health'
  });
});

module.exports = router;
