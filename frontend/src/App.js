import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trackers from './pages/Trackers';
import Analytics from './pages/Analytics';
import BMIPage from './pages/BMIPage';
import BlogPage from './pages/BlogPage';
import TrainersPage from './pages/TrainersPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'14px', color:'#6b7c72' }}>Loading WellNest...</div>;
  return user ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trackers" element={<Trackers />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="bmi" element={<BMIPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="trainers" element={<TrainersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
