import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  TaskAssignment, TaskCreateDto, TaskUpdateDto,
  Employee, EmployeeProfileDto, UpdateEmployeeProfileDto,
  LeaveRequest, LeaveRequestDto,
  Attendance, PerformanceSummary, DashboardData, UserOption, LookupItem
} from '../models/models';

const BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}
  getAll()           { return this.http.get<TaskAssignment[]>(`${BASE}/taskassignment`); }
  getById(id: string){ return this.http.get<TaskAssignment>(`${BASE}/taskassignment/${id}`); }
  create(dto: TaskCreateDto)          { return this.http.post<any>(`${BASE}/taskassignment`, dto); }
  update(id: string, dto: TaskUpdateDto) { return this.http.put<any>(`${BASE}/taskassignment/${id}`, dto); }
  review(id: string, dto: { reviewComment: string; reviewMarks: number }) {
    return this.http.put<any>(`${BASE}/taskassignment/${id}/review`, dto);
  }
  previewPerformance(dto: any) { return this.http.post<any>(`${BASE}/taskassignment/performance/preview`, dto); }
  publishPerformance(dto: any) { return this.http.post<any>(`${BASE}/taskassignment/performance/publish`, dto); }
  getMyPerformance()           { return this.http.get<PerformanceSummary[]>(`${BASE}/taskassignment/performance/my`); }
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}
  getAll()       { return this.http.get<Employee[]>(`${BASE}/employee`); }
  getDashboard() { return this.http.get<DashboardData[]>(`${BASE}/employee/GetDahboardDetails`); }
  markAttendance(dto: any) { return this.http.post<any>(`${BASE}/employee/UpdateAttendance`, dto); }
  getAttendance()          { return this.http.get<any[]>(`${BASE}/employee/UpdateAttendance`); }
  getLeaveRequests()       { return this.http.get<LeaveRequest[]>(`${BASE}/employee/LeaveRequests`); }
  getLeaveById(id: string) { return this.http.get<LeaveRequest>(`${BASE}/employee/LeaveRequest/${id}`); }
  submitLeave(dto: LeaveRequestDto) { return this.http.post<any>(`${BASE}/employee/LeaveRequest`, dto); }
  updateLeaveStatus(id: string, status: number) {
    return this.http.put<any>(`${BASE}/employee/LeaveRequest/${id}`, { status });
  }
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}
  get()              { return this.http.get<EmployeeProfileDto>(`${BASE}/profile`); }
  update(dto: any)   { return this.http.put<any>(`${BASE}/profile`, dto); }
}

@Injectable({ providedIn: 'root' })
export class LookupService {
  constructor(private http: HttpClient) {}
  getUsers()       { return this.http.get<UserOption[]>(`${BASE}/user/GetAllUsers`); }
  getDepartments() { return this.http.get<LookupItem[]>(`${BASE}/lookup/departments`); }
  getRoles()       { return this.http.get<LookupItem[]>(`${BASE}/lookup/roles`); }
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: { message: string; type: 'success'|'error'|'warning'; id: number }[] = [];
  private counter = 0;

  show(message: string, type: 'success'|'error'|'warning' = 'success') {
    const id = ++this.counter;
    this.toasts.push({ message, type, id });
    setTimeout(() => this.remove(id), 3500);
  }
  remove(id: number) { this.toasts = this.toasts.filter(t => t.id !== id); }
}

// // Re-export for convenience
// export interface UpdateEmployeeProfileDto {
//   phoneNumber?: string; dateOfJoining?: string; address?: string;
//   emergencyContact?: string; skills?: string;
// }
