import { Injectable, inject } from '@angular/core';
import { PageVisibilityService } from '@crypto/shared-utils';
import { Observable, filter, map, switchMap, take, timer } from 'rxjs';
import { REVALIDATION_CONFIG } from '../config/revalidation.token';

@Injectable()
export class RevalidationScheduler {
  private readonly visibility = inject(PageVisibilityService);
  private readonly config = inject(REVALIDATION_CONFIG);

  nextTick(): Observable<void> {
    return timer(this.config.intervalMs).pipe(
      switchMap(() => this.whenVisible()),
      map(() => undefined),
    );
  }

  private whenVisible(): Observable<boolean> {
    return this.visibility.visibility.pipe(
      filter((isVisible) => isVisible),
      take(1),
    );
  }
}
