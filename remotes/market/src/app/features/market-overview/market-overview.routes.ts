import { Routes } from '@angular/router';

export const marketOverviewRoutes: Routes = [
  {
    path: '',
    title: 'Mercado · Cripto Angular',
    loadComponent: () =>
      import('./pages/market-overview/market-overview.page').then(
        (module) => module.MarketOverviewPage,
      ),
  },
];
