import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TABS = ['Workout', 'Meals', 'Water & Sleep'];

export default function Trackers() {
  const [tab, setTab] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState('');

  const [wForm, setWForm] = useState({ exercise_type: 'cardio', duration_minutes: '', calories_burned: '', workout_date: today() });
  const [mForm, setMForm] = useState({ meal_type: 'breakfast', calorie_count: '', protein: '', carbs: '', fats: '', meal_date: today() });
  const [lForm, setLForm] = useState({ water_intake_liters: '', sleep_hours: '', notes: '', log_date: today() });

  useEffect(() => {
    axios.get('/api/workouts').then(r => setWorkouts(r.data));
    axios.get('/api/meals').then(r => setMeals(r.data));
    axios.get('/api/logs').then(r => setLogs(r.data));
  }, []);

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const addWorkout = async e => {
    e.preventDefault();
    const r = await axios.post('/api/workouts', wForm);
    setWorkouts([r.data, ...workouts]);
    setWForm({ exercise_type: 'cardio', duration_minutes: '', calories_burned: '', workout_date: today() });
    flash('Workout logged! 💪');
  };

  const deleteWorkout = async id => {
    await axios.delete(`/api/workouts/${id}`);
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const addMeal = async e => {
    e.preventDefault();
    const r = await axios.post('/api/meals', mForm);
    setMeals([r.data, ...meals]);
    setMForm({ meal_type: 'breakfast', calorie_count: '', protein: '', carbs: '', fats: '', meal_date: today() });
    flash('Meal logged! 🍽️');
  };

  const deleteMeal = async id => {
    await axios.delete(`/api/meals/${id}`);
    setMeals(meals.filter(m => m.id !== id));
  };

  const saveLog = async e => {
    e.preventDefault();
    const r = await axios.post('/api/logs', lForm);
    setLogs(prev => { const idx = prev.findIndex(l => l.id === r.data.id); return idx !== -1 ? prev.map((l, i) => i === idx ? r.data : l) : [r.data, ...prev]; });
    flash('Daily log saved! ✅');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Health Trackers 📋</h1>
        <p>Log your daily workouts, meals, water and sleep</p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t} className={`btn ${tab === i ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">➕ Log Workout</div>
            <form onSubmit={addWorkout}>
              <div className="form-group">
                <label className="form-label">Exercise Type</label>
                <select className="form-select" value={wForm.exercise_type} onChange={e => setWForm({...wForm, exercise_type: e.target.value})}>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="yoga">Yoga</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="running">Running</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input className="form-input" type="number" placeholder="30" value={wForm.duration_minutes} onChange={e => setWForm({...wForm, duration_minutes: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Calories Burned (optional)</label>
                <input className="form-input" type="number" placeholder="Auto-estimated if blank" value={wForm.calories_burned} onChange={e => setWForm({...wForm, calories_burned: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={wForm.workout_date} onChange={e => setWForm({...wForm, workout_date: e.target.value})} />
              </div>
              <button className="btn btn-primary btn-full" type="submit">Log Workout</button>
            </form>
          </div>
          <div className="card">
            <div className="card-title">🏃 Workout Log</div>
            {workouts.length === 0 ? <div className="empty-state"><div className="empty-icon">🏃</div><p>No workouts logged yet</p></div> :
              workouts.slice(0, 8).map(w => (
                <div className="list-item" key={w.id}>
                  <div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>{w.exercise_type}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.duration_minutes} min · {w.calories_burned} kcal · {w.workout_date}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(w.id)}>🗑️</button>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">➕ Log Meal</div>
            <form onSubmit={addMeal}>
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <select className="form-select" value={mForm.meal_type} onChange={e => setMForm({...mForm, meal_type: e.target.value})}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input className="form-input" type="number" placeholder="500" value={mForm.calorie_count} onChange={e => setMForm({...mForm, calorie_count: e.target.value})} required />
              </div>
              <div className="grid-3">
                {['protein','carbs','fats'].map(n => (
                  <div className="form-group" key={n}>
                    <label className="form-label" style={{textTransform:'capitalize'}}>{n} (g)</label>
                    <input className="form-input" type="number" placeholder="0" value={mForm[n]} onChange={e => setMForm({...mForm, [n]: e.target.value})} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={mForm.meal_date} onChange={e => setMForm({...mForm, meal_date: e.target.value})} />
              </div>
              <button className="btn btn-primary btn-full" type="submit">Log Meal</button>
            </form>
          </div>
          <div className="card">
            <div className="card-title">🍽️ Meal Log</div>
            {meals.length === 0 ? <div className="empty-state"><div className="empty-icon">🍽️</div><p>No meals logged yet</p></div> :
              meals.slice(0, 8).map(m => (
                <div className="list-item" key={m.id}>
                  <div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>{m.meal_type}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.calorie_count} kcal · {m.meal_date}</div>
                    {m.protein && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>P:{m.protein}g C:{m.carbs}g F:{m.fats}g</div>}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMeal(m.id)}>🗑️</button>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">➕ Log Water & Sleep</div>
            <form onSubmit={saveLog}>
              <div className="form-group">
                <label className="form-label">Water Intake (liters)</label>
                <input className="form-input" type="number" step="0.1" placeholder="2.5" value={lForm.water_intake_liters} onChange={e => setLForm({...lForm, water_intake_liters: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Sleep Duration (hours)</label>
                <input className="form-input" type="number" step="0.5" placeholder="7.5" value={lForm.sleep_hours} onChange={e => setLForm({...lForm, sleep_hours: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" placeholder="Felt well rested..." value={lForm.notes} onChange={e => setLForm({...lForm, notes: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={lForm.log_date} onChange={e => setLForm({...lForm, log_date: e.target.value})} />
              </div>
              <button className="btn btn-primary btn-full" type="submit">Save Log</button>
            </form>
          </div>
          <div className="card">
            <div className="card-title">📅 Daily Logs</div>
            {logs.length === 0 ? <div className="empty-state"><div className="empty-icon">💧</div><p>No logs yet</p></div> :
              logs.slice(0, 8).map(l => (
                <div className="list-item" key={l.id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{l.log_date}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>💧 {l.water_intake_liters}L · 💤 {l.sleep_hours}h</div>
                    {l.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle:'italic' }}>{l.notes}</div>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

function today() { return new Date().toISOString().split('T')[0]; }
