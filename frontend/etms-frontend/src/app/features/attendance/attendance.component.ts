import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, ToastService } from '../../core/services/api.service';
import { ATTENDANCE_STATUS_CLASS } from '../../core/models/models';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
  records = signal<any[]>([]);
  loading = signal(true);
  marking = signal(false);
  todayRecord = signal<any>(null);
  selectedStatus = signal(1);
  statusClass = ATTENDANCE_STATUS_CLASS;

  today = new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  statuses = [
    { id: 1, label: 'Present',  icon: '✓', color: '#10b981' },
    { id: 2, label: 'Absent',   icon: '✕', color: '#ef4444' },
    { id: 3, label: 'Late',     icon: '⏰', color: '#f59e0b' },
    { id: 4, label: 'On Leave', icon: '🌿', color: '#6366f1' },
  ];

  constructor(private svc: EmployeeService, private toast: ToastService) {}

  ngOnInit() {
    this.svc.getAttendance().subscribe({
      next: r => { this.records.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  markAttendance() {
    this.marking.set(true);
    const payload = { statusId: this.selectedStatus(), status: this.selectedStatus(), createdAt: new Date(), updatedAt: new Date() };
    this.svc.markAttendance(payload).subscribe({
      next: (res) => {
        this.marking.set(false);
        this.todayRecord.set(res);
        this.toast.show('Attendance marked successfully!', 'success');
        this.svc.getAttendance().subscribe({ next: r => this.records.set(r) });
      },
      error: () => { this.marking.set(false); this.toast.show('Failed to mark attendance.', 'error'); }
    });
  }

  statusLabel(s: string): string {
    return this.statuses.find(x => x.label.replace(' ','') === s.replace(' ',''))?.label ?? s;
  }
  statusBadge(s: string): string {
    return this.statusClass[s] ?? 'badge-default';
  }
}
