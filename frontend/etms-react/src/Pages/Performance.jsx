import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { taskService, lookupService } from '../services/api';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS  = Array.from({ length: 5  }, (_, i) => new Date().getFullYear() - i);

function scoreColor(score) {
  if (score >= 4) return 'var(--success)';
  if (score >= 3) return 'var(--warning)';
  return 'var(--danger)';
}

function StarRow({ score }) {
  return (
    <div className="perf-stars">
      {Array(5).fill(0).map((_, i) => (
        <span key={i} className={`star${i < Math.round(score) ? ' filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function Performance() {
  const { isManager } = useAuth();
  const toast = useToast();

  const [summaries,  setSummaries]  = useState([]);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [preview,    setPreview]    = useState(null);

  const [pForm, setPForm] = useState({
    employeeUserId: '', year: new Date().getFullYear(),
    month: '', managerComment: '',
  });

  useEffect(() => {
    taskService.getMyPerformance().then((r) => { setSummaries(r.data); setLoading(false); }).catch(() => setLoading(false));
    if (isManager) lookupService.getUsers().then((r) => setUsers(r.data)).catch(() => {});
  }, [isManager]);

  const previewPerformance = async () => {
    if (!pForm.employeeUserId) { toast.show('Select an employee.', 'error'); return; }
    try {
      const res = await taskService.previewPerformance({ ...pForm, month: pForm.month || null });
      setPreview(res.data);
    } catch { toast.show('Preview failed.', 'error'); }
  };

  const publish = async () => {
    if (!preview) { toast.show('Preview first.', 'warning'); return; }
    setPublishing(true);
    try {
      await taskService.publishPerformance({ ...pForm, month: pForm.month || null });
      toast.show('Performance published!', 'success');
      setPreview(null);
      const res = await taskService.getMyPerformance();
      setSummaries(res.data);
    } catch (e) { toast.show(e.response?.data?.message || 'Publish failed.', 'error'); }
    finally { setPublishing(false); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance</h1>
          <p className="page-subtitle">Track and publish employee performance reviews.</p>
        </div>
      </div>

      {/* Manager: Publish Panel */}
      {isManager && (
        <div className="card publish-card">
          <div className="card-header"><h3 className="card-title">Publish Performance Review</h3></div>
          <div className="card-body">
            <div className="publish-grid">
              <div className="form-group">
                <label className="form-label">Employee *</label>
                <select className="form-control" value={pForm.employeeUserId} onChange={(e) => setPForm({ ...pForm, employeeUserId: e.target.value })}>
                  <option value="">Select employee...</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select className="form-control" value={pForm.year} onChange={(e) => setPForm({ ...pForm, year: +e.target.value })}>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Month (optional)</label>
                <select className="form-control" value={pForm.month} onChange={(e) => setPForm({ ...pForm, month: e.target.value })}>
                  <option value="">All year</option>
                  {MONTHS.map((m) => <option key={m} value={m}>Month {m}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Manager Comment</label>
              <textarea className="form-control" rows={3} placeholder="Add a comment for the employee..." value={pForm.managerComment} onChange={(e) => setPForm({ ...pForm, managerComment: e.target.value })} />
            </div>

            {preview && (
              <div className="preview-box">
                <div className="preview-stat">
                  <span className="preview-num" style={{ color: scoreColor(preview.averageScore) }}>{preview.averageScore?.toFixed(1)}</span>
                  <span className="preview-label">Average Score (out of 5)</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-num">{preview.taskCount}</span>
                  <span className="preview-label">Reviewed Tasks</span>
                </div>
                <div className="stars-preview">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className={`star${i < Math.round(preview.averageScore) ? ' filled' : ''}`}>★</span>
                  ))}
                </div>
              </div>
            )}

            <div className="publish-actions">
              <button className="btn btn-secondary" onClick={previewPerformance}>Preview</button>
              <button className="btn btn-primary" onClick={publish} disabled={publishing || !preview}>
                {publishing ? <span className="spinner" /> : 'Publish Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance History */}
      <div className="card" style={{ marginTop: isManager ? 24 : 0 }}>
        <div className="card-header"><h3 className="card-title">My Performance History</h3></div>
        {loading && (
          <div className="loading-rows">
            {[1,2].map((i) => <div key={i} className="skeleton" style={{ height: 80, margin: '4px 0' }} />)}
          </div>
        )}
        {!loading && summaries.length === 0 && (
          <div className="empty-state"><div className="empty-icon">◆</div><h4>No performance reviews yet</h4><p>Your published performance reviews will appear here.</p></div>
        )}
        {!loading && summaries.length > 0 && (
          <div className="performance-list">
            {summaries.map((s) => (
              <div className="perf-item" key={s.id}>
                <div className="perf-left">
                  <div className="score-ring" style={{ '--score-color': scoreColor(s.averageScore) }}>
                    <span className="score-value">{s.averageScore?.toFixed(1)}</span>
                    <span className="score-max">/5</span>
                  </div>
                </div>
                <div className="perf-body">
                  <div className="perf-period">
                    {s.year}{s.month ? ` · Month ${s.month}` : ''}{s.week ? ` · Week ${s.week}` : ''}
                  </div>
                  <StarRow score={s.averageScore} />
                  {s.managerComment && <div className="perf-comment">{s.managerComment}</div>}
                </div>
                <div className="perf-right">
                  <span className="perf-date text-muted text-sm">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
