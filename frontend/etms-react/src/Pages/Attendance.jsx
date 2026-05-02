import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { employeeService, ATTENDANCE_STATUS_CLASS } from '../services/api';

const STATUSES = [
  { id: 1, label: 'Present',  icon: '✓', color: '#10b981' },
  { id: 2, label: 'Absent',   icon: '✕', color: '#ef4444' },
  { id: 3, label: 'Late',     icon: '⏰', color: '#f59e0b' },
  { id: 4, label: 'On Leave', icon: '🌿', color: '#6366f1' },
];

export default function Attendance() {
  const toast = useToast();
  const [records, setRecords]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [marking, setMarking]         = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [selectedStatus, setSelected] = useState(1);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const loadRecords = () => {
    employeeService.getAttendance().then((r) => { setRecords(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadRecords(); }, []);

  const markAttendance = async () => {
    setMarking(true);
    try {
      const res = await employeeService.markAttendance({
        statusId: selectedStatus, status: selectedStatus,
        createdAt: new Date(), updatedAt: new Date(),
      });
      setTodayRecord(res.data);
      toast.show('Attendance marked successfully!', 'success');
      loadRecords();
    } catch { toast.show('Failed to mark attendance.', 'error'); }
    finally { setMarking(false); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">{today}</p>
        </div>
      </div>

      {/* Mark Today */}
      <div className="attendance-card card">
        <div className="card-header">
          <h3 className="card-title">Mark Today's Attendance</h3>
          <span className="today-chip">Today</span>
        </div>
        <div className="card-body">
          <p className="mark-hint">Select your attendance status for today:</p>
          <div className="status-selector">
            {STATUSES.map((s) => (
              <button
                key={s.id}
                className={`status-option${selectedStatus === s.id ? ' selected' : ''}`}
                style={{ '--accent': s.color }}
                onClick={() => setSelected(s.id)}
              >
                <span className="status-icon">{s.icon}</span>
                <span className="status-label-text">{s.label}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary mark-btn" onClick={markAttendance} disabled={marking}>
            {marking ? <span className="spinner" /> : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Mark Attendance
              </>
            )}
          </button>
          {todayRecord && (
            <div className="success-banner">
              ✓ Attendance marked as <strong>{STATUSES[todayRecord.statusId - 1]?.label}</strong>
              {todayRecord.checkInTime ? ` at ${new Date(todayRecord.checkInTime).toLocaleTimeString()}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3 className="card-title">Attendance History</h3></div>
        {loading && (
          <div className="loading-rows">
            {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 52, margin: '4px 0' }} />)}
          </div>
        )}
        {!loading && records.length === 0 && (
          <div className="empty-state"><div className="empty-icon">◷</div><h4>No attendance records</h4><p>Your attendance history will appear here.</p></div>
        )}
        {!loading && records.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Date</th><th>Status</th><th>Check-In Time</th><th>Remarks</th></tr></thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}>
                    <td className="fw-600">{r.date ? new Date(r.date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'}</td>
                    <td><span className={`badge ${ATTENDANCE_STATUS_CLASS[r.status] ?? 'badge-default'}`}>{r.status}</span></td>
                    <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
                    <td>{r.remarks || '—'}</td>
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
