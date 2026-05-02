import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar />
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: var(--bg-body);
    }
    .content-wrapper {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .content-wrapper { padding: 16px; }
    }
  `]
})
export class LayoutComponent {}
