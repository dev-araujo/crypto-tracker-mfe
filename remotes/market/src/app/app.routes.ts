import { Routes } from '@angular/router';
import { provideCryptoApi, provideRevalidation } from '@crypto/shared-data-access';
import { environment } from '../environments/environment';
import { MarketService } from './features/market-overview/services/market.service';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideCryptoApi(environment.api),
      provideRevalidation(environment.revalidation),
      MarketService,
    ],
    loadChildren: () =>
      import('./features/market-overview/market-overview.routes').then(
        (module) => module.marketOverviewRoutes,
      ),
  },
];
