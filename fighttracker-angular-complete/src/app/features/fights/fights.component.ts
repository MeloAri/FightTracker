import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FightService } from '../../core/services/fight.service';
import { Fight, Page, CATEGORIES } from '../../shared/models';

@Component({
  selector: 'app-fights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Lutas</h1>
          <p class="page-subtitle">Histórico de confrontos sincronizados automaticamente</p>
        </div>
      </div>

      <!-- Category pills -->
      <div class="pill-group">
        <button class="pill" [class.active]="activeCategory() === ''"
                (click)="setCategory('')">Todas</button>
        @for (cat of categories; track cat) {
          <button class="pill" [class.active]="activeCategory() === cat"
                  (click)="setCategory(cat)">{{ cat }}</button>
        }
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      } @else if (!page() || page()!.content.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🥊</div>
          <div class="empty-title">Nenhuma luta encontrada</div>
          <div class="empty-sub">As lutas são sincronizadas automaticamente da TheSportsDB a cada 6h. Aguarde o próximo ciclo ou reinicie o servidor para forçar a sincronização.</div>
        </div>
      } @else {
        <!-- Table desktop -->
        <div class="card" style="padding:0;overflow:hidden;margin-bottom:1.25rem;">
          <table class="ft-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Confronto</th>
                <th>Evento</th>
                <th>Local</th>
                <th>Modalidade</th>
              </tr>
            </thead>
            <tbody>
              @for (f of page()!.content; track f.id) {
                <tr>
                  <td>
                    <div class="condensed" style="font-weight:800;font-size:1.1rem;">{{ getDay(f.eventDate) }}</div>
                    <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;">{{ getMonth(f.eventDate) }} {{ getYear(f.eventDate) }}</div>
                  </td>
                  <td>
                    <div class="condensed uppercase" style="font-weight:700;font-size:1rem;letter-spacing:.5px;">
                      {{ f.fighter1 }} <span class="muted" style="font-weight:400;">vs.</span> {{ f.fighter2 }}
                    </div>
                  </td>
                  <td><div style="font-size:13px;">{{ f.eventName }}</div></td>
                  <td><div class="muted" style="font-size:12px;">{{ f.location || '—' }}</div></td>
                  <td><span class="tag {{ getCategoryTag(f.category) }}">{{ f.category || 'MMA' }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Cards mobile -->
        <div class="fight-list-mobile">
          @for (f of page()!.content; track f.id) {
            <div class="fight-item">
              <div class="fight-date">
                <div class="day">{{ getDay(f.eventDate) }}</div>
                <div class="month">{{ getMonth(f.eventDate) }}</div>
              </div>
              <div class="divider-v" style="height:40px;margin:0 4px;"></div>
              <div class="fight-body">
                <div class="matchup">{{ f.fighter1 }} vs. {{ f.fighter2 }}</div>
                <div class="meta">{{ f.eventName }}</div>
              </div>
              <span class="tag {{ getCategoryTag(f.category) }}">{{ f.category || 'MMA' }}</span>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (page()!.totalPages > 1) {
          <div style="display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:1rem;">
            <button class="btn btn-ghost btn-sm" [disabled]="page()!.first" (click)="loadPage(currentPage() - 1)">← Anterior</button>
            <span class="muted" style="font-size:13px;">Página {{ currentPage() + 1 }} de {{ page()!.totalPages }} · {{ page()!.totalElements }} lutas</span>
            <button class="btn btn-ghost btn-sm" [disabled]="page()!.last" (click)="loadPage(currentPage() + 1)">Próxima →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .fight-list-mobile { display:none; flex-direction:column; gap:.75rem; }
    @media(max-width:640px) { .ft-table { display:none; } .fight-list-mobile { display:flex; } }
  `]
})
export class FightsComponent implements OnInit {
  readonly categories = CATEGORIES;
  page = signal<Page<Fight> | null>(null);
  loading = signal(true);
  currentPage = signal(0);
  activeCategory = signal('');

  constructor(private fightService: FightService) {}

  ngOnInit() { this.loadPage(0); }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
    this.loadPage(0);
  }

  loadPage(p: number) {
    this.loading.set(true);
    const cat = this.activeCategory();
    const obs = cat
      ? this.fightService.getByCategory(cat, p, 10)
      : this.fightService.getAll(p, 10);
    obs.subscribe({
      next: data => { this.page.set(data); this.currentPage.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getCategoryTag(cat: string) {
    const m: Record<string,string> = {
      'MMA':'tag-mma','Boxe':'tag-box','Jiu-Jitsu':'tag-jj',
      'Muay Thai':'tag-mt','Wrestling':'tag-wres','Kickboxing':'tag-kick','Judô':'tag-judo'
    };
    return m[cat] ?? 'tag-mma';
  }

  getDay(d: string)   { return d ? new Date(d).getDate().toString().padStart(2,'0') : '--'; }
  getMonth(d: string) { return d ? new Date(d).toLocaleString('pt-BR',{month:'short'}).toUpperCase() : '---'; }
  getYear(d: string)  { return d ? new Date(d).getFullYear() : ''; }
}
