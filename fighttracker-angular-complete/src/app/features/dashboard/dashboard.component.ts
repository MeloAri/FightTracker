import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FollowService } from '../../core/services/follow.service';
import { EventService } from '../../core/services/event.service';
import { FightService } from '../../core/services/fight.service';
import { Fight, FightEvent, FREE_FOLLOW_LIMIT } from '../../shared/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fade-up">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Olá, {{ firstName() }} 👋</h1>
          <p class="page-subtitle">Sua visão geral de lutas e lutadores</p>
        </div>
        @if (followService.followCount() < LIMIT) {
          <a routerLink="/fighters" class="btn btn-primary">
            + Adicionar lutador
          </a>
        }
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Lutadores seguidos</div>
          <div class="stat-value" style="color:var(--accent)">
            {{ followService.followCount() }}
          </div>
          <div class="stat-sub">de {{ LIMIT }} no plano grátis</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Próximas lutas</div>
          <div class="stat-value" style="color:var(--blue)">{{ upcomingFights().length }}</div>
          <div class="stat-sub">dos seus lutadores</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Eventos confirmados</div>
          <div class="stat-value" style="color:var(--gold)">{{ events().length }}</div>
          <div class="stat-sub">próximos eventos</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Plano atual</div>
          <div class="stat-value" style="font-size:1.4rem;color:var(--green)">Grátis</div>
          <div class="stat-sub"><a routerLink="/upgrade" style="color:var(--accent)">Fazer upgrade →</a></div>
        </div>
      </div>

      <!-- Limit bar -->
      @if (followService.followCount() > 0) {
        <div class="card card-sm" style="margin-bottom:1.75rem;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
            <span class="muted">Slots de lutadores utilizados</span>
            <strong>{{ followService.followCount() }}/{{ LIMIT }}</strong>
          </div>
          <div class="progress-bar">
            <div class="fill" [style.width.%]="limitPct()"
                 [class.fill-green]="limitPct() < 100"></div>
          </div>
        </div>
      }

      <!-- Followed fighters chips -->
      @if (followService.follows().length > 0) {
        <p class="section-label">Lutadores que você segue</p>
        <div class="fighters-chips">
          @for (f of followService.follows(); track f.id) {
            <div class="fighter-chip">
              <div class="avatar avatar-sm"
                   [style.background]="getAvatarBg(f.fighterName)"
                   [style.color]="getAvatarColor(f.fighterName)">
                {{ initials(f.fighterName) }}
              </div>
              <span style="font-size:13px;font-weight:600;">{{ f.fighterName }}</span>
            </div>
          }
          @if (followService.followCount() < LIMIT) {
            <a routerLink="/fighters" class="fighter-chip fighter-chip-add">
              <span style="font-size:18px;color:var(--accent)">+</span>
              <span class="muted" style="font-size:13px;">Adicionar</span>
            </a>
          }
        </div>
      }

      <!-- Upcoming fights -->
      <p class="section-label" style="margin-top:1.75rem;">Próximas lutas</p>

      @if (loadingFights()) {
        <div class="loading-overlay" style="padding:2rem;">
          <div class="spinner"></div>
        </div>
      } @else if (upcomingFights().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🥊</div>
          <div class="empty-title">Nenhuma luta agendada</div>
          <div class="empty-sub">
            Siga lutadores para ver as próximas lutas aqui
          </div>
          <a routerLink="/fighters" class="btn btn-primary" style="margin-top:1rem;">
            Explorar lutadores
          </a>
        </div>
      } @else {
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          @for (f of upcomingFights(); track f.id) {
            <div class="fight-item">
              <div class="fight-date">
                <div class="day">{{ getDay(f.eventDate) }}</div>
                <div class="month">{{ getMonth(f.eventDate) }}</div>
              </div>
              <div class="divider-v" style="height:40px;margin:0 4px;"></div>
              <div class="fight-body">
                <div class="matchup">{{ f.fighter1 }} vs. {{ f.fighter2 }}</div>
                <div class="meta">📍 {{ f.eventName }}</div>
              </div>
              <div class="fight-right">
                <span class="tag tag-mma">MMA</span>
              </div>
            </div>
          }
        </div>
      }

      <!-- Upcoming events -->
      @if (events().length > 0) {
        <p class="section-label" style="margin-top:1.75rem;">Próximos eventos</p>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          @for (ev of events().slice(0,3); track ev.id) {
            <div class="fight-item">
              <div class="fight-date">
                <div class="day">{{ getDay(ev.date) }}</div>
                <div class="month">{{ getMonth(ev.date) }}</div>
              </div>
              <div class="divider-v" style="height:40px;margin:0 4px;"></div>
              <div class="fight-body">
                <div class="matchup">{{ ev.name }}</div>
                <div class="meta">📍 {{ ev.location }}</div>
              </div>
              <span class="status-badge soon">Em breve</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .fighters-chips {
      display: flex; flex-wrap: wrap; gap: .6rem; margin-bottom: .5rem;
    }
    .fighter-chip {
      display: flex; align-items: center; gap: 8px;
      background: var(--surface); border: 1px solid var(--border2);
      border-radius: var(--r2); padding: 8px 14px;
      transition: border-color .2s;
      &:hover { border-color: rgba(232,69,60,.4); }
    }
    .fighter-chip-add {
      border-style: dashed; cursor: pointer; text-decoration: none;
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly LIMIT = FREE_FOLLOW_LIMIT;

  upcomingFights = signal<Fight[]>([]);
  events = signal<FightEvent[]>([]);
  loadingFights = signal(true);

  limitPct = () => Math.round((this.followService.followCount() / this.LIMIT) * 100);
  firstName = () => this.auth.userEmail().split('@')[0];

  private avatarColors = [
    ['rgba(232,69,60,.2)', 'var(--accent)'],
    ['rgba(59,143,232,.2)', 'var(--blue)'],
    ['rgba(245,166,35,.2)', 'var(--gold)'],
    ['rgba(20,184,166,.2)', 'var(--teal)'],
    ['rgba(167,139,250,.2)', 'var(--purple)'],
    ['rgba(34,197,94,.2)', 'var(--green)'],
  ];

  constructor(
    public followService: FollowService,
    private fightService: FightService,
    private eventService: EventService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadFights();
    this.loadEvents();
  }

  loadFights() {
    this.fightService.getAll(0, 5).subscribe({
      next: p => { this.upcomingFights.set(p.content ?? []); this.loadingFights.set(false); },
      error: () => this.loadingFights.set(false)
    });
  }

  loadEvents() {
    this.eventService.getUpcoming().subscribe({
      next: ev => this.events.set(ev),
      error: () => {}
    });
  }

  initials(name: string) {
    return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  }
  getAvatarBg(name: string)    { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length][0]; }
  getAvatarColor(name: string) { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length][1]; }
  getDay(d: string)   { return new Date(d).getDate().toString().padStart(2,'0'); }
  getMonth(d: string) { return new Date(d).toLocaleString('pt-BR',{month:'short'}).toUpperCase(); }
}
