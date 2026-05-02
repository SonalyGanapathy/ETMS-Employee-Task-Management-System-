import { Component, OnInit, signal } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, ToastService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeProfileDto } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile = signal<EmployeeProfileDto | null>(null);
  loading = signal(true);
  editing = signal(false);
  saving  = signal(false);

  form = { phoneNumber: '', dateOfJoining: '', address: '', emergencyContact: '', skills: '' };

  constructor(public auth: AuthService, private svc: ProfileService, private toast: ToastService) {}

  ngOnInit() {
    this.svc.get().subscribe({ next: p => { this.profile.set(p); this.patchForm(p); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  patchForm(p: EmployeeProfileDto) {
    this.form = {
      phoneNumber: p.phoneNumber ?? '',
      dateOfJoining: p.dateOfJoining ? p.dateOfJoining.split('T')[0] : '',
      address: p.address ?? '',
      emergencyContact: p.emergencyContact ?? '',
      skills: p.skills ?? '',
    };
  }

  save() {
    this.saving.set(true);
    this.svc.update(this.form).subscribe({
      next: () => { this.saving.set(false); this.editing.set(false); this.toast.show('Profile updated!', 'success'); this.svc.get().subscribe({ next: p => this.profile.set(p) }); },
      error: () => { this.saving.set(false); this.toast.show('Failed to update profile.', 'error'); }
    });
  }

  cancel() { if (this.profile()) this.patchForm(this.profile()!); this.editing.set(false); }

  get initials(): string {
    const p = this.profile();
    if (!p) return '?';
    return `${p.firstName[0] ?? ''}${p.lastName[0] ?? ''}`.toUpperCase();
  }

  get avatarColor(): string {
    const colors = ['avatar-blue','avatar-teal','avatar-violet','avatar-rose','avatar-amber','avatar-sky'];
    return colors[(this.profile()?.firstName?.charCodeAt(0) ?? 0) % colors.length];
  }

  get skillsList(): string[] {
    return this.profile()?.skills?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  }
}
