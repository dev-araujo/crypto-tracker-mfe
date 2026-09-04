import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { EXPOSED_ROUTES } from './remote-routes.loader';

@Injectable({ providedIn: 'root' })
export class RemotePrefetcherService {
  private readonly requested = new Set<string>();

  prefetch(remoteName: string): void {
    if (this.requested.has(remoteName)) {
      return;
    }

    this.requested.add(remoteName);

    loadRemoteModule(remoteName, EXPOSED_ROUTES).catch(() => this.requested.delete(remoteName));
  }
}
