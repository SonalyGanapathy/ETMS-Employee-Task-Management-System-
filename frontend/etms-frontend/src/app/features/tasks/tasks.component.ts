import { Component, OnInit, signal, computed } from '@angular/core';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, LookupService, ToastService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskAssignment, TASK_STATUS, UserOption } from '../../core/models/models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, TitleCasePipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  loading = signal(true);
  tasks = signal<TaskAssignment[]>([]);
  users = signal<UserOption[]>([]);
  showModal = signal(false);
  showReviewModal = signal(false);
  editingTask = signal<TaskAssignment | null>(null);
  searchTerm = signal('');
  statusFilter = signal(-1);
  taskStatus = TASK_STATUS;

  form = { taskName: '', comment: '', status: 0, assignedToUserId: '', timeTaken: 0 };
  reviewForm = { reviewComment: '', reviewMarks: 5 };
  reviewingTaskId = '';
  saving = signal(false);

  constructor(
    public auth: AuthService,
    private taskSvc: TaskService,
    private lookupSvc: LookupService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
    if (this.auth.isManager) {
      this.lookupSvc.getUsers().subscribe({ next: u => this.users.set(u) });
    }
  }

  load() {
    this.loading.set(true);
    this.taskSvc.getAll().subscribe({ next: t => { this.tasks.set(t); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  filtered = computed(() => {
    let list = this.tasks();
    const q = this.searchTerm().toLowerCase();
    if (q) list = list.filter(t => t.taskName.toLowerCase().includes(q) || t.assignedToUserName.toLowerCase().includes(q));
    if (this.statusFilter() >= 0) list = list.filter(t => t.status === this.statusFilter());
    return list;
  });

  openCreate() {
    this.editingTask.set(null);
    this.form = { taskName: '', comment: '', status: 0, assignedToUserId: '', timeTaken: 0 };
    this.showModal.set(true);
  }

  openEdit(task: TaskAssignment) {
    this.editingTask.set(task);
    this.form = { taskName: task.taskName, comment: task.comment, status: task.status, assignedToUserId: task.assignedToUserId, timeTaken: task.timeTaken };
    this.showModal.set(true);
  }

  openReview(task: TaskAssignment) {
    this.reviewingTaskId = task.id;
    this.reviewForm = { reviewComment: task.reviewComment || '', reviewMarks: task.reviewMarks || 5 };
    this.showReviewModal.set(true);
  }

  closeModal() { this.showModal.set(false); }
  closeReviewModal() { this.showReviewModal.set(false); }

  save() {
    if (!this.form.taskName || !this.form.assignedToUserId) {
      this.toast.show('Task name and assignee are required.', 'error'); return;
    }
    this.saving.set(true);
    const editing = this.editingTask();
    const obs = editing
      ? this.taskSvc.update(editing.id, this.form)
      : this.taskSvc.create(this.form);
    obs.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); this.toast.show(editing ? 'Task updated!' : 'Task created!', 'success'); },
      error: () => { this.saving.set(false); this.toast.show('Failed to save task.', 'error'); }
    });
  }

  submitReview() {
    if (!this.reviewForm.reviewMarks || this.reviewForm.reviewMarks < 1 || this.reviewForm.reviewMarks > 5) {
      this.toast.show('Marks must be between 1 and 5.', 'error'); return;
    }
    this.saving.set(true);
    this.taskSvc.review(this.reviewingTaskId, this.reviewForm).subscribe({
      next: () => { this.saving.set(false); this.closeReviewModal(); this.load(); this.toast.show('Review submitted!', 'success'); },
      error: (e) => { this.saving.set(false); this.toast.show(e.error || 'Review failed.', 'error'); }
    });
  }

  canReview(task: TaskAssignment): boolean { return this.auth.isManager && task.status === 2; }
  canEdit(task: TaskAssignment): boolean   { return this.auth.isManager || task.assignedToUserId === this.auth.userId; }

  statusOptions = [0,1,2,3];
  markOptions = [1,2,3,4,5];

  avatarColors = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
  avatarColor = (n: string) => this.avatarColors[n?.charCodeAt(0) % this.avatarColors.length] ?? 'avatar-blue';
  initials    = (n: string) => n?.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() ?? '?';
  starArray   = (n: number) => Array(5).fill(0).map((_,i) => i < n);
}
