import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { profileService, avatarColor } from '../services/api';

export default function Profile() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({ phoneNumber: '', dateOfJoining: '', address: '', emergencyContact: '', skills: '' });

  const load = () => {
    profileService.get().then((r) => {
      setProfile(r.data);
      patchForm(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const patchForm = (p) => setForm({
    phoneNumber:      p.phoneNumber      ?? '',
    dateOfJoining:    p.dateOfJoining ? p.dateOfJoining.split('T')[0] : '',
    address:          p.address          ?? '',
    emergencyContact: p.emergencyContact ?? '',
    skills:           p.skills           ?? '',
  });

  const save = async () => {
    setSaving(true);
    try {
      await profileService.update(form);
      toast.show('Profile updated!', 'success');
      setEditing(false);
      load();
    } catch { toast.show('Failed to update profile.', 'error'); }
    finally { setSaving(false); }
  };

  const cancel = () => { if (profile) patchForm(profile); setEditing(false); };

  const getInitials = () => profile ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() : '?';
  const getAvatarColor = () => avatarColor(profile?.firstName ?? '');
  const skillsList = (profile?.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton" style={{ height: 200, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      {/* Hero Card */}
      <div className="card profile-hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className={`avatar avatar-xl ${getAvatarColor()}`}>{getInitials()}</div>
          <div className="hero-info">
            <h2 className="hero-name">{profile.firstName} {profile.lastName}</h2>
            <div className="hero-meta">
              <span className="badge badge-info">{profile.department}</span>
              <span className="badge badge-default">{profile.role}</span>
            </div>
            <p className="hero-email">{profile.email}</p>
          </div>
          {!editing && (
            <button className="btn btn-secondary edit-toggle" onClick={() => setEditing(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="profile-grid">
          {/* Personal Info */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">Personal Information</h3></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{profile.phoneNumber || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Joining</span>
                  <span className="info-value">
                    {profile.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Contact</span>
                  <span className="info-value">{profile.emergencyContact || '—'}</span>
                </div>
                <div className="info-item" style={{ gridColumn: '1/-1' }}>
                  <span className="info-label">Address</span>
                  <span className="info-value">{profile.address || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">Skills</h3></div>
            <div className="card-body">
              {skillsList.length > 0 ? (
                <div className="skills-container">
                  {skillsList.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                </div>
              ) : (
                <p className="text-muted text-sm">No skills added yet. Edit your profile to add skills.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header"><h3 className="card-title">Edit Profile</h3></div>
          <div className="card-body">
            <div className="edit-grid">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" placeholder="+91 98765 43210" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining</label>
                <input type="date" className="form-control" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input type="text" className="form-control" placeholder="Name & number" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows={2} placeholder="Your full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Skills <span className="form-hint">(comma-separated, e.g. React, C#, SQL)</span></label>
                <input type="text" className="form-control" placeholder="React, C#, SQL Server..." value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? <span className="spinner" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
