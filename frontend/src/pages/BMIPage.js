import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function BMIPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ height: user?.height || '', weight: user?.weight || '' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/bmi/history').then(r => setHistory(r.data)).catch(() => {});
    axios.get('/api/tips/all').then(r => setTips(r.data)).catch(() => {});
  }, []);

  const calculate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post('/api/bmi/calculate', form);
      setResult(r.data);
      setHistory(prev => [r.data, ...prev]);
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>BMI Calculator & Health Tips ⚖️</h1>
        <p>Check your Body Mass Index and get personalized health guidance</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">⚖️ BMI Calculator</div>
          <form onSubmit={calculate}>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input className="form-input" type="number" placeholder="170" value={form.height} onChange={e => setForm({...form, height: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" placeholder="70" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate BMI'}
            </button>
          </form>

          {result && (
            <div className="bmi-result" style={{ marginTop: 24 }}>
              <div className="bmi-value" style={{ color: result.color }}>{result.bmi_value}</div>
              <div className="bmi-status" style={{ color: result.color }}>{result.status}</div>
              <div className="bmi-guidance">{result.guidance}</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[{label:'Underweight', range:'< 18.5', c:'#3b82f6'},{label:'Normal', range:'18.5–24.9', c:'#22c55e'},{label:'Overweight', range:'25–29.9', c:'#f59e0b'},{label:'Obese', range:'≥ 30', c:'#ef4444'}].map(cat => (
                  <div key={cat.label} style={{ textAlign:'center', padding:'6px 12px', borderRadius: 8, background: result.status === cat.label ? cat.c + '20' : 'var(--bg)', border: `1.5px solid ${result.status === cat.label ? cat.c : 'var(--border)'}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cat.c }}>{cat.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cat.range}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">📅 BMI History</div>
          {history.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⚖️</div><p>No BMI records yet</p></div>
          ) : history.slice(0, 6).map(r => (
            <div className="list-item" key={r.id}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: r.color }}>{r.bmi_value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.recorded_at).toLocaleDateString()}</div>
              </div>
              <span className="badge" style={{ background: r.color + '20', color: r.color }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">💡 All Health Tips</div>
        <div className="grid-2">
          {tips.map(t => (
            <div key={t.id} style={{ padding: '14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', marginBottom: 6 }}>{t.category}</div>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{t.tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
