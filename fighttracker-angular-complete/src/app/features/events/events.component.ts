import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { ToastService } from '../../core/services/toast.service';
import { FightEvent, CATEGORIES, MANUAL_CATEGORIES } from '../../shared/models';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-up">

      <div class="page-header">
        <div>
          <h1 class="page-title">Eventos</h1>
          <p class="page-subtitle">MMA e Boxe via ESPN · Outras modalidades via cadastro manual</p>
        </div>
        <div style="display:flex;gap:.6rem;align-items:center;">
          <button class="btn btn-ghost btn-sm btn-icon" (click)="load()" [disabled]="loading()" title="Atualizar">
            @if (loading()) { <div class="spinner spinner-sm"></div> } @else { 🔄 }
          </button>
          <button class="btn btn-primary" (click)="showCreate = !showCreate">
            {{ showCreate ? '✕ Cancelar' : '+ Cadastrar evento' }}
          </button>
        </div>
      </div>

      <div class="sync-bar">
        <span class="live-dot"></span>
        <span>
          <strong>MMA</strong> e <strong>Boxe</strong> sincronizados da
          <strong style="color:var(--accent)">ESPN/TheSportsDB</strong> automaticamente.
          Para <strong>Jiu-Jitsu, Muay Thai</strong> e outras modalidades, cadastre abaixo.
        </span>
      </div>

      @if (showCreate) {
        <div class="card" style="margin-bottom:1.5rem;">
          <p class="section-label">Cadastrar evento manual</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="field" style="margin:0;"><label>Nome do evento</label>
              <input [(ngModel)]="form.name" placeholder="ADCC 2026..." /></div>
            <div class="field" style="margin:0;"><label>Modalidade</label>
              <select [(ngModel)]="form.category">
                @for (c of manualCategories; track c) { <option [value]="c">{{ c }}</option> }
              </select>
            </div>
            <div class="field" style="margin:0;"><label>Local</label>
              <input [(ngModel)]="form.location" placeholder="São Paulo, Brasil" /></div>
            <div class="field" style="margin:0;"><label>Data e hora</label>
              <input type="datetime-local" [(ngModel)]="form.date" /></div>
          </div>
          <div style="display:flex;gap:.75rem;margin-top:1rem;">
            <button class="btn btn-primary" [disabled]="creating()" (click)="createEvent()">
              @if (creating()) { <div class="spinner spinner-sm spinner-white"></div> Salvando... }
              @else { Cadastrar evento }
            </button>
            <button class="btn btn-ghost" (click)="showCreate=false">Cancelar</button>
          </div>
        </div>
      }

      <!-- Category filter pills -->
      <div class="pill-group">
        <button class="pill" [class.active]="activeCategory === ''" (click)="setCategory('')">
          Todos <span class="pill-count">{{ allEvents().length }}</span>
        </button>
        @for (cat of categories; track cat) {
          <button class="pill" [class.active]="activeCategory === cat" (click)="setCategory(cat)">
            {{ cat }}
            @if (countFor(cat) > 0) { <span class="pill-count">{{ countFor(cat) }}</span> }
          </button>
        }
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      } @else if (displayed().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <div class="empty-title">Nenhum evento encontrado</div>
          <div class="empty-sub">
            @if (activeCategory) {
              Sem eventos de {{ activeCategory }}. Cadastre um acima.
            } @else {
              Aguardando sincronização. Clique em 🔄 para atualizar.
            }
          </div>
        </div>
      } @else {
        <div class="stats-grid" style="margin-bottom:1.25rem;">
          <div class="stat-card">
            <div class="stat-label">Total</div>
            <div class="stat-value" style="color:var(--blue)">{{ displayed().length }}</div>
            <div class="stat-sub">{{ activeCategory || 'todas modalidades' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Próximo</div>
            <div class="condensed" style="font-weight:700;font-size:1rem;margin-top:.35rem;
                 white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ displayed()[0]?.name ?? '—' }}
            </div>
            <div class="stat-sub">{{ formatDate(displayed()[0]?.date) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Automáticos</div>
            <div class="stat-value" style="color:var(--green)">
              {{ allEvents().length - manualCount() }}
            </div>
            <div class="stat-sub">via ESPN / TheSportsDB</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Manuais</div>
            <div class="stat-value" style="color:var(--gold)">{{ manualCount() }}</div>
            <div class="stat-sub">cadastrados por você</div>
          </div>
        </div>

        <div class="events-grid">
          @for (ev of displayed(); track ev.id; let i = $index) {
            <div class="ev-card card" [class.ev-next]="i === 0 && !activeCategory">
              @if (i === 0 && !activeCategory) {
                <div class="next-badge">Próximo</div>
              }
              <div class="ev-top">
                <span class="tag {{ getCategoryTag(ev.category) }}">{{ ev.category }}</span>
                @if (ev.source === 'MANUAL') {
                  <span class="src-badge src-manual">✏️ Manual</span>
                } @else {
                  <span class="src-badge src-espn">📡 Auto</span>
                }
              </div>
              <div class="ev-date-row">
                <div>
                  <div class="ev-day condensed">{{ getDay(ev.date) }}</div>
                  <div class="ev-month muted">{{ getMonth(ev.date) }} {{ getYear(ev.date) }}</div>
                </div>
                <span class="status-badge soon">Confirmado</span>
              </div>
              <div class="divider" style="margin:.7rem 0;"></div>
              <h3 class="ev-name condensed uppercase">{{ ev.name }}</h3>
              <p class="ev-info muted">📍 {{ ev.location }}</p>
              <p class="ev-info muted">🕐 {{ getTime(ev.date) }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .sync-bar { display:flex;align-items:center;gap:12px;background:rgba(59,143,232,.06);
      border:1px solid rgba(59,143,232,.18);border-radius:var(--r2);padding:.85rem 1.1rem;
      margin-bottom:1.25rem;font-size:13px;color:var(--muted);line-height:1.5; }
    .live-dot { width:8px;height:8px;min-width:8px;border-radius:50%;background:var(--green);
      animation:pulse 1.5s ease infinite; }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
    .pill-count { background:var(--surface2);font-size:10px;padding:1px 6px;
      border-radius:99px;margin-left:3px; }
    .events-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem; }
    .ev-card { position:relative;display:flex;flex-direction:column;gap:.45rem;
      transition:transform .15s,border-color .2s; &:hover{transform:translateY(-2px);} }
    .ev-next { border-color:rgba(232,69,60,.45);
      background:linear-gradient(150deg,rgba(232,69,60,.07) 0%,var(--surface) 100%); }
    .next-badge { position:absolute;top:-10px;left:1rem;background:var(--accent);color:#fff;
      font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;
      padding:3px 13px;border-radius:99px; }
    .ev-top { display:flex;align-items:center;justify-content:space-between; }
    .src-badge { font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px; }
    .src-espn   { background:rgba(59,143,232,.12);color:var(--blue); }
    .src-manual { background:rgba(245,166,35,.12);color:var(--gold); }
    .ev-date-row { display:flex;align-items:flex-start;justify-content:space-between;margin-top:.2rem; }
    .ev-day   { font-size:2.4rem;font-weight:800;line-height:1; }
    .ev-month { font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:2px; }
    .ev-name  { font-size:1.05rem;font-weight:700;letter-spacing:.5px;line-height:1.3; }
    .ev-info  { font-size:13px; }
  `]
})
export class EventsComponent implements OnInit {
  readonly categories = CATEGORIES;
  readonly manualCategories = MANUAL_CATEGORIES;

  allEvents  = signal<FightEvent[]>([]);
  loading    = signal(true);
  creating   = signal(false);
  showCreate = false;
  activeCategory = '';

  form = { name: '', location: '', date: '', category: 'Jiu-Jitsu' };

  // Simple getter instead of computed — avoids signal reactivity issues
  displayed(): FightEvent[] {
    if (!this.activeCategory) return this.allEvents();
    return this.allEvents().filter(
      e => (e.category ?? '').toLowerCase() === this.activeCategory.toLowerCase()
    );
  }

  manualCount(): number {
    return this.allEvents().filter(e => e.source === 'MANUAL').length;
  }

  countFor(cat: string): number {
    return this.allEvents().filter(
      e => (e.category ?? '').toLowerCase() === cat.toLowerCase()
    ).length;
  }

  constructor(private eventService: EventService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.eventService.getUpcoming().subscribe({
      next: ev => {
        console.log('[Events] Received:', ev?.length, 'events');
        this.allEvents.set(ev ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Events] Error:', err);
        this.toast.error('Erro ao carregar eventos', err?.error?.message || err?.message);
        this.loading.set(false);
      }
    });
  }

  setCategory(cat: string) { this.activeCategory = cat; }

  createEvent() {
    if (!this.form.name.trim() || !this.form.location.trim() || !this.form.date) {
      this.toast.warning('Preencha todos os campos'); return;
    }
    this.creating.set(true);
    this.eventService.create({
      name: this.form.name, location: this.form.location,
      date: new Date(this.form.date).toISOString(), category: this.form.category
    }).subscribe({
      next: () => {
        this.toast.success('Evento cadastrado! 📅', this.form.name);
        this.showCreate = false;
        this.form = { name:'', location:'', date:'', category:'Jiu-Jitsu' };
        this.creating.set(false); this.load();
      },
      error: (e) => { this.toast.error('Erro', e.error?.error || e.message); this.creating.set(false); }
    });
  }

  isEspnCategory = (cat: string) => ['MMA','Boxe'].includes(cat);

  getCategoryTag(cat: string) {
    const m: Record<string,string> = { 'MMA':'tag-mma','Boxe':'tag-box','Jiu-Jitsu':'tag-jj',
      'Muay Thai':'tag-mt','Wrestling':'tag-wres','Kickboxing':'tag-kick','Judô':'tag-judo' };
    return m[cat] ?? 'tag-default';
  }

  formatDate(d?: string) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}); }
    catch { return d; }
  }
  getDay(d: string)   { try { return new Date(d).getDate().toString().padStart(2,'0'); } catch { return '--'; } }
  getMonth(d: string) { try { return new Date(d).toLocaleString('pt-BR',{month:'short'}).toUpperCase(); } catch { return '---'; } }
  getYear(d: string)  { try { return new Date(d).getFullYear(); } catch { return ''; } }
  getTime(d: string)  { try { return new Date(d).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); } catch { return '--:--'; } }
}
