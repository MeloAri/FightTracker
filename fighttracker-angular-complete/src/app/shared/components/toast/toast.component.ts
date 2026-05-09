import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }} slide-in">
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <div class="toast-body">
            <div class="toast-title">{{ toast.title }}</div>
            @if (toast.message) {
              <div class="toast-msg">{{ toast.message }}</div>
            }
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      z-index: 9999; display: flex; flex-direction: column; gap: .6rem;
    }
    .toast {
      display: flex; align-items: flex-start; gap: 12px;
      background: var(--surface2); border: 1px solid var(--border2);
      border-radius: var(--r2); padding: 12px 16px;
      min-width: 280px; max-width: 360px;
      box-shadow: 0 8px 32px rgba(0,0,0,.5);
    }
    .toast-success { border-left: 3px solid var(--green); }
    .toast-error   { border-left: 3px solid var(--accent); }
    .toast-warning { border-left: 3px solid var(--gold); }
    .toast-info    { border-left: 3px solid var(--blue); }
    .toast-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
    .toast-body { flex: 1; }
    .toast-title { font-size: 13px; font-weight: 600; }
    .toast-msg   { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
    .toast-close {
      background: none; border: none; color: var(--muted);
      cursor: pointer; font-size: 20px; line-height: 1; padding: 0; flex-shrink: 0;
      &:hover { color: var(--text); }
    }
  `]
})
export class ToastComponent {
  icons = { success: '✅', error: '❌', warning: '⚠️', info: '💬' };
  constructor(public toastService: ToastService) {}
}
