import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Employee' },
];
const DEPARTMENTS = [
  { id: 1, name: 'IT' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'Finance' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    roleId: 3, departmentId: 1,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = regForm;
    if (!firstName || !lastName || !email || !password) { setError('All fields are required.'); return; }
    setLoading(true); setError('');
    try {
      const selectedRole = ROLES.find((r) => r.id === +regForm.roleId);
      const selectedDept = DEPARTMENTS.find((d) => d.id === +regForm.departmentId);
      await register({
        ...regForm,
        roleId: +regForm.roleId, role: selectedRole?.name ?? 'Employee',
        departmentId: +regForm.departmentId, department: selectedDept?.name ?? 'IT',
      });
      toast.show('Account created! Please log in.', 'success');
      setMode('login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left hero */}
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-logo">ET</div>
          <h1>Employee Task<br />Management System</h1>
          <p>Streamline your workforce. Track tasks, manage attendance, and monitor performance — all in one place.</p>
          <div className="hero-features">
            <div className="feature-item"><span className="feature-icon">✦</span><span>Real-time task tracking</span></div>
            <div className="feature-item"><span className="feature-icon">◷</span><span>Attendance &amp; leave management</span></div>
            <div className="feature-item"><span className="feature-icon">◆</span><span>Performance analytics</span></div>
          </div>
          <div className="hero-dots"><span /><span /><span /></div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="form-container">
          <div className="auth-tabs">
            <button className={`tab-btn${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            <button className={`tab-btn${mode === 'register' ? ' active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Create Account</button>
          </div>

          {error && <div className="error-banner"><span>⚠</span> {error}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input type="email" className="form-control" placeholder="you@company.com"
                    value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPass ? 'text' : 'password'} className="form-control"
                    placeholder="Enter your password"
                    value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass((v) => !v)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" placeholder="John"
                    value={regForm.firstName} onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Doe"
                    value={regForm.lastName} onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="you@company.com"
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Create a strong password"
                  value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={regForm.roleId} onChange={(e) => setRegForm({ ...regForm, roleId: +e.target.value })}>
                    {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={regForm.departmentId} onChange={(e) => setRegForm({ ...regForm, departmentId: +e.target.value })}>
                    {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
