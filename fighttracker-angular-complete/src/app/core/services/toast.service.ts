import { Injectable, signal } from '@angular/core';
import { Toast } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  private add(type: Toast['type'], title: string, message = '', duration = 4000) {
    const id = ++this.nextId;
    this.toasts.update(t => [...t, { id, type, title, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message = '') { this.add('success', title, message); }
  error(title: string, message = '')   { this.add('error',   title, message); }
  warning(title: string, message = '') { this.add('warning', title, message); }
  info(title: string, message = '')    { this.add('info',    title, message); }

  remove(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
