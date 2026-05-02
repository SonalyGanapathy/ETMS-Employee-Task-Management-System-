import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, LookupService, ToastService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { PerformanceSummary, UserOption } from '../../core/models/models';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.scss'
})
export class PerformanceComponent implements OnInit {
  summaries  = signal<PerformanceSummary[]>([]);
  users      = signal<UserOption[]>([]);
  loading    = signal(true);
  publishing = signal(false);
  preview    = signal<{ averageScore: number; taskCount: number } | null>(null);

  publishForm = { employeeUserId: '', year: new Date().getFullYear(), month: null as number|null, week: null as number|null, managerComment: '' };
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(public auth: AuthService, private taskSvc: TaskService, private lookup: LookupService, private toast: ToastService) {}

  ngOnInit() {
    this.taskSvc.getMyPerformance().subscribe({ next: s => { this.summaries.set(s); this.loading.set(false); }, error: () => this.loading.set(false) });
    if (this.auth.isManager) this.lookup.getUsers().subscribe({ next: u => this.users.set(u) });
  }

  previewPerformance() {
    if (!this.publishForm.employeeUserId) { this.toast.show('Select an employee.', 'error'); return; }
    this.taskSvc.previewPerformance(this.publishForm).subscribe({ next: r => this.preview.set(r), error: () => this.toast.show('Preview failed.', 'error') });
  }

  publish() {
    if (!this.preview()) { this.toast.show('Preview first.', 'warning'); return; }
    this.publishing.set(true);
    this.taskSvc.publishPerformance(this.publishForm).subscribe({
      next: () => { this.publishing.set(false); this.preview.set(null); this.toast.show('Performance published!', 'success'); this.taskSvc.getMyPerformance().subscribe({ next: s => this.summaries.set(s) }); },
      error: (e) => { this.publishing.set(false); this.toast.show(e.error?.message || 'Publish failed.', 'error'); }
    });
  }

  scoreColor(score: number): string {
    if (score >= 4) return 'var(--success)';
    if (score >= 3) return 'var(--warning)';
    return 'var(--danger)';
  }

  starArray = (n: number) => Array(5).fill(0).map((_,i) => i < Math.round(n));
}
