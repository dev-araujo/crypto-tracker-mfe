import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageVisibilityService {
  private readonly document = inject(DOCUMENT);
  private readonly _isVisible = signal(this.readVisibility());

  readonly isVisible = this._isVisible.asReadonly();
  readonly visibility: Observable<boolean> = toObservable(this._isVisible);

  constructor() {
    fromEvent(this.document, 'visibilitychange')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this._isVisible.set(this.readVisibility()));
  }

  private readVisibility(): boolean {
    return this.document.visibilityState === 'visible';
  }
}
