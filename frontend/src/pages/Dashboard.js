import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    axios.get('/api/analytics/dashboard').then(r => setAnalytics(r.data)).catch(() => {});
    axios.get('/api/tips/daily').then(r => setTip(r.data)).catch(() => {});
  }, []);

  const s = analytics?.summary;

  return (
    <div>
      <div className="page-header">
        <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's your health summary for today</p>
      </div>

      {tip && (
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-text">
            <strong>Daily Health Tip</strong>
            {tip.tip}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏃</div>
          <div className="stat-value">{s?.totalWorkouts || 0}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{s?.totalCaloriesBurned || 0}</div>
          <div className="stat-label">Calories Burned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{s?.totalCaloriesConsumed || 0}</div>
          <div className="stat-label">Calories Consumed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💤</div>
          <div className="stat-value">{s?.avgSleep || 0}h</div>
          <div className="stat-label">Avg Sleep</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-value">{s?.avgWater || 0}L</div>
          <div className="stat-label">Avg Water Intake</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">🎯 Goal Progress</div>
          {analytics?.goalProgress && Object.entries(analytics.goalProgress).map(([key, g]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{g.label}</span>
                <span style={{ fontWeight: 600 }}>{g.current} / {g.target}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/trackers')}>➕ Log Workout</button>
            <button className="btn btn-secondary" onClick={() => navigate('/trackers')}>🍽️ Log Meal</button>
            <button className="btn btn-secondary" onClick={() => navigate('/bmi')}>⚖️ Calculate BMI</button>
            <button className="btn btn-secondary" onClick={() => navigate('/trainers')}>🏋️ Find a Trainer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
