import { Routes } from '@angular/router';

export const watchlistRoutes: Routes = [
  {
    path: '',
    title: 'Watchlist · Cripto Angular',
    loadComponent: () =>
      import('./pages/watchlist/watchlist.page').then((module) => module.WatchlistPage),
  },
];
