const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

function getBMICategory(bmi) {
  if (bmi < 18.5) return { status: 'Underweight', color: '#3b82f6', guidance: 'Consider increasing caloric intake with nutrient-rich foods and consult a nutritionist.' };
  if (bmi < 25) return { status: 'Normal', color: '#22c55e', guidance: 'Great job! Maintain your current healthy lifestyle with balanced diet and regular exercise.' };
  if (bmi < 30) return { status: 'Overweight', color: '#f59e0b', guidance: 'Focus on a balanced diet, reduce processed foods, and aim for 150 mins of moderate exercise weekly.' };
  return { status: 'Obese', color: '#ef4444', guidance: 'Consult a healthcare provider. Start with low-impact exercises and a calorie-controlled diet.' };
}

router.post('/calculate', auth, (req, res) => {
  let { height, weight } = req.body;
  const user = global.db.users.find(u => u.id === req.user.id);
  height = height || user?.height;
  weight = weight || user?.weight;
  if (!height || !weight) return res.status(400).json({ message: 'Height (cm) and weight (kg) are required' });

  const heightM = parseFloat(height) / 100;
  const bmi = parseFloat(weight) / (heightM * heightM);
  const bmiRounded = Math.round(bmi * 10) / 10;
  const category = getBMICategory(bmiRounded);

  const record = {
    id: uuidv4(),
    userId: req.user.id,
    bmi_value: bmiRounded,
    status: category.status,
    color: category.color,
    guidance: category.guidance,
    height: parseFloat(height),
    weight: parseFloat(weight),
    recorded_at: new Date().toISOString()
  };
  global.db.bmiRecords.push(record);
  res.json(record);
});

router.get('/history', auth, (req, res) => {
  const records = global.db.bmiRecords.filter(r => r.userId === req.user.id);
  res.json(records);
});

module.exports = router;
