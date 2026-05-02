import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5091/api';

const api = axios.create({ baseURL: BASE });

// Inject JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('etms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('etms_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Task Service ─────────────────────────────────────────
export const taskService = {
  getAll:              ()           => api.get('/taskassignment'),
  getById:             (id)         => api.get(`/taskassignment/${id}`),
  create:              (dto)        => api.post('/taskassignment', dto),
  update:              (id, dto)    => api.put(`/taskassignment/${id}`, dto),
  review:              (id, dto)    => api.put(`/taskassignment/${id}/review`, dto),
  previewPerformance:  (dto)        => api.post('/taskassignment/performance/preview', dto),
  publishPerformance:  (dto)        => api.post('/taskassignment/performance/publish', dto),
  getMyPerformance:    ()           => api.get('/taskassignment/performance/my'),
};

// ─── Employee Service ─────────────────────────────────────
export const employeeService = {
  getAll:            ()           => api.get('/employee'),
  getDashboard:      ()           => api.get('/employee/GetDahboardDetails'),
  markAttendance:    (dto)        => api.post('/employee/UpdateAttendance', dto),
  getAttendance:     ()           => api.get('/employee/UpdateAttendance'),
  getLeaveRequests:  ()           => api.get('/employee/LeaveRequests'),
  submitLeave:       (dto)        => api.post('/employee/LeaveRequest', dto),
  updateLeaveStatus: (id, status) => api.put(`/employee/LeaveRequest/${id}`, { status }),
};

// ─── Profile Service ──────────────────────────────────────
export const profileService = {
  get:    ()    => api.get('/profile'),
  update: (dto) => api.put('/profile', dto),
};

// ─── Lookup Service ───────────────────────────────────────
export const lookupService = {
  getUsers:       () => api.get('/user/GetAllUsers'),
  getDepartments: () => api.get('/lookup/departments'),
  getRoles:       () => api.get('/lookup/roles'),
};

// ─── Auth Service ─────────────────────────────────────────
export const authService = {
  login:    (dto) => api.post('/auth/login', dto),
  register: (dto) => api.post('/auth/register', dto),
};

// ─── Helpers ──────────────────────────────────────────────
export const TASK_STATUS = {
  0: { label: 'Pending',     cls: 'badge-warning' },
  1: { label: 'In Progress', cls: 'badge-info'    },
  2: { label: 'Submitted',   cls: 'badge-brand'   },
  3: { label: 'Reviewed',    cls: 'badge-success' },
};

export const LEAVE_STATUS_CLASS = {
  Pending:  'badge-warning',
  Approved: 'badge-success',
  Rejected: 'badge-danger',
};

export const ATTENDANCE_STATUS_CLASS = {
  Present:  'badge-success',
  Absent:   'badge-danger',
  Late:     'badge-warning',
  Leave:    'badge-info',
  'On Leave': 'badge-info',
};

const AVATAR_COLORS = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
export const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || 'avatar-blue';
export const initials = (name = '') => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '?';

export default api;
