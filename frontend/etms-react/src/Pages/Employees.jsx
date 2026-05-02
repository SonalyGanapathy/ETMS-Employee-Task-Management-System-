import React, { useEffect, useState, useMemo } from 'react';
import { employeeService, avatarColor, initials } from '../services/api';

export default function Employees() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  useEffect(() => {
    employeeService.getAll().then((r) => { setEmployees(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = employees;
    const q = search.toLowerCase();
    if (q) list = list.filter((e) => `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q));
    if (deptFilter) list = list.filter((e) => e.department === deptFilter);
    return list;
  }, [employees, search, deptFilter]);

  const empInitials = (e) => `${e.firstName?.[0] ?? ''}${e.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage team members in your department.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper" style={{ flex: 1, maxWidth: 300 }}>
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input className="form-control" type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 140 }} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Depts</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        <span className="result-count">{filtered.length} employees</span>
      </div>

      <div className="card">
        {loading && (
          <div className="loading-rows">
            {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 56, margin: '4px 0' }} />)}
          </div>
        )}
        {!loading && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Employee</th><th>Department</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">◎</div><h4>No employees found</h4></div></td></tr>
                ) : filtered.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={`avatar avatar-md ${avatarColor(e.firstName)}`}>{empInitials(e)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{e.firstName} {e.lastName}</div>
                          <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{e.employeeCode || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{e.department}</span></td>
                    <td><span className="badge badge-default">{e.role}</span></td>
                    <td className="text-muted">{e.email}</td>
                    <td className="text-muted">{e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'}</td>
                    <td><span className={`badge ${e.isActive ? 'badge-success' : 'badge-danger'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
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
