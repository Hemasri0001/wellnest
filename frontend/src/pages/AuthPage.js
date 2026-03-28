import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', height: '', weight: '', fitness_goal: 'general_health'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password, role);
      } else {
        await register({ ...form, role });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Well<span>Nest</span></h1>
          <p>Smart Health & Fitness Companion</p>
        </div>

        <div className="role-tabs">
          <button className={`role-tab${role === 'user' ? ' active' : ''}`} onClick={() => setRole('user')}>👤 User</button>
          <button className={`role-tab${role === 'trainer' ? ' active' : ''}`} onClick={() => setRole('trainer')}>🏋️ Trainer</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" name="age" type="number" placeholder="25" value={form.age} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input className="form-input" name="weight" type="number" placeholder="70" value={form.weight} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input className="form-input" name="height" type="number" placeholder="170" value={form.height} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <select className="form-select" name="fitness_goal" value={form.fitness_goal} onChange={handleChange}>
                  <option value="general_health">General Health</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
            </>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? `Login as ${role === 'user' ? 'User' : 'Trainer'}` : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'Sign Up' : 'Login'}</button>
        </div>
      </div>
    </div>
  );
}
