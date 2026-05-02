import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  loading = signal(false);
  showPass = signal(false);
  error = signal('');

  // Login form
  loginForm = { email: '', password: '' };

  // Register form
  registerForm = {
    firstName: '', lastName: '', email: '', password: '',
    roleId: 3, role: 'Employee', departmentId: 1, department: 'IT'
  };

  roles = [
    { id: 1, name: 'Admin' }, { id: 2, name: 'Manager' }, { id: 3, name: 'Employee' }
  ];
  departments = [
    { id: 1, name: 'IT' }, { id: 2, name: 'HR' }, { id: 3, name: 'Finance' }
  ];

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  onLogin() {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.loginForm).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.error || 'Invalid credentials. Please try again.');
      }
    });
  }

  onRegister() {
    const f = this.registerForm;
    if (!f.firstName || !f.lastName || !f.email || !f.password) {
      this.error.set('All fields are required.'); return;
    }
    const selectedRole = this.roles.find(r => r.id === +f.roleId);
    const selectedDept = this.departments.find(d => d.id === +f.departmentId);
    this.loading.set(true);
    this.error.set('');
    this.auth.register({
      ...f,
      roleId: +f.roleId, role: selectedRole?.name ?? 'Employee',
      departmentId: +f.departmentId, department: selectedDept?.name ?? 'IT'
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.show('Account created! Please log in.', 'success');
        this.mode = 'login';
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error || 'Registration failed. Please try again.');
      }
    });
  }

  togglePassword() {
  this.showPass.update(v => !v);
}
  switchMode(m: 'login' | 'register') { this.mode = m; this.error.set(''); }
}
