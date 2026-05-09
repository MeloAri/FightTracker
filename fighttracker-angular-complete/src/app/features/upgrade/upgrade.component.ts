import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  color: string;
  featured: boolean;
  features: { text: string; included: boolean }[];
}

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fade-up">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Fazer Upgrade</h1>
          <p class="page-subtitle">Escolha o plano ideal para acompanhar suas lutas</p>
        </div>
        <a routerLink="/dashboard" class="btn btn-ghost">← Voltar</a>
      </div>

      <!-- Current plan banner -->
      <div class="current-plan-bar">
        <span class="current-plan-icon">⚡</span>
        <div>
          <div style="font-weight:600;font-size:14px;">Você está no plano <strong style="color:var(--green)">Gratuito</strong></div>
          <div class="muted" style="font-size:12px;">Limite de 3 lutadores · Sem estatísticas avançadas</div>
        </div>
      </div>

      <!-- Toggle billing -->
      <div class="billing-toggle">
        <span [class.active]="!annual()" (click)="annual.set(false)">Mensal</span>
        <div class="toggle-track" (click)="annual.set(!annual())">
          <div class="toggle-thumb" [class.on]="annual()"></div>
        </div>
        <span [class.active]="annual()" (click)="annual.set(true)">
          Anual <span class="save-badge">-20%</span>
        </span>
      </div>

      <!-- Plans grid -->
      <div class="plans-grid">
        @for (plan of plans; track plan.id) {
          <div class="plan-card" [class.featured]="plan.featured" [class.current]="plan.id === 'free'">
            @if (plan.featured) {
              <div class="featured-badge">Mais popular</div>
            }
            @if (plan.id === 'free') {
              <div class="featured-badge" style="background:var(--surface3);color:var(--muted);">Plano atual</div>
            }

            <div class="plan-name condensed uppercase">{{ plan.name }}</div>

            <div class="plan-price-row">
              @if (plan.id === 'free') {
                <div class="plan-price">R$0</div>
                <div class="plan-period muted">/sempre</div>
              } @else {
                <div class="plan-price">
                  {{ annual() ? getAnnualPrice(plan.price) : plan.price }}
                </div>
                <div class="plan-period muted">/{{ annual() ? 'mês (cobrado anual)' : 'mês' }}</div>
              }
            </div>

            <p class="plan-description muted">{{ plan.description }}</p>

            <div class="divider" style="margin:.9rem 0;"></div>

            <ul class="features-list">
              @for (f of plan.features; track f.text) {
                <li [class.disabled]="!f.included">
                  <span class="feat-check">{{ f.included ? '✓' : '—' }}</span>
                  {{ f.text }}
                </li>
              }
            </ul>

            <button
              class="btn btn-full"
              [class]="plan.id === 'free' ? 'btn btn-ghost btn-full' : plan.featured ? 'btn btn-primary btn-full' : 'btn btn-ghost btn-full'"
              [disabled]="plan.id === 'free' || selecting() === plan.id"
              (click)="selectPlan(plan)"
              style="margin-top:auto;">
              @if (selecting() === plan.id) {
                <div class="spinner spinner-sm" [class.spinner-white]="plan.featured"></div>
                Processando...
              } @else if (plan.id === 'free') {
                Plano atual
              } @else {
                Assinar {{ plan.name }}
              }
            </button>
          </div>
        }
      </div>

      <!-- FAQ -->
      <div style="margin-top:3rem;">
        <p class="section-label" style="text-align:center;margin-bottom:1.5rem;">Dúvidas frequentes</p>
        <div class="faq-grid">
          @for (faq of faqs; track faq.q) {
            <div class="faq-card card card-sm">
              <div class="faq-q">{{ faq.q }}</div>
              <div class="faq-a muted">{{ faq.a }}</div>
            </div>
          }
        </div>
      </div>

    </div>

    <!-- Confirmation modal -->
    @if (confirming()) {
      <div class="modal-overlay" (click)="confirming.set(null)">
        <div class="modal-box card" (click)="$event.stopPropagation()">
          <div class="modal-header condensed uppercase">Confirmar assinatura</div>
          <p class="muted" style="font-size:14px;margin:.75rem 0 1.25rem;">
            Você está prestes a assinar o plano
            <strong style="color:var(--text)">{{ confirming()!.name }}</strong> por
            <strong style="color:var(--accent)">
              {{ annual() ? getAnnualPrice(confirming()!.price) : confirming()!.price }}/mês
            </strong>.
          </p>
          <div class="modal-notice">
            🚧 Sistema de pagamento em breve. Por enquanto, entre em contato pelo suporte.
          </div>
          <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end;">
            <button class="btn btn-ghost" (click)="confirming.set(null)">Cancelar</button>
            <button class="btn btn-primary" (click)="confirmUpgrade()">Entendido!</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .current-plan-bar {
      display: flex; align-items: center; gap: 12px;
      background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.15);
      border-radius: var(--r2); padding: .9rem 1.25rem; margin-bottom: 1.75rem;
    }
    .current-plan-icon { font-size: 1.4rem; }

    /* Billing toggle */
    .billing-toggle {
      display: flex; align-items: center; justify-content: center;
      gap: .85rem; margin-bottom: 2rem; font-size: 14px; font-weight: 500;
    }
    .billing-toggle span { color: var(--muted); cursor: pointer; transition: color .2s; }
    .billing-toggle span.active { color: var(--text); }
    .toggle-track {
      width: 40px; height: 22px; background: var(--surface2); border: 1px solid var(--border2);
      border-radius: 99px; cursor: pointer; position: relative; transition: background .2s;
    }
    .toggle-thumb {
      position: absolute; top: 3px; left: 3px; width: 14px; height: 14px;
      background: var(--muted); border-radius: 50%; transition: left .2s, background .2s;
    }
    .toggle-thumb.on { left: 21px; background: var(--accent); }
    .save-badge {
      background: rgba(34,197,94,.15); color: var(--green);
      font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px;
      margin-left: 4px; letter-spacing: .5px;
    }

    /* Plans */
    .plans-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .plan-card {
      background: var(--surface); border: 1px solid var(--border2);
      border-radius: var(--r3); padding: 1.75rem;
      display: flex; flex-direction: column; gap: .6rem;
      position: relative; transition: transform .2s, border-color .2s;
      &:hover { transform: translateY(-3px); }
    }
    .plan-card.featured { border-color: rgba(232,69,60,.5); background: linear-gradient(160deg, rgba(232,69,60,.07) 0%, var(--surface) 100%); }
    .plan-card.current  { opacity: .7; }

    .featured-badge {
      position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
      background: var(--accent); color: #fff; font-size: 10px; font-weight: 700;
      letter-spacing: .8px; text-transform: uppercase; padding: 3px 14px; border-radius: 99px;
      white-space: nowrap;
    }

    .plan-name   { font-size: 1.1rem; font-weight: 800; letter-spacing: .5px; margin-top:.3rem; }
    .plan-price-row { display: flex; align-items: baseline; gap: 4px; margin: .3rem 0; }
    .plan-price  { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 2.6rem; line-height: 1; }
    .plan-period { font-size: 13px; }
    .plan-description { font-size: 13px; line-height: 1.55; }

    /* Features */
    .features-list { list-style: none; display: flex; flex-direction: column; gap: .55rem; margin-bottom: 1.25rem; }
    .features-list li { display: flex; align-items: center; gap: 10px; font-size: 13px; }
    .features-list li.disabled { color: var(--muted); }
    .feat-check {
      width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700;
    }
    li:not(.disabled) .feat-check { background: rgba(34,197,94,.12); color: var(--green); }
    li.disabled .feat-check       { background: var(--surface2); color: var(--muted); }

    /* FAQ */
    .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 1rem; }
    .faq-q    { font-size: 14px; font-weight: 600; margin-bottom: .4rem; }
    .faq-a    { font-size: 13px; line-height: 1.6; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 500;
      display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .modal-box   { max-width: 420px; width: 100%; }
    .modal-header { font-size: 1.2rem; font-weight: 800; }
    .modal-notice {
      background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.2);
      border-radius: var(--r); padding: .85rem 1rem; font-size: 13px; color: var(--gold);
    }
  `]
})
export class UpgradeComponent {
  annual = signal(false);
  selecting = signal<string | null>(null);
  confirming = signal<Plan | null>(null);

  constructor(private toast: ToastService) {}

  plans: Plan[] = [
    {
      id: 'free', name: 'Gratuito', price: 'R$0', period: 'sempre',
      description: 'Para começar a acompanhar suas lutas favoritas.',
      color: 'var(--muted)', featured: false,
      features: [
        { text: 'Até 3 lutadores', included: true },
        { text: 'Alertas de próximas lutas', included: true },
        { text: 'Todas as modalidades', included: true },
        { text: 'Estatísticas avançadas', included: false },
        { text: 'Lutadores ilimitados', included: false },
        { text: 'Comparação de lutadores', included: false },
        { text: 'Suporte prioritário', included: false },
      ]
    },
    {
      id: 'pro', name: 'Pro', price: 'R$19', period: 'mês',
      description: 'Para o fã que quer acompanhar tudo a fundo, sem limites.',
      color: 'var(--accent)', featured: true,
      features: [
        { text: 'Lutadores ilimitados', included: true },
        { text: 'Alertas push + email', included: true },
        { text: 'Todas as modalidades', included: true },
        { text: 'Estatísticas avançadas', included: true },
        { text: 'Comparação de lutadores', included: true },
        { text: 'Calendário personalizado', included: true },
        { text: 'Suporte prioritário', included: false },
      ]
    },
    {
      id: 'elite', name: 'Elite', price: 'R$49', period: 'mês',
      description: 'Para analistas e superfãs que precisam do máximo.',
      color: 'var(--gold)', featured: false,
      features: [
        { text: 'Tudo do Pro', included: true },
        { text: 'Acesso à API', included: true },
        { text: 'Alertas em tempo real', included: true },
        { text: 'Exportação de dados', included: true },
        { text: 'Widgets embarcáveis', included: true },
        { text: 'Comparação de lutadores', included: true },
        { text: 'Suporte prioritário', included: true },
      ]
    }
  ];

  faqs = [
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Você pode cancelar sua assinatura quando quiser, sem multas ou burocracia.' },
    { q: 'O que acontece com meus dados se eu cancelar?', a: 'Seus lutadores seguidos e histórico ficam salvos. Você volta automaticamente para o plano gratuito.' },
    { q: 'Vocês aceitam quais formas de pagamento?', a: 'Cartão de crédito, débito e Pix. O sistema de pagamento estará disponível em breve.' },
    { q: 'Tem desconto para pagamento anual?', a: 'Sim! Ativando o plano anual você economiza 20% em relação ao mensal.' },
  ];

  getAnnualPrice(monthly: string): string {
    const num = parseFloat(monthly.replace('R$', ''));
    return `R$${(num * 0.8).toFixed(0)}`;
  }

  selectPlan(plan: Plan) {
    if (plan.id === 'free') return;
    this.confirming.set(plan);
  }

  confirmUpgrade() {
    this.toast.info('Em breve! 🚀', 'O sistema de pagamento estará disponível em breve.');
    this.confirming.set(null);
  }
}
