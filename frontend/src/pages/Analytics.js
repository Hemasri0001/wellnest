import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/analytics/dashboard').then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="empty-state"><div className="empty-icon">📊</div><p>Loading analytics...</p></div>;

  const dayLabel = d => d.date?.slice(5);

  return (
    <div>
      <div className="page-header">
        <h1>Analytics Dashboard 📊</h1>
        <p>Visual insights into your health progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">🏃</div><div className="stat-value">{data.summary.totalWorkouts}</div><div className="stat-label">Total Workouts</div></div>
        <div className="stat-card"><div className="stat-icon">🔥</div><div className="stat-value">{data.summary.totalCaloriesBurned}</div><div className="stat-label">Calories Burned</div></div>
        <div className="stat-card"><div className="stat-icon">🍽️</div><div className="stat-value">{data.summary.totalCaloriesConsumed}</div><div className="stat-label">Calories Consumed</div></div>
        <div className="stat-card"><div className="stat-icon">💤</div><div className="stat-value">{data.summary.avgSleep}h</div><div className="stat-label">Avg Sleep</div></div>
        <div className="stat-card"><div className="stat-icon">💧</div><div className="stat-value">{data.summary.avgWater}L</div><div className="stat-label">Avg Water</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">🏃 Weekly Workout Duration (mins)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyWorkouts.map(d => ({ ...d, date: dayLabel(d) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e8dc" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="duration" fill="#2d6a4f" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">🔥 Calories: Consumed vs Burned</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.weeklyCalories.map(d => ({ ...d, date: dayLabel(d) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e8dc" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumed" stroke="#f4a261" strokeWidth={2} dot={false} name="Consumed" />
              <Line type="monotone" dataKey="burned" stroke="#2d6a4f" strokeWidth={2} dot={false} name="Burned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">💧 Water Intake (L)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyLogs.map(d => ({ ...d, date: dayLabel(d) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e8dc" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="water" fill="#3b82f6" radius={[4,4,0,0]} name="Water (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">💤 Sleep Duration (hrs)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.weeklyLogs.map(d => ({ ...d, date: dayLabel(d) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8e8dc" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Sleep (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🎯 Goal Progress Tracker</div>
        <div className="grid-2">
          {data.goalProgress && Object.entries(data.goalProgress).map(([key, g]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{g.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{g.current} / {g.target}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.min(100, (g.current / g.target) * 100)}%`,
                  background: g.current >= g.target ? 'var(--success)' : 'var(--primary)'
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {Math.min(100, Math.round((g.current / g.target) * 100))}% of goal
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
