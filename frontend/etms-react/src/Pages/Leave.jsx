import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { employeeService, LEAVE_STATUS_CLASS } from '../services/api';

const EMPTY_FORM = { fromDate: '', toDate: '', reason: '' };

function daysBetween(from, to) {
  if (!from || !to) return 0;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Leave() {
  const { isManager } = useAuth();
  const toast = useToast();

  const [leaves, setLeaves]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setModal]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);

  const load = () => {
    setLoading(true);
    employeeService.getLeaveRequests().then((r) => { setLeaves(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason) { toast.show('All fields are required.', 'error'); return; }
    setSaving(true);
    try {
      await employeeService.submitLeave(form);
      toast.show('Leave request submitted!', 'success');
      setModal(false); setForm(EMPTY_FORM); load();
    } catch { toast.show('Failed to submit leave.', 'error'); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await employeeService.updateLeaveStatus(id, status);
      toast.show(status === 2 ? 'Leave approved!' : 'Leave rejected.', status === 2 ? 'success' : 'warning');
      load();
    } catch { toast.show('Failed to update status.', 'error'); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Requests</h1>
          <p className="page-subtitle">Submit and manage leave requests for your team.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Apply for Leave
        </button>
      </div>

      <div className="card">
        {loading && (
          <div className="loading-rows">
            {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 60, margin: '4px 0' }} />)}
          </div>
        )}
        {!loading && leaves.length === 0 && (
          <div className="empty-state"><div className="empty-icon">◈</div><h4>No leave requests</h4><p>Leave requests will appear here once submitted.</p></div>
        )}
        {!loading && leaves.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th><th>Department</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{l.employeeName}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{l.role}</div>
                    </td>
                    <td><span className="badge badge-info">{l.department}</span></td>
                    <td className="fw-600">{fmtDate(l.fromDate)}</td>
                    <td className="fw-600">{fmtDate(l.toDate)}</td>
                    <td><span className="days-chip">{daysBetween(l.fromDate, l.toDate)}d</span></td>
                    <td className="text-muted reason-cell">{l.reason}</td>
                    <td><span className={`badge ${LEAVE_STATUS_CLASS[l.status] ?? 'badge-default'}`}>{l.status}</span></td>
                    {isManager && (
                      <td>
                        {l.status === 'Pending' ? (
                          <div className="action-btns">
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(l.id, 2)}>Approve</button>
                            <button className="btn btn-danger btn-sm"  onClick={() => updateStatus(l.id, 3)}>Reject</button>
                          </div>
                        ) : <span className="text-muted text-sm">—</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">From Date *</label>
                  <input type="date" className="form-control" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">To Date *</label>
                  <input type="date" className="form-control" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reason *</label>
                <textarea className="form-control" rows={4} placeholder="Explain your reason for leave..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </div>
              {form.fromDate && form.toDate && (
                <div className="duration-preview">
                  <span>Duration:</span>
                  <strong>{daysBetween(form.fromDate, form.toDate)} day(s)</strong>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit} disabled={saving}>
                {saving ? <span className="spinner" /> : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
