import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card fade-up">
        <div class="auth-logo">
          <div class="logo-hex"></div>
          <span class="logo-text condensed">Fight<span class="accent">Tracker</span></span>
        </div>

        <h1 class="auth-title condensed uppercase">Criar conta</h1>
        <p class="muted" style="text-align:center;font-size:14px;margin-bottom:1.75rem;">
          Comece gratuitamente — sem cartão de crédito
        </p>

        <div class="plan-preview">
          <div class="plan-feature">✅ Acompanhe até 3 lutadores</div>
          <div class="plan-feature">✅ Alertas de próximas lutas</div>
          <div class="plan-feature">✅ Todas as modalidades de combate</div>
        </div>

        @if (error) {
          <div class="alert-error">{{ error }}</div>
        }

        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" [(ngModel)]="email"
                   placeholder="seu@email.com" required autocomplete="email" />
          </div>
          <div class="field">
            <label>Senha</label>
            <input type="password" name="password" [(ngModel)]="password"
                   placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password" />
          </div>
          <button class="btn btn-primary btn-full btn-lg" type="submit" [disabled]="loading">
            @if (loading) { <div class="spinner spinner-sm spinner-white"></div> Criando conta... }
            @else { Criar conta grátis }
          </button>
        </form>

        <p class="auth-switch">
          Já tem conta?
          <a routerLink="/auth/login" class="accent" style="font-weight:600;">Entrar</a>
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
    .plan-preview {
      background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.15);
      border-radius: var(--r); padding: .9rem 1rem; margin-bottom: 1.5rem;
      display: flex; flex-direction: column; gap: .4rem;
    }
    .plan-feature { font-size: 13px; color: var(--text); }
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
export class RegisterComponent {
  email = ''; password = ''; loading = false; error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit() {
    if (!this.email || !this.password) return;
    this.loading = true; this.error = '';
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast.success('Conta criada! Bem-vindo ao FightTracker 🥊');
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.error = e.error?.error || e.message || 'Erro ao criar conta';
        this.loading = false;
      }
    });
  }
}
