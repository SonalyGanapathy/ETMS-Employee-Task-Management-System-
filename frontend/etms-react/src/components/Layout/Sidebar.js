import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { avatarColor } from '../../services/api';

const NAV_ITEMS = [
  { label: 'Dashboard',   icon: '⬡', route: '/dashboard' },
  { label: 'Tasks',       icon: '✦', route: '/tasks' },
  { label: 'Employees',   icon: '◎', route: '/employees', managerOnly: true },
  { label: 'Attendance',  icon: '◷', route: '/attendance' },
  { label: 'Leave',       icon: '◈', route: '/leave' },
  { label: 'Performance', icon: '◆', route: '/performance' },
  { label: 'My Profile',  icon: '◉', route: '/profile' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter((item) => !item.managerOnly || isManager);

  const email = user?.email || '';
  const role  = user?.role  || '';
  const emailInitials = email
    .split('@')[0]
    .split('.')
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">ET</div>
        {!collapsed && (
          <div className="brand-text">
            <span className="brand-name">ETMS</span>
            <span className="brand-tagline">Task Management</span>
          </div>
        )}
        <button className="collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed
              ? <path d="m9 18 6-6-6-6" />
              : <path d="m15 18-6-6 6-6" />}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">MENU</div>}
        {visibleItems.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className={`user-card${collapsed ? ' compact' : ''}`}>
          <div className={`avatar avatar-md ${avatarColor(email)}`}>{emailInitials}</div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-email">{email}</span>
              <span className="user-role-badge">{role}</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
