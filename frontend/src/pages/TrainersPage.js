import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [matched, setMatched] = useState([]);
  const [view, setView] = useState('matched');

  useEffect(() => {
    axios.get('/api/trainers').then(r => setTrainers(r.data)).catch(() => {});
    axios.get('/api/trainers/match').then(r => setMatched(r.data)).catch(() => {});
  }, []);

  const display = view === 'matched' ? matched : trainers;

  return (
    <div>
      <div className="page-header">
        <h1>Find a Trainer 🏋️</h1>
        <p>Get matched with a trainer based on your fitness goals</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className={`btn ${view === 'matched' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('matched')}>⭐ Best Matches</button>
        <button className={`btn ${view === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('all')}>👥 All Trainers</button>
      </div>

      {display.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏋️</div><p>No trainers found</p></div>
      ) : (
        <div className="grid-2">
          {display.map((t, i) => (
            <div className="trainer-card" key={t.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="trainer-avatar">{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.specialization}</div>
                  {view === 'matched' && i === 0 && <span className="badge badge-green">Best Match</span>}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.bio}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span>⭐ {t.experience_years} yrs experience</span>
                <span>🕐 {t.availability}</span>
              </div>
              {view === 'matched' && t.matchReason && (
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'rgba(45,106,79,0.08)', padding: '6px 10px', borderRadius: 8 }}>
                  ✅ {t.matchReason}
                </div>
              )}
              <button className="btn btn-primary btn-sm">📩 Contact Trainer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
