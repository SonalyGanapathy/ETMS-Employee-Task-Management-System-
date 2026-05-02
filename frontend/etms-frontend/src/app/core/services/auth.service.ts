import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, JwtPayload, LoginRequest, RegisterRequest } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  currentUser = signal<JwtPayload | null>(this.decodeToken(this.getToken()));

  constructor(private http: HttpClient, private router: Router) {}

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, body).pipe(
      tap(res => {
        localStorage.setItem('etms_token', res.token);
        this.currentUser.set(this.decodeToken(res.token));
      })
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<string>(`${this.api}/auth/register`, body);
  }

  logout() {
    localStorage.removeItem('etms_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('etms_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  get role(): string { return this.currentUser()?.role ?? ''; }
  get userId(): string { return this.currentUser()?.nameid ?? ''; }
  get userEmail(): string { return this.currentUser()?.email ?? ''; }
  get department(): string { return this.currentUser()?.Department ?? ''; }
  get isAdmin():   boolean { return this.role === 'Admin'; }
  get isManager(): boolean { return this.role === 'Manager' || this.isAdmin; }

  private decodeToken(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      // Normalize claim keys
      return {
        nameid: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
        email:  decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']  || decoded.email,
        role:   decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']         || decoded.role,
        Department: decoded.Department,
        exp: decoded.exp,
      };
    } catch { return null; }
  }
}
