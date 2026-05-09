import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { FighterService } from '../../core/services/fighter.service';
import { FollowService } from '../../core/services/follow.service';
import { ToastService } from '../../core/services/toast.service';
import { Fighter, CATEGORIES, FREE_FOLLOW_LIMIT } from '../../shared/models';

@Component({
  selector: 'app-fighters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Explorar Lutadores</h1>
          <p class="page-subtitle">Busque lutadores de qualquer modalidade e siga os seus favoritos</p>
        </div>
        <button class="btn btn-primary" (click)="showCreate = !showCreate">
          {{ showCreate ? '✕ Cancelar' : '+ Cadastrar lutador' }}
        </button>
      </div>

      @if (showCreate) {
        <div class="card" style="margin-bottom:1.5rem;">
          <p class="section-label">Novo lutador</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="field" style="margin:0;"><label>Nome completo</label>
              <input [(ngModel)]="createName" placeholder="Ex: Israel Adesanya" /></div>
            <div class="field" style="margin:0;"><label>Modalidade</label>
              <select [(ngModel)]="createCategory">
                @for (c of allCategories; track c) { <option [value]="c">{{ c }}</option> }
              </select>
            </div>
          </div>
          <div style="display:flex;gap:.75rem;margin-top:1rem;">
            <button class="btn btn-primary" [disabled]="creating()" (click)="createFighter()">
              @if (creating()) { <div class="spinner spinner-sm spinner-white"></div> Salvando... }
              @else { Cadastrar }
            </button>
            <button class="btn btn-ghost" (click)="showCreate=false">Cancelar</button>
          </div>
        </div>
      }

      <div class="search-wrap" style="margin-bottom:1.25rem;">
        <span class="search-icon">🔍</span>
        <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
               placeholder="Buscar lutador pelo nome..." />
        @if (searching()) { <div class="spinner spinner-sm"></div> }
      </div>

      <div class="pill-group">
        <button class="pill" [class.active]="activeCategory === ''"
                (click)="clearFilter()">Todos</button>
        @for (c of allCategories; track c) {
          <button class="pill" [class.active]="activeCategory === c"
                  (click)="filterByCategory(c)">{{ c }}</button>
        }
      </div>

      @if (results().length > 0) {
        <div class="fighters-grid">
          @for (f of results(); track f.id) {
            <div class="fighter-card card card-hover">
              <div class="fighter-top">
                <div class="avatar avatar-md"
                     [style.background]="getAvatarBg(f.name)"
                     [style.color]="getAvatarColor(f.name)">{{ initials(f.name) }}</div>
                <div>
                  <div style="font-weight:600;font-size:15px;line-height:1.3;">{{ f.name }}</div>
                  <span class="tag {{ getCategoryTag(f.category) }}">{{ f.category }}</span>
                </div>
              </div>
              <div class="divider" style="margin:.85rem 0;"></div>
              <button
                class="btn btn-sm {{ followService.isFollowing(f.id) ? 'btn-ghost' : 'btn-success' }}"
                style="width:100%;"
                [disabled]="followingId() === f.id || followService.isFollowing(f.id)"
                (click)="follow(f)">
                @if (followingId() === f.id) {
                  <div class="spinner spinner-sm"></div> Seguindo...
                } @else if (followService.isFollowing(f.id)) {
                  ✓ Seguindo
                } @else {
                  + Seguir lutador
                }
              </button>
            </div>
          }
        </div>
      } @else if (!searchQuery && !activeCategory && !searching()) {
        <div class="empty-state">
          <div class="empty-icon">🥊</div>
          <div class="empty-title">Busque um lutador</div>
          <div class="empty-sub">Digite um nome ou clique em uma modalidade para explorar</div>
        </div>
      } @else if ((searchQuery || activeCategory) && !searching() && results().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">Nenhum resultado</div>
          <div class="empty-sub">Tente outro nome ou cadastre o lutador acima</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .fighters-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem; }
    .fighter-top { display:flex;align-items:center;gap:12px; }
  `]
})
export class FightersComponent implements OnInit {
  readonly LIMIT = FREE_FOLLOW_LIMIT;
  readonly allCategories = CATEGORIES;

  showCreate = false;
  createName = ''; createCategory = 'MMA';
  creating   = signal(false);
  searchQuery    = '';
  activeCategory = '';
  results        = signal<Fighter[]>([]);
  searching      = signal(false);
  followingId    = signal<number | null>(null);

  private search$ = new Subject<string>();

  private avatarColors = [
    ['rgba(232,69,60,.2)','var(--accent)'],['rgba(59,143,232,.2)','var(--blue)'],
    ['rgba(245,166,35,.2)','var(--gold)'],['rgba(20,184,166,.2)','var(--teal)'],
    ['rgba(167,139,250,.2)','var(--purple)'],['rgba(34,197,94,.2)','var(--green)'],
  ];

  constructor(
    private fighterService: FighterService,
    public followService: FollowService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.search$.pipe(
      debounceTime(350), distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) { this.results.set([]); return of([]); }
        this.searching.set(true);
        return this.fighterService.search(q).pipe(catchError(() => of([])));
      })
    ).subscribe(r => { this.results.set(r); this.searching.set(false); });
  }

  onSearch(q: string) { this.activeCategory = ''; this.search$.next(q); }

  clearFilter() {
    this.activeCategory = ''; this.searchQuery = ''; this.results.set([]);
  }

  filterByCategory(cat: string) {
    this.activeCategory = cat; this.searchQuery = '';
    this.searching.set(true);
    this.fighterService.getByCategory(cat).subscribe({
      next: r => { this.results.set(r); this.searching.set(false); },
      error: () => this.searching.set(false)
    });
  }

  createFighter() {
    if (!this.createName.trim()) return;
    this.creating.set(true);
    this.fighterService.create({ name: this.createName, category: this.createCategory }).subscribe({
      next: () => {
        this.toast.success(`${this.createName} cadastrado!`);
        this.createName = ''; this.showCreate = false; this.creating.set(false);
      },
      error: (e) => { this.toast.error('Erro', e.error?.error || e.message); this.creating.set(false); }
    });
  }

  follow(fighter: Fighter) {
    if (this.followService.followCount() >= this.LIMIT && !this.followService.isFollowing(fighter.id)) {
      this.toast.warning('Limite atingido', 'Faça upgrade para o plano Pro!'); return;
    }
    this.followingId.set(fighter.id);
    this.followService.follow(fighter.id).subscribe({
      next: () => { this.toast.success(`Seguindo ${fighter.name}! 🥊`); this.followingId.set(null); },
      error: (e) => { this.toast.error('Erro', e.error?.error || e.message); this.followingId.set(null); }
    });
  }

  initials(n: string)       { return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
  getAvatarBg(n: string)    { return this.avatarColors[n.charCodeAt(0) % this.avatarColors.length][0]; }
  getAvatarColor(n: string) { return this.avatarColors[n.charCodeAt(0) % this.avatarColors.length][1]; }
  getCategoryTag(cat: string) {
    const m: Record<string,string> = {'MMA':'tag-mma','Boxe':'tag-box','Jiu-Jitsu':'tag-jj',
      'Muay Thai':'tag-mt','Wrestling':'tag-wres','Kickboxing':'tag-kick','Judô':'tag-judo'};
    return m[cat] ?? 'tag-default';
  }
}
