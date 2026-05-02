import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5091/api';

function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      nameid:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload.nameid,
      email:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        payload.email,
      role:
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role,
      Department: payload.Department,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('etms_token');
    return isTokenValid(token) ? decodeToken(token) : null;
  });

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token } = res.data;
    localStorage.setItem('etms_token', token);
    const decoded = decodeToken(token);
    setUser(decoded);
    return decoded;
  };

  const register = async (data) => {
    await axios.post(`${API}/auth/register`, data);
  };

  const logout = () => {
    localStorage.removeItem('etms_token');
    setUser(null);
  };

  const isManager = user?.role === 'Manager' || user?.role === 'Admin';
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isManager, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
