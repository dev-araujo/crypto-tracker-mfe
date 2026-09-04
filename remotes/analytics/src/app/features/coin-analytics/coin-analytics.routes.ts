import { Routes } from '@angular/router';

export const coinAnalyticsRoutes: Routes = [
  {
    path: ':uuid',
    title: 'Análise do ativo · Cripto Angular',
    loadComponent: () =>
      import('./pages/coin-analytics/coin-analytics.page').then(
        (module) => module.CoinAnalyticsPage,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: '/market' },
];
