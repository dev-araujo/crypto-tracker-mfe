import { TestBed } from '@angular/core/testing';
import { PageVisibilityService } from '@crypto/shared-utils';
import { BehaviorSubject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideRevalidation } from '../config/revalidation.token';
import { RevalidationScheduler } from './revalidation.scheduler';

const INTERVAL_MS = 1_000;

describe('RevalidationScheduler', () => {
  let visibility: BehaviorSubject<boolean>;
  let scheduler: RevalidationScheduler;

  function configure(initialVisibility: boolean): void {
    visibility = new BehaviorSubject(initialVisibility);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRevalidation({ intervalMs: INTERVAL_MS }),
        { provide: PageVisibilityService, useValue: { visibility } },
      ],
    });

    scheduler = TestBed.inject(RevalidationScheduler);
  }

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  it('emits once the interval elapses on a visible page', () => {
    configure(true);

    let ticked = false;
    scheduler.nextTick().subscribe(() => (ticked = true));

    vi.advanceTimersByTime(INTERVAL_MS - 1);
    expect(ticked).toBe(false);

    vi.advanceTimersByTime(1);
    expect(ticked).toBe(true);
  });

  it('holds the tick back while the page is hidden', () => {
    configure(false);

    let ticked = false;
    scheduler.nextTick().subscribe(() => (ticked = true));

    vi.advanceTimersByTime(INTERVAL_MS * 5);
    expect(ticked).toBe(false);

    visibility.next(true);
    expect(ticked).toBe(true);
  });
});
