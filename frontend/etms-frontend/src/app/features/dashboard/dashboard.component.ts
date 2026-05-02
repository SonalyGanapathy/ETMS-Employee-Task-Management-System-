import { Component, OnInit, signal } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService, TaskService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskAssignment, TASK_STATUS, Employee } from '../../core/models/models';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DecimalPipe,TitleCasePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = signal(true);

  // Stats
  stats = signal({ activeEmployees: 0, presentEmployees: 0, pendingLeaveRequests: 0, employeesOnLeave: 0 });

  // Recent tasks
  recentTasks = signal<TaskAssignment[]>([]);
  taskStatus = TASK_STATUS;

  // Task summary counts
  taskCounts = signal({ pending: 0, inProgress: 0, submitted: 0, reviewed: 0, total: 0 });

  greeting = '';

  constructor(
    public auth: AuthService,
    private empService: EmployeeService,
    private taskService: TaskService
  ) {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }

  ngOnInit() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.recentTasks.set(tasks.slice(0, 6));
        this.taskCounts.set({
          pending:   tasks.filter(t => t.status === 0).length,
          inProgress:tasks.filter(t => t.status === 1).length,
          submitted: tasks.filter(t => t.status === 2).length,
          reviewed:  tasks.filter(t => t.status === 3).length,
          total: tasks.length,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    if (this.auth.isManager) {
      this.empService.getDashboard().subscribe({
        next: (data) => { if (data?.length) this.stats.set(data[0] as any); }
      });
    }
  }

  get firstName(): string {
    return this.auth.userEmail.split('@')[0].split('.')[0];
  }

  statusPercent(count: number): number {
    const total = this.taskCounts().total;
    return total ? Math.round((count / total) * 100) : 0;
  }

  avatarColors = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
  avatarColor(name: string): string {
    return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length];
  }
  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  }
}
