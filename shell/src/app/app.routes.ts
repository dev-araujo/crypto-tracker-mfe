import { Routes } from '@angular/router';
import { loadRemoteRoutes } from './core/routing/remote-routes.loader';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'market' },
  {
    path: 'market',
    loadChildren: loadRemoteRoutes('market', 'Mercado'),
  },
  {
    path: 'coins',
    loadChildren: loadRemoteRoutes('analytics', 'Análise'),
  },
  {
    path: 'watchlist',
    loadChildren: loadRemoteRoutes('watchlist', 'Watchlist'),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/not-found/not-found.component').then(
        (module) => module.NotFoundComponent,
      ),
  },
];
