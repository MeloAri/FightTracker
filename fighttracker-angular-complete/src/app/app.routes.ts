import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'following', loadComponent: () => import('./features/following/following.component').then(m => m.FollowingComponent) },
      { path: 'fighters',  loadComponent: () => import('./features/fighters/fighters.component').then(m => m.FightersComponent) },
      { path: 'fights',    loadComponent: () => import('./features/fights/fights.component').then(m => m.FightsComponent) },
      { path: 'events',    loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent) },
      { path: 'upgrade',   loadComponent: () => import('./features/upgrade/upgrade.component').then(m => m.UpgradeComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
