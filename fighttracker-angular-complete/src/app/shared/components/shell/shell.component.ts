import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FollowService } from '../../../core/services/follow.service';
import { FREE_FOLLOW_LIMIT } from '../../models';

interface NavItem { path: string; label: string; icon: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="shell">
      <!-- SIDEBAR -->
      <aside class="sidebar" [class.collapsed]="collapsed()">
        <div class="sidebar-logo">
          <div class="logo-hex"></div>
          @if (!collapsed()) {
            <span class="logo-text">Fight<span class="accent">Tracker</span></span>
          }
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.path) {
            <a class="nav-item" [routerLink]="item.path" routerLinkActive="active"
               [title]="collapsed() ? item.label : ''">
              <span class="nav-icon">{{ item.icon }}</span>
              @if (!collapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- Follow limit bar -->
        @if (!collapsed()) {
          <div class="follow-limit-bar">
            <div class="limit-header">
              <span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">
                Seguindo
              </span>
              <span style="font-size:12px;font-weight:600;">
                {{ followService.followCount() }}/{{ LIMIT }}
              </span>
            </div>
            <div class="progress-bar" style="margin-top:6px;">
              <div class="fill" [style.width.%]="limitPct()"
                   [class.fill-green]="limitPct() < 100"></div>
            </div>
          </div>
        }

        <div class="sidebar-user">
          <div class="avatar avatar-sm" [style.background]="'rgba(232,69,60,.2)'"
               [style.color]="'var(--accent)'">
            {{ auth.userInitials() }}
          </div>
          @if (!collapsed()) {
            <div class="user-info">
              <div class="user-email truncate" style="font-size:12px;font-weight:600;max-width:130px;">
                {{ auth.userEmail() }}
              </div>
              <div class="muted" style="font-size:11px;">Plano Gratuito</div>
            </div>
          }
          <button class="btn-logout" (click)="auth.logout()" title="Sair">⏏</button>
        </div>
      </aside>

      <!-- MAIN -->
      <div class="shell-main">
        <!-- TOPBAR -->
        <header class="topbar">
          <button class="btn btn-icon btn-ghost" (click)="collapsed.set(!collapsed())"
                  style="border:none;">
            {{ collapsed() ? '→' : '☰' }}
          </button>

          <div class="topbar-spacer"></div>

          <button class="btn btn-icon btn-ghost hide-mobile" style="border:none;" title="Notificações">
            🔔
            @if (followService.followCount() > 0) {
              <span class="notif-dot">{{ followService.followCount() }}</span>
            }
          </button>

          <button class="btn btn-sm btn-ghost hide-mobile"
                  style="gap:6px;" (click)="auth.logout()">
            ⏏ Sair
          </button>
        </header>

        <!-- PAGE CONTENT -->
        <main class="shell-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell {
      display: flex; height: 100vh; overflow: hidden;
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 220px; min-width: 220px; background: var(--dark);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      transition: width .25s ease, min-width .25s ease;
      overflow: hidden;

      &.collapsed { width: 60px; min-width: 60px; }
    }

    .sidebar-logo {
      display: flex; align-items: center; gap: 10px;
      padding: 1rem 1.1rem; border-bottom: 1px solid var(--border);
      flex-shrink: 0; height: 56px;
    }
    .logo-hex {
      width: 30px; height: 30px; flex-shrink: 0; background: var(--accent);
      clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
    }
    .logo-text {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
      font-size: 18px; white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1; padding: .5rem 0; overflow-y: auto;
    }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 14px; color: var(--muted);
      transition: all .15s; border-radius: 0; cursor: pointer;
      text-decoration: none; white-space: nowrap;

      &:hover { background: var(--surface2); color: var(--text); }
      &.active { background: rgba(232,69,60,.1); color: var(--text);
                 border-right: 2px solid var(--accent); }
      &.active .nav-icon { color: var(--accent); }
    }
    .nav-icon  { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
    .nav-label { font-size: 14px; font-weight: 500; }

    .follow-limit-bar {
      padding: .75rem 1rem; border-top: 1px solid var(--border);
    }
    .limit-header { display: flex; justify-content: space-between; align-items: center; }

    .sidebar-user {
      padding: .9rem 1rem; border-top: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    .user-info { flex: 1; min-width: 0; }
    .btn-logout {
      background: none; border: none; color: var(--muted);
      cursor: pointer; font-size: 16px; flex-shrink: 0; transition: color .2s;
      &:hover { color: var(--accent); }
    }

    /* ── MAIN ── */
    .shell-main {
      flex: 1; display: flex; flex-direction: column; overflow: hidden;
    }

    .topbar {
      height: 56px; background: var(--dark); border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 1.25rem; gap: .75rem;
      flex-shrink: 0; position: relative;
    }
    .topbar-spacer { flex: 1; }
    .notif-dot {
      position: absolute; top: -2px; right: -2px;
      background: var(--accent); color: #fff; font-size: 9px; font-weight: 700;
      width: 14px; height: 14px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }

    .shell-content {
      flex: 1; overflow-y: auto; padding: 1.75rem 2rem;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .shell-content { padding: 1rem; }
    }
  `]
})
export class ShellComponent implements OnInit {
  readonly LIMIT = FREE_FOLLOW_LIMIT;
  collapsed = signal(false);

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard',  icon: '⚡' },
    { path: '/following', label: 'Seguindo',   icon: '👤' },
    { path: '/fighters',  label: 'Explorar',   icon: '🔍' },
    { path: '/fights',    label: 'Lutas',      icon: '🥊' },
    { path: '/events',    label: 'Eventos',    icon: '📅' },
  ];

  limitPct = () => Math.round((this.followService.followCount() / this.LIMIT) * 100);

  constructor(
    public auth: AuthService,
    public followService: FollowService
  ) {}

  ngOnInit() {
    this.followService.loadFollows().subscribe();
  }
}
