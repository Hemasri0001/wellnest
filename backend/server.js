const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database (no external DB needed for prototype)
global.db = {
  users: [],
  workouts: [],
  meals: [],
  logs: [],       // water + sleep
  bmiRecords: [],
  blogs: [],
  trainers: [],
  matches: [],
  healthTips: [
    { id: 1, tip: "Drink at least 8 glasses of water daily to stay hydrated.", category: "hydration" },
    { id: 2, tip: "Aim for 7-9 hours of sleep each night for optimal recovery.", category: "sleep" },
    { id: 3, tip: "Include protein in every meal to support muscle repair.", category: "nutrition" },
    { id: 4, tip: "Take a 5-minute walk every hour if you sit for long periods.", category: "activity" },
    { id: 5, tip: "Eat colorful vegetables daily for a wide range of vitamins.", category: "nutrition" },
    { id: 6, tip: "Warm up before any workout to prevent injury.", category: "fitness" },
    { id: 7, tip: "Track your meals to stay accountable to your nutrition goals.", category: "nutrition" },
    { id: 8, tip: "Rest days are just as important as workout days for growth.", category: "fitness" },
    { id: 9, tip: "Stretch for at least 10 minutes before bed to relax muscles.", category: "sleep" },
    { id: 10, tip: "Reduce sugar intake to improve energy levels throughout the day.", category: "nutrition" }
  ]
};

// Seed some trainer data
global.db.trainers = [
  { id: 1, userId: null, name: "Priya Sharma", specialization: "Weight Loss", experience_years: 5, availability: "Mon-Fri 6am-8pm", bio: "Certified nutritionist and cardio specialist.", goals: ["weight_loss", "general_health"] },
  { id: 2, userId: null, name: "Arjun Mehta", specialization: "Muscle Gain", experience_years: 8, availability: "Mon-Sat 7am-9pm", bio: "Strength coach with expertise in hypertrophy training.", goals: ["muscle_gain"] },
  { id: 3, userId: null, name: "Sneha Kapoor", specialization: "Yoga & Wellness", experience_years: 6, availability: "Daily 6am-6pm", bio: "Yoga instructor focusing on flexibility and mental wellness.", goals: ["general_health", "flexibility"] },
  { id: 4, userId: null, name: "Rohan Das", specialization: "HIIT & Cardio", experience_years: 4, availability: "Tue-Sun 5am-7pm", bio: "High intensity training specialist for endurance building.", goals: ["weight_loss", "endurance"] }
];

global.db.blogs = [
  { id: 1, authorId: null, authorName: "Admin", title: "5 Benefits of Morning Workouts", content: "Morning workouts kickstart your metabolism, improve mood, and help you stay consistent. Studies show that people who exercise in the morning are more likely to stick to their routine...", created_at: new Date(Date.now() - 86400000 * 3).toISOString(), likes: 24, comments: [] },
  { id: 2, authorId: null, authorName: "Trainer Priya", title: "Nutrition Tips for Weight Loss", content: "Losing weight is 80% diet and 20% exercise. Focus on whole foods, lean proteins, and plenty of fiber. Avoid processed foods and hidden sugars in drinks...", created_at: new Date(Date.now() - 86400000).toISOString(), likes: 18, comments: [] }
];

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/bmi', require('./routes/bmi'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/trainers', require('./routes/trainers'));

app.get('/', (req, res) => res.json({ message: 'WellNest API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 WellNest server running on port ${PORT}`));
