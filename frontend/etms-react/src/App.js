import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Tasks from './Pages/Tasks';
import Employees from './Pages/Employees';
import Attendance from './Pages/Attendance';
import Leave from './Pages/Leave';
import Performance from './Pages/Performance';
import Profile from './Pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route
                path="employees"
                element={
                  <ProtectedRoute managerOnly>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leave" element={<Leave />} />
              <Route path="performance" element={<Performance />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
