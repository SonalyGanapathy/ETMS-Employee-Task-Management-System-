import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  template: `
    <router-outlet />

    <!-- Global Toast Notifications -->
    <div class="toast-container">
      <div *ngFor="let t of toast.toasts"
           class="toast toast-{{t.type}}"
           (click)="toast.remove(t.id)">
        <span>{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '⚠' }}</span>
        {{ t.message }}
      </div>
    </div>
  `,
})
export class AppComponent {
  constructor(public toast: ToastService) {}
}
