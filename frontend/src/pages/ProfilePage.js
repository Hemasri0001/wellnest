import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    fitness_goal: user?.fitness_goal || 'general_health'
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.put('/api/auth/profile', form);
      updateUser(r.data);
      setMsg('Profile updated successfully! ✅');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to update profile');
    }
    setLoading(false);
  };

  const bmi = form.height && form.weight
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null;

  return (
    <div>
      <div className="page-header">
        <h1>My Profile 👤</h1>
        <p>Manage your personal health profile</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 20, background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))', borderRadius: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', fontWeight: 800 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{user?.email}</div>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
          </div>

          {msg && <div className={`alert ${msg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="form-input" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input className="form-input" type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select className="form-select" value={form.fitness_goal} onChange={e => setForm({...form, fitness_goal: e.target.value})}>
                <option value="general_health">General Health</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">📊 Health Snapshot</div>
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="stat-card"><div className="stat-icon">📏</div><div className="stat-value">{form.height || '—'}</div><div className="stat-label">Height (cm)</div></div>
              <div className="stat-card"><div className="stat-icon">⚖️</div><div className="stat-value">{form.weight || '—'}</div><div className="stat-label">Weight (kg)</div></div>
              <div className="stat-card"><div className="stat-icon">🎂</div><div className="stat-value">{form.age || '—'}</div><div className="stat-label">Age</div></div>
              <div className="stat-card">
                <div className="stat-icon">📐</div>
                <div className="stat-value" style={{ fontSize: 22 }}>{bmi || '—'}</div>
                <div className="stat-label">BMI (estimate)</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">🎯 Current Goal</div>
            <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {{ general_health: '💪', weight_loss: '🏃', muscle_gain: '🦾', endurance: '🚴', flexibility: '🧘' }[form.fitness_goal]}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, textTransform: 'capitalize' }}>
                {form.fitness_goal.replace('_', ' ')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Trainers and tips are personalized for this goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
