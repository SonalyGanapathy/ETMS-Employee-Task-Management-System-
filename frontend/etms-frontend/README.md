# ETMS Frontend — Angular 19

A professional, production-grade Angular frontend for the Employee Task Management System.

## Tech Stack
- **Angular 19** (Standalone components, Signals)
- **SCSS** with CSS custom properties (design tokens)
- **Font**: Plus Jakarta Sans (Google Fonts)
- **No external UI library** — pure custom design system

## Design System
- Dark sidebar (`#0f172a`) + clean light content area (`#f1f5f9`)
- Primary accent: Sky blue (`#0ea5e9`)
- Typography: Plus Jakarta Sans
- Fully responsive

## Features
| Page | Description |
|------|-------------|
| Login / Register | Auth with JWT, BCrypt, role selection |
| Dashboard | Stats cards, task overview, quick actions |
| Tasks | Full CRUD — assign, edit, update status, review with star rating |
| Employees | Team list with role/dept filtering (Manager/Admin only) |
| Attendance | Mark attendance with visual selector, history table |
| Leave | Apply for leave, Manager approve/reject |
| Performance | Publish reviews, view history with score rings |
| Profile | View & edit personal info, skills tags |

## Setup

### 1. Install dependencies
```bash
cd etms-ui   # (or the folder you place this)
npm install
```

### 2. Set your API URL
Edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'  // ← Your .NET API URL
};
```

### 3. Run
```bash
ng serve
# Open http://localhost:4200
```

### 4. Build for production
```bash
ng build
```

## Project Structure
```
src/
  app/
    core/
      models/         — TypeScript interfaces & constants
      services/       — API services (tasks, employees, leave, etc.)
      interceptors/   — JWT auth interceptor (auto-attaches token)
      guards/         — authGuard, publicGuard, managerGuard
    shared/
      layout/         — Main shell layout
      sidebar/        — Collapsible sidebar with role-based nav
    features/
      auth/login/     — Login & register page
      dashboard/      — Dashboard with stats + task overview
      tasks/          — Task list, create/edit modal, review modal
      employees/      — Employee directory
      attendance/     — Mark & view attendance
      leave/          — Submit & manage leave requests
      performance/    — Publish & view performance reviews
      profile/        — View & edit personal profile
  environments/       — API URL config
  styles.scss         — Global design system (tokens, utilities)
```

## Notes
- All components are **standalone** (Angular 19 pattern)
- Uses **Signals** for reactive state
- JWT is stored in `localStorage` and auto-attached via interceptor
- Route guards protect private routes and manager-only pages
