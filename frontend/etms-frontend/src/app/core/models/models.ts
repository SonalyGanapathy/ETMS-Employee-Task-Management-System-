export interface LoginRequest  { email: string; password: string; }
export interface RegisterRequest {
  firstName: string; lastName: string; email: string; password: string;
  roleId: number; role: string; departmentId: number; department: string;
}
export interface AuthResponse { token: string; }

export interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
  Department: string;
  exp: number;
}

export interface Employee {
  id: string; userId: string; employeeCode: string;
  firstName: string; lastName: string; email: string;
  departmentId: number; department: string;
  roleId: number; role: string;
  isActive: boolean; createdAt: string;
  phoneNumber?: string; dateOfJoining?: string;
  address?: string; emergencyContact?: string; skills?: string;
}

export interface TaskAssignment {
  id: string; taskName: string; status: number; comment: string;
  assignedToUserId: string; assignedToUserName: string;
  assignedByUserId: string; assignedByUserName: string;
  timeTaken: number; createdDate: string;
  reviewComment?: string; reviewMarks?: number;
}

export interface TaskCreateDto {
  taskName: string; status: number; comment: string;
  assignedToUserId: string; timeTaken: number;
}

export interface UpdateEmployeeProfileDto {
  phoneNumber?: string;
  dateOfJoining?: string;
  address?: string;
  emergencyContact?: string;
  skills?: string;
}

export interface TaskUpdateDto extends TaskCreateDto { }

export interface LeaveRequest {
  id: string; employeeCode: string; employeeName: string;
  department: string; role: string;
  fromDate: string; toDate: string; reason: string; status: string;
}

export interface LeaveRequestDto {
  fromDate: string; toDate: string; reason: string;
}

export interface Attendance {
  id: string; employeeCode: string; attendanceDate: string;
  status: string; checkInTime?: string; remarks?: string;
}

export interface PerformanceSummary {
  id: string; employeeUserId: string;
  year: number; month?: number; week?: number;
  averageScore: number; managerComment?: string;
  isPublished: boolean; reviewedByUserId: string; createdAt: string;
}

export interface DashboardData {
  activeEmployees: number; presentEmployees: number;
  pendingLeaveRequests: number; employeesOnLeave: number;
}

export interface EmployeeProfileDto {
  id: string; employeeCode: string;
  firstName: string; lastName: string; email: string;
  department: string; roleId: number; role: string;
  phoneNumber?: string; dateOfJoining?: string;
  address?: string; emergencyContact?: string; skills?: string;
}

export interface UserOption { id: string; name: string; }
export interface LookupItem { id: number; name: string; }

export type TaskStatusLabel = 'Pending' | 'In Progress' | 'Submitted' | 'Reviewed';
export const TASK_STATUS: Record<number, { label: TaskStatusLabel; class: string }> = {
  0: { label: 'Pending',     class: 'badge-warning' },
  1: { label: 'In Progress', class: 'badge-info'    },
  2: { label: 'Submitted',   class: 'badge-brand'   },
  3: { label: 'Reviewed',    class: 'badge-success' },
};

export const LEAVE_STATUS_CLASS: Record<string, string> = {
  Pending:  'badge-warning',
  Approved: 'badge-success',
  Rejected: 'badge-danger',
};

export const ATTENDANCE_STATUS_CLASS: Record<string, string> = {
  Present: 'badge-success',
  Absent:  'badge-danger',
  Late:    'badge-warning',
  Leave:   'badge-info',
};
