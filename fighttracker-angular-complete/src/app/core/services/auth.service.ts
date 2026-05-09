import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'ft_token';
  private readonly EMAIL_KEY = 'ft_email';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _email = signal<string | null>(localStorage.getItem(this.EMAIL_KEY));

  readonly isLoggedIn = computed(() => !!this._token());
  readonly userEmail  = computed(() => this._email() ?? '');
  readonly userInitials = computed(() => {
    const e = this._email() ?? '';
    return e.split('@')[0].slice(0, 2).toUpperCase();
  });

  constructor(private http: HttpClient, private router: Router) {}

  // POST /auth/register
  register(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, req)
      .pipe(tap(res => this.saveSession(res.token, req.email)));
  }

  // POST /auth/login
  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, req)
      .pipe(tap(res => this.saveSession(res.token, req.email)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    this._token.set(null);
    this._email.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  private saveSession(token: string, email: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
    this._token.set(token);
    this._email.set(email);
  }
}
