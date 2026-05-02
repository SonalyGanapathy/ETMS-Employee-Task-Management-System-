import { Component, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string; icon: string; route: string;
  roles?: string[]; badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: '⬡', route: '/dashboard' },
    { label: 'Tasks',        icon: '✦', route: '/tasks' },
    { label: 'Employees',    icon: '◎', route: '/employees', roles: ['Admin','Manager'] },
    { label: 'Attendance',   icon: '◷', route: '/attendance' },
    { label: 'Leave',        icon: '◈', route: '/leave' },
    { label: 'Performance',  icon: '◆', route: '/performance' },
    { label: 'My Profile',   icon: '◉', route: '/profile' },
  ];

  constructor(public auth: AuthService) {}

  visibleItems = computed(() =>
    this.navItems.filter(item =>
      !item.roles || item.roles.includes(this.auth.role)
    )
  );

  toggle() { this.collapsed.update(v => !v); }

  get initials(): string {
    const u = this.auth.currentUser();
    if (!u) return '?';
    const parts = u.email.split('@')[0].split('.');
    return parts.map((p: string) => p[0]?.toUpperCase() ?? '').join('').slice(0, 2);
  }

  get avatarColor(): string {
    const colors = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
    return colors[this.auth.userEmail?.charCodeAt(0) % colors.length];
  }
  get email(): string { return this.auth.userEmail; }
  get role(): string  { return this.auth.role; }
}
