// employees.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/api.service';
import { Employee } from '../../core/models/models';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  template: `
<div class="page-header">
  <div>
    <h1 class="page-title">Employees</h1>
    <p class="page-subtitle">Manage team members in your department.</p>
  </div>
</div>

<div class="filter-bar">
  <div class="search-wrapper" style="flex:1;max-width:300px">
    <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input class="form-control" type="text" placeholder="Search employees..."
           [value]="search()" (input)="search.set($any($event.target).value)" />
  </div>
  <select class="form-control" style="width:140px"
          [value]="deptFilter()" (change)="deptFilter.set($any($event.target).value)">
    <option value="">All Depts</option>
    <option value="IT">IT</option>
    <option value="HR">HR</option>
    <option value="Finance">Finance</option>
  </select>
  <span style="font-size:13px;color:var(--slate-500)">{{ filtered().length }} employees</span>
</div>

<div class="card">
  <div *ngIf="loading()" style="padding:16px;display:flex;flex-direction:column;gap:6px">
    <div class="skeleton" style="height:56px" *ngFor="let i of [1,2,3]"></div>
  </div>
  <div class="table-wrapper" *ngIf="!loading()">
    <table>
      <thead><tr>
        <th>Employee</th><th>Department</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th>
      </tr></thead>
      <tbody>
        <tr *ngFor="let e of filtered()">
          <td>
            <div style="display:flex;align-items:center;gap:12px">
              <div class="avatar avatar-md {{ avatarColor(e.firstName) }}">{{ initials(e) }}</div>
              <div>
                <div style="font-weight:600;color:var(--slate-900)">{{ e.firstName }} {{ e.lastName }}</div>
                <div style="font-size:12px;color:var(--slate-500)">{{ e.employeeCode || '—' }}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-info">{{ e.department }}</span></td>
          <td><span class="badge badge-default">{{ e.role }}</span></td>
          <td class="text-muted">{{ e.email }}</td>
          <td class="text-muted">{{ e.createdAt | date:'mediumDate' }}</td>
          <td>
            <span class="badge" [class.badge-success]="e.isActive" [class.badge-danger]="!e.isActive">
              {{ e.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
        </tr>
        <tr *ngIf="filtered().length === 0">
          <td colspan="6">
            <div class="empty-state"><div class="empty-icon">◎</div><h4>No employees found</h4></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  `,
  styles: [`.page-title{font-size:28px;font-weight:800}`]
})
export class EmployeesComponent implements OnInit {
  loading = signal(true);
  employees = signal<Employee[]>([]);
  search = signal('');
  deptFilter = signal('');

  constructor(private svc: EmployeeService) {}
  ngOnInit() { this.svc.getAll().subscribe({ next: e => { this.employees.set(e); this.loading.set(false); }, error: () => this.loading.set(false) }); }

  filtered = computed(() => {
    let list = this.employees();
    const q = this.search().toLowerCase();
    if (q) list = list.filter(e => `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q));
    if (this.deptFilter()) list = list.filter(e => e.department === this.deptFilter());
    return list;
  });

  colors = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
  avatarColor = (n: string) => this.colors[n?.charCodeAt(0) % this.colors.length] ?? 'avatar-blue';
  initials = (e: Employee) => `${e.firstName[0] ?? ''}${e.lastName[0] ?? ''}`.toUpperCase();
}
