import { vi } from 'vitest';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { loadRemoteRoutes } from './remote-routes.loader';

vi.mock('@angular-architects/native-federation', () => ({
  loadRemoteModule: vi.fn(),
}));

const loadRemoteModuleMock = vi.mocked(loadRemoteModule);

describe('loadRemoteRoutes', () => {
  it('returns the routes exposed by the remote', async () => {
    const remoteRoutes = [{ path: '' }];

    loadRemoteModuleMock.mockResolvedValueOnce({ routes: remoteRoutes });

    await expect(loadRemoteRoutes('market', 'Mercado')()).resolves.toBe(remoteRoutes);
  });

  it('falls back to an unavailable page when the remote cannot be loaded', async () => {
    loadRemoteModuleMock.mockRejectedValueOnce(new Error('offline'));

    const routes = await loadRemoteRoutes('market', 'Mercado')();

    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('**');
    expect(routes[0].data).toEqual({ remoteLabel: 'Mercado' });
  });
});
