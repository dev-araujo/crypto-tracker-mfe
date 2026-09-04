import { Routes } from '@angular/router';
import { provideCryptoApi, provideRevalidation } from '@crypto/shared-data-access';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    providers: [provideCryptoApi(environment.api), provideRevalidation(environment.revalidation)],
    loadChildren: () =>
      import('./features/coin-analytics/coin-analytics.routes').then(
        (module) => module.coinAnalyticsRoutes,
      ),
  },
];
