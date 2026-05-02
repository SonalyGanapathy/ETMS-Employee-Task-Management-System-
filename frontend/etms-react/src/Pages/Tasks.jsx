import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { taskService, lookupService, TASK_STATUS, avatarColor, initials } from '../services/api';

const EMPTY_FORM = { taskName: '', comment: '', status: 0, assignedToUserId: '', timeTaken: 0 };
const EMPTY_REVIEW = { reviewComment: '', reviewMarks: 5 };

export default function Tasks() {
  const { user, isManager } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [tasks, setTasks]     = useState([]);
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState(-1);

  const [showModal, setShowModal]       = useState(false);
  const [showReview, setShowReview]     = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [reviewingId, setReviewingId]   = useState('');
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [reviewForm, setReviewForm]     = useState(EMPTY_REVIEW);

  const load = () => {
    setLoading(true);
    taskService.getAll().then((r) => { setTasks(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
    if (isManager) lookupService.getUsers().then((r) => setUsers(r.data)).catch(() => {});
  }, [isManager]);

  const filtered = useMemo(() => {
    let list = tasks;
    const q = search.toLowerCase();
    if (q) list = list.filter((t) => t.taskName.toLowerCase().includes(q) || t.assignedToUserName.toLowerCase().includes(q));
    if (statusFilter >= 0) list = list.filter((t) => t.status === statusFilter);
    return list;
  }, [tasks, search, statusFilter]);

  const openCreate = () => { setEditingTask(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (t)  => { setEditingTask(t); setForm({ taskName: t.taskName, comment: t.comment, status: t.status, assignedToUserId: t.assignedToUserId, timeTaken: t.timeTaken }); setShowModal(true); };
  const openReview = (t)  => { setReviewingId(t.id); setReviewForm({ reviewComment: t.reviewComment || '', reviewMarks: t.reviewMarks || 5 }); setShowReview(true); };

  const save = async () => {
    if (!form.taskName || (!isManager ? false : !form.assignedToUserId)) {
      if (!form.taskName) { toast.show('Task name is required.', 'error'); return; }
    }
    if (isManager && !form.assignedToUserId) { toast.show('Please select an assignee.', 'error'); return; }
    setSaving(true);
    try {
      if (editingTask) await taskService.update(editingTask.id, form);
      else             await taskService.create(form);
      toast.show(editingTask ? 'Task updated!' : 'Task created!', 'success');
      setShowModal(false); load();
    } catch { toast.show('Failed to save task.', 'error'); }
    finally { setSaving(false); }
  };

  const submitReview = async () => {
    if (reviewForm.reviewMarks < 1 || reviewForm.reviewMarks > 5) { toast.show('Marks must be between 1 and 5.', 'error'); return; }
    setSaving(true);
    try {
      await taskService.review(reviewingId, reviewForm);
      toast.show('Review submitted!', 'success');
      setShowReview(false); load();
    } catch (e) { toast.show(e.response?.data || 'Review failed.', 'error'); }
    finally { setSaving(false); }
  };

  const canEdit   = (t) => isManager || t.assignedToUserId === user?.nameid;
  const canReview = (t) => isManager && t.status === 2;
  const starArray = (n) => Array(5).fill(0).map((_, i) => i < n);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and track task assignments across your team.</p>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Assign Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper" style={{ flex: 1, maxWidth: 320 }}>
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" className="form-control" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 160 }} value={statusFilter} onChange={(e) => setStatusFilter(+e.target.value)}>
          <option value={-1}>All Status</option>
          {[0,1,2,3].map((s) => <option key={s} value={s}>{TASK_STATUS[s]?.label}</option>)}
        </select>
        <span className="result-count">{filtered.length} tasks</span>
      </div>

      {/* Table */}
      <div className="card">
        {loading && <div className="loading-rows">{[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ height: 52, margin: '6px 0' }} />)}</div>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">✦</div><h4>No tasks found</h4><p>Try adjusting your filters or assign a new task.</p></div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Task</th><th>Assigned To</th><th>Assigned By</th><th>Status</th><th>Time</th><th>Score</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="task-cell">
                        <span className="fw-600 text-dark">{t.taskName}</span>
                        {t.comment && <span className="text-muted text-sm">{t.comment}</span>}
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
                    <td>
                      {t.reviewMarks ? (
                        <div className="stars">
                          {starArray(t.reviewMarks).map((f, i) => <span key={i} className={`star${f ? ' filled' : ''}`}>★</span>)}
                          <span className="score-num">{t.reviewMarks}/5</span>
                        </div>
                      ) : <span className="text-muted text-sm">—</span>}
                    </td>
                    <td>
                      <div className="action-btns">
                        {canEdit(t) && (
                          <button className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => openEdit(t)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        )}
                        {canReview(t) && <button className="btn btn-primary btn-sm" onClick={() => openReview(t)}>Review</button>}
                        {t.reviewMarks && t.reviewComment ? <span className="reviewed-chip">✓ Reviewed</span> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Assign New Task'}</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Task Name *</label>
                <input type="text" className="form-control" placeholder="Enter task name..." value={form.taskName} onChange={(e) => setForm({ ...form, taskName: e.target.value })} />
              </div>
              {isManager && (
                <div className="form-group">
                  <label className="form-label">Assign To *</label>
                  <select className="form-control" value={form.assignedToUserId} onChange={(e) => setForm({ ...form, assignedToUserId: e.target.value })}>
                    <option value="">Select employee...</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: +e.target.value })}>
                  {[0,1,2,3].map((s) => <option key={s} value={s}>{TASK_STATUS[s]?.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-control" rows={3} placeholder="Optional comment..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Taken (hours)</label>
                <input type="number" className="form-control" min={0} step={0.5} value={form.timeTaken} onChange={(e) => setForm({ ...form, timeTaken: +e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? <span className="spinner" /> : editingTask ? 'Update Task' : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="modal-backdrop" onClick={() => setShowReview(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Task</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowReview(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Score (1–5)</label>
                <div className="star-picker">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" className={`star-btn${reviewForm.reviewMarks >= n ? ' active' : ''}`} onClick={() => setReviewForm({ ...reviewForm, reviewMarks: n })}>★</button>
                  ))}
                  <span className="star-label">{reviewForm.reviewMarks}/5</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea className="form-control" rows={4} placeholder="Write your review..." value={reviewForm.reviewComment} onChange={(e) => setReviewForm({ ...reviewForm, reviewComment: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReview(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitReview} disabled={saving}>
                {saving ? <span className="spinner" /> : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
