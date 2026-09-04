import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const EXPOSED_ROUTES = './Routes';

export function loadRemoteRoutes(remoteName: string, remoteLabel: string): () => Promise<Routes> {
  return async () => {
    try {
      const remote = await loadRemoteModule<{ routes: Routes }>(remoteName, EXPOSED_ROUTES);

      return remote.routes;
    } catch {
      return fallbackRoutes(remoteLabel);
    }
  };
}

function fallbackRoutes(remoteLabel: string): Routes {
  return [
    {
      path: '**',
      data: { remoteLabel },
      loadComponent: () =>
        import('../pages/remote-unavailable/remote-unavailable.component').then(
          (module) => module.RemoteUnavailableComponent,
        ),
    },
  ];
}
