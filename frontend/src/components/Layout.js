import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/trackers', icon: '📋', label: 'Trackers' },
  { to: '/analytics', icon: '📊', label: 'Analytics' },
  { to: '/bmi', icon: '⚖️', label: 'BMI & Tips' },
  { to: '/blog', icon: '📝', label: 'Health Blog' },
  { to: '/trainers', icon: '🏋️', label: 'Trainers' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Well<span>Nest</span></h2>
          <p>Smart Health Companion</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
