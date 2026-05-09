import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { FollowService } from '../../core/services/follow.service';
import { FighterService } from '../../core/services/fighter.service';
import { ToastService } from '../../core/services/toast.service';
import { Fighter, FREE_FOLLOW_LIMIT } from '../../shared/models';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Seguindo</h1>
          <p class="page-subtitle">Gerencie os lutadores que você acompanha</p>
        </div>
        <button class="btn btn-primary" (click)="showSearch = !showSearch">
          {{ showSearch ? '✕ Fechar' : '+ Adicionar lutador' }}
        </button>
      </div>

      <!-- Limit bar -->
      <div class="card card-sm" style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:8px;">
          <span class="muted">Slots utilizados no plano gratuito</span>
          <span style="font-weight:600;">
            {{ followService.followCount() }}/{{ LIMIT }}
            @if (followService.followCount() >= LIMIT) {
              <span class="tag tag-mma" style="margin-left:6px;">Limite atingido</span>
            }
          </span>
        </div>
        <div class="progress-bar">
          <div class="fill" [style.width.%]="limitPct()"
               [class.fill-green]="limitPct() < 100"></div>
        </div>
        @if (followService.followCount() >= LIMIT) {
          <p style="font-size:12px;color:var(--gold);margin-top:.6rem;">
            ⚡ Faça upgrade para o plano Pro e siga lutadores ilimitados!
          </p>
        }
      </div>

      <!-- Search panel -->
      @if (showSearch) {
        <div class="card" style="margin-bottom:1.5rem;">
          <p class="section-label">Buscar lutador para seguir</p>
          <div class="search-wrap" style="margin-bottom:1rem;">
            <span class="search-icon">🔍</span>
            <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
                   placeholder="Digite o nome do lutador..." />
            @if (searching()) { <div class="spinner spinner-sm"></div> }
          </div>

          @if (searchResults().length > 0) {
            <div style="display:flex;flex-direction:column;gap:.5rem;">
              @for (f of searchResults(); track f.id) {
                <div class="result-row">
                  <div class="avatar avatar-sm"
                       [style.background]="getAvatarBg(f.name)"
                       [style.color]="getAvatarColor(f.name)">
                    {{ initials(f.name) }}
                  </div>
                  <div style="flex:1;">
                    <div style="font-weight:600;font-size:14px;">{{ f.name }}</div>
                    <span class="tag {{ getCategoryTag(f.category) }}">{{ f.category }}</span>
                  </div>
                  <button
                    class="btn btn-sm {{ followService.isFollowing(f.id) ? 'btn-ghost' : 'btn-success' }}"
                    [disabled]="followingId() === f.id || followService.isFollowing(f.id)"
                    (click)="follow(f)">
                    @if (followingId() === f.id) {
                      <div class="spinner spinner-sm"></div>
                    } @else if (followService.isFollowing(f.id)) {
                      ✓ Seguindo
                    } @else {
                      + Seguir
                    }
                  </button>
                </div>
              }
            </div>
          } @else if (searchQuery && !searching()) {
            <p class="muted" style="text-align:center;font-size:14px;padding:.75rem;">
              Nenhum resultado para "{{ searchQuery }}"
            </p>
          }
        </div>
      }

      <!-- Following grid -->
      @if (followService.follows().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">👤</div>
          <div class="empty-title">Você não segue nenhum lutador</div>
          <div class="empty-sub">Clique em "+ Adicionar lutador" para começar a acompanhar</div>
          <button class="btn btn-primary" style="margin-top:1rem;"
                  (click)="showSearch = true">Buscar lutadores</button>
        </div>
      } @else {
        <div class="fighters-grid">
          @for (f of followService.follows(); track f.id) {
            <div class="fighter-card card card-hover">
              <div class="fighter-header">
                <div class="avatar avatar-md"
                     [style.background]="getAvatarBg(f.fighterName)"
                     [style.color]="getAvatarColor(f.fighterName)">
                  {{ initials(f.fighterName) }}
                </div>
                <div>
                  <div style="font-weight:600;font-size:15px;">{{ f.fighterName }}</div>
                  <div class="muted" style="font-size:12px;">Slot {{ $index + 1 }} de {{ LIMIT }}</div>
                </div>
              </div>
              <div class="divider" style="margin:.9rem 0;"></div>
              <div style="display:flex;gap:.5rem;">
                <span class="status-badge active">Seguindo</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .fighters-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1rem;
    }
    .fighter-header { display: flex; align-items: center; gap: 12px; }
    .result-row {
      display: flex; align-items: center; gap: 12px;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: var(--r); padding: 10px 14px;
      transition: border-color .2s;
      &:hover { border-color: var(--border2); }
    }
  `]
})
export class FollowingComponent implements OnInit {
  readonly LIMIT = FREE_FOLLOW_LIMIT;
  showSearch = false;
  searchQuery = '';
  searchResults = signal<Fighter[]>([]);
  searching = signal(false);
  followingId = signal<number | null>(null);

  private search$ = new Subject<string>();

  limitPct = () => Math.round((this.followService.followCount() / this.LIMIT) * 100);

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
    private fighterService: FighterService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) { this.searchResults.set([]); return of([]); }
        this.searching.set(true);
        return this.fighterService.search(q).pipe(catchError(() => of([])));
      })
    ).subscribe(results => {
      this.searchResults.set(results);
      this.searching.set(false);
    });
  }

  onSearch(q: string) { this.search$.next(q); }

  follow(fighter: Fighter) {
    if (this.followService.followCount() >= this.LIMIT) {
      this.toast.warning('Limite atingido', `Plano gratuito permite até ${this.LIMIT} lutadores. Faça upgrade!`);
      return;
    }
    this.followingId.set(fighter.id);
    this.followService.follow(fighter.id).subscribe({
      next: () => { this.toast.success(`Seguindo ${fighter.name}! 🥊`); this.followingId.set(null); },
      error: (e) => {
        this.toast.error('Erro', e.error?.error || e.message);
        this.followingId.set(null);
      }
    });
  }

  initials(name: string) { return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
  getAvatarBg(name: string)    { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length][0]; }
  getAvatarColor(name: string) { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length][1]; }
  getCategoryTag(cat: string) {
    const map: Record<string,string> = { 'MMA':'tag-mma','Boxe':'tag-box','Jiu-Jitsu':'tag-jj','Muay Thai':'tag-mt','Wrestling':'tag-wres','Kickboxing':'tag-kick','Judô':'tag-judo' };
    return map[cat] ?? 'tag-default';
  }
}
