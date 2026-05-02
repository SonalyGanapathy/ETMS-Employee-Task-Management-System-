import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { taskService, employeeService, TASK_STATUS, avatarColor, initials } from '../services/api';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const { user, isManager } = useAuth();
  const [loading, setLoading]       = useState(true);
  const [recentTasks, setRecent]    = useState([]);
  const [taskCounts, setCounts]     = useState({ pending: 0, inProgress: 0, submitted: 0, reviewed: 0, total: 0 });
  const [stats, setStats]           = useState({ activeEmployees: 0, presentEmployees: 0, pendingLeaveRequests: 0, employeesOnLeave: 0 });

  const firstName = (user?.email || '').split('@')[0].split('.')[0];

  useEffect(() => {
    taskService.getAll().then((res) => {
      const tasks = res.data;
      setRecent(tasks.slice(0, 6));
      setCounts({
        pending:    tasks.filter((t) => t.status === 0).length,
        inProgress: tasks.filter((t) => t.status === 1).length,
        submitted:  tasks.filter((t) => t.status === 2).length,
        reviewed:   tasks.filter((t) => t.status === 3).length,
        total: tasks.length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));

    if (isManager) {
      employeeService.getDashboard().then((res) => {
        if (res.data?.length) setStats(res.data[0]);
      }).catch(() => {});
    }
  }, [isManager]);

  const pct = (count) => taskCounts.total ? Math.round((count / taskCounts.total) * 100) : 0;

  const STAT_DOT_COLOR = { 0: 'var(--warning)', 1: 'var(--info)', 2: 'var(--brand-500)', 3: 'var(--success)' };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="greeting-label">{greeting()},</p>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{firstName} 👋</h1>
          <p className="page-subtitle">Here's what's happening across your team today.</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </Link>
        </div>
      </div>

      {/* Manager Stats */}
      {isManager && (
        <div className="stats-grid">
          {[
            { label: 'Active Employees', value: stats.activeEmployees, cls: 'stat-icon--blue', trend: '+2 this month', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>, icon2: <><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
            { label: 'Present Today',    value: stats.presentEmployees,    cls: 'stat-icon--green',  trend: 'On-time attendance', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
            { label: 'Pending Leaves',   value: stats.pendingLeaveRequests, cls: 'stat-icon--amber', trend: 'Needs approval', icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
            { label: 'On Leave Today',   value: stats.employeesOnLeave,    cls: 'stat-icon--red',   trend: 'Approved leaves', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon ${s.cls}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{s.icon}{s.icon2}</svg>
              </div>
              <div className="stat-body">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
              <div className="stat-trend trend-up">{s.trend}</div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Task Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Overview</h3>
            <Link to="/tasks" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="card-body">
            <div className="task-totals">
              <div className="total-number">{taskCounts.total}</div>
              <div className="total-label">Total Tasks</div>
            </div>
            <div className="status-bars">
              {[
                { label: 'Pending',     count: taskCounts.pending,    dot: 'dot-warning', fill: 'fill-warning' },
                { label: 'In Progress', count: taskCounts.inProgress, dot: 'dot-info',    fill: 'fill-info'    },
                { label: 'Submitted',   count: taskCounts.submitted,  dot: 'dot-brand',   fill: 'fill-brand'   },
                { label: 'Reviewed',    count: taskCounts.reviewed,   dot: 'dot-success', fill: 'fill-success' },
              ].map((s) => (
                <div className="status-bar-item" key={s.label}>
                  <div className="status-bar-header">
                    <span className={`status-dot ${s.dot}`} />
                    <span>{s.label}</span>
                    <span className="status-count">{s.count}</span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${s.fill}`} style={{ width: `${pct(s.count)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
          <div className="card-body quick-actions">
            {[
              { to: '/attendance', cls: 'action-tile--teal',   icon: '◷', label: 'Mark Attendance', sub: "Log today's presence" },
              { to: '/leave',      cls: 'action-tile--amber',  icon: '◈', label: 'Apply Leave',     sub: 'Submit a leave request' },
              { to: '/tasks',      cls: 'action-tile--blue',   icon: '✦', label: 'My Tasks',        sub: 'View assigned tasks' },
              { to: '/performance',cls: 'action-tile--violet', icon: '◆', label: 'Performance',     sub: 'View your scores' },
            ].map((a) => (
              <Link to={a.to} key={a.to} className={`action-tile ${a.cls}`}>
                <div className="action-icon">{a.icon}</div>
                <div className="action-label">{a.label}</div>
                <div className="action-sub">{a.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card mt-24">
        <div className="card-header">
          <h3 className="card-title">Recent Tasks</h3>
          <Link to="/tasks" className="btn btn-ghost btn-sm">View all tasks →</Link>
        </div>
        {loading && (
          <div className="loading-rows">
            {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 48, margin: '4px 0' }} />)}
          </div>
        )}
        {!loading && recentTasks.length === 0 && (
          <div className="empty-state"><div className="empty-icon">✦</div><h4>No tasks yet</h4><p>Tasks assigned to you will appear here.</p></div>
        )}
        {!loading && recentTasks.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Task Name</th><th>Assigned To</th><th>Assigned By</th><th>Status</th><th>Time (hrs)</th></tr></thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="task-name-cell">
                        <span className="task-dot" style={{ background: STAT_DOT_COLOR[t.status] }} />
                        {t.taskName}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-center gap-8">
                        <div className={`avatar avatar-sm ${avatarColor(t.assignedToUserName)}`}>{initials(t.assignedToUserName)}</div>
                        {t.assignedToUserName}
                      </div>
                    </td>
                    <td className="text-muted">{t.assignedByUserName}</td>
                    <td><span className={`badge ${TASK_STATUS[t.status]?.cls}`}>{TASK_STATUS[t.status]?.label}</span></td>
                    <td className="text-muted">{t.timeTaken}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
