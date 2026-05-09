import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card fade-up">
        <div class="auth-logo">
          <div class="logo-hex"></div>
          <span class="logo-text condensed">Fight<span class="accent">Tracker</span></span>
        </div>

        <h1 class="auth-title condensed uppercase">Entrar</h1>
        <p class="muted" style="text-align:center;font-size:14px;margin-bottom:1.75rem;">
          Acesse sua conta para continuar
        </p>

        @if (error) {
          <div class="alert-error">{{ error }}</div>
        }

        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" [(ngModel)]="email"
                   placeholder="seu@email.com" required autocomplete="email" />
          </div>
          <div class="field">
            <label for="password">Senha</label>
            <input id="password" type="password" name="password" [(ngModel)]="password"
                   placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button class="btn btn-primary btn-full btn-lg" type="submit" [disabled]="loading">
            @if (loading) { <div class="spinner spinner-sm spinner-white"></div> Entrando... }
            @else { Entrar }
          </button>
        </form>

        <p class="auth-switch">
          Não tem conta?
          <a routerLink="/auth/register" class="accent" style="font-weight:600;">Criar conta grátis</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: radial-gradient(ellipse 70% 50% at 50% -5%, rgba(232,69,60,.15), transparent);
      padding: 1.5rem;
    }
    .auth-card {
      width: 100%; max-width: 420px;
      background: var(--surface); border: 1px solid var(--border2);
      border-radius: var(--r3); padding: 2.5rem;
    }
    .auth-logo {
      display: flex; align-items: center; justify-content: center;
      gap: 10px; margin-bottom: 1.75rem;
    }
    .logo-hex {
      width: 32px; height: 32px; background: var(--accent);
      clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
    }
    .logo-text { font-size: 22px; font-weight: 800; }
    .auth-title { text-align: center; font-size: 1.75rem; font-weight: 800; margin-bottom: .35rem; }
    .alert-error {
      background: rgba(232,69,60,.1); border: 1px solid rgba(232,69,60,.25);
      color: #FF7B74; font-size: 13px; padding: 10px 14px;
      border-radius: var(--r); margin-bottom: 1.1rem;
    }
    .auth-switch {
      text-align: center; margin-top: 1.25rem; font-size: 14px; color: var(--muted);
    }
  `]
})
export class LoginComponent {
  email = ''; password = ''; loading = false; error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit() {
    if (!this.email || !this.password) return;
    this.loading = true; this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast.success('Bem-vindo de volta! 🥊');
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.error = e.error?.error || e.message || 'Credenciais inválidas';
        this.loading = false;
      }
    });
  }
}
