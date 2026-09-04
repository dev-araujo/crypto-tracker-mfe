import { Routes } from '@angular/router';
import { provideCryptoApi, provideRevalidation } from '@crypto/shared-data-access';
import { environment } from '../environments/environment';
import { WatchlistCoinsService } from './features/watchlist/services/watchlist-coins.service';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideCryptoApi(environment.api),
      provideRevalidation(environment.revalidation),
      WatchlistCoinsService,
    ],
    loadChildren: () =>
      import('./features/watchlist/watchlist.routes').then((module) => module.watchlistRoutes),
  },
];
