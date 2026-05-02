import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, ToastService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { LeaveRequest, LEAVE_STATUS_CLASS } from '../../core/models/models';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent implements OnInit {
  leaves = signal<LeaveRequest[]>([]);
  loading = signal(true);
  showModal = signal(false);
  saving = signal(false);
  statusClass = LEAVE_STATUS_CLASS;

  form = { fromDate: '', toDate: '', reason: '' };

  constructor(public auth: AuthService, private svc: EmployeeService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getLeaveRequests().subscribe({ next: l => { this.leaves.set(l); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  submit() {
    if (!this.form.fromDate || !this.form.toDate || !this.form.reason) {
      this.toast.show('All fields are required.', 'error'); return;
    }
    this.saving.set(true);
    this.svc.submitLeave(this.form).subscribe({
      next: () => { this.saving.set(false); this.showModal.set(false); this.load(); this.toast.show('Leave request submitted!', 'success'); this.form = { fromDate:'', toDate:'', reason:'' }; },
      error: () => { this.saving.set(false); this.toast.show('Failed to submit leave.', 'error'); }
    });
  }

  updateStatus(id: string, status: number) {
    this.svc.updateLeaveStatus(id, status).subscribe({
      next: () => { this.load(); this.toast.show(status === 2 ? 'Leave approved!' : 'Leave rejected.', status === 2 ? 'success' : 'warning'); },
      error: () => this.toast.show('Failed to update status.', 'error')
    });
  }

  daysBetween(from: string, to: string): number {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.ceil(diff / (1000*60*60*24)) + 1);
  }
}
