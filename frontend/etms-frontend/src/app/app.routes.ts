import { Routes } from '@angular/router';
import { authGuard, publicGuard, managerGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        path: 'employees',
        canActivate: [managerGuard],
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'leave',
        loadComponent: () => import('./features/leave/leave.component').then(m => m.LeaveComponent)
      },
      {
        path: 'performance',
        loadComponent: () => import('./features/performance/performance.component').then(m => m.PerformanceComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
