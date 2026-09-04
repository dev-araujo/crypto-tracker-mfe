import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_CACHE_TTL_MS, withCachePolicy } from './cache-policy.context';
import { httpCacheInterceptor } from './http-cache.interceptor';
import { HttpCacheStore } from './http-cache.store';

const ENDPOINT = '/coins';

describe('httpCacheInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpCacheInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    TestBed.inject(HttpCacheStore).clear();
  });

  afterEach(() => {
    controller.verify();
    vi.useRealTimers();
  });

  it('serves a repeated request from cache', () => {
    http.get(ENDPOINT).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 1 });

    let received: unknown = null;
    http.get(ENDPOINT).subscribe((response) => (received = response));

    controller.expectNone(ENDPOINT);
    expect(received).toEqual({ value: 1 });
  });

  it('collapses concurrent identical requests into one', () => {
    const received: unknown[] = [];

    http.get(ENDPOINT).subscribe((response) => received.push(response));
    http.get(ENDPOINT).subscribe((response) => received.push(response));

    controller.expectOne(ENDPOINT).flush({ value: 2 });

    expect(received).toEqual([{ value: 2 }, { value: 2 }]);
  });

  it('bypasses the cache when the policy is revalidate', () => {
    http.get(ENDPOINT).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 3 });

    http.get(ENDPOINT, { context: withCachePolicy('revalidate') }).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 4 });
  });

  it('refetches once the entry is older than the ttl', () => {
    http.get(ENDPOINT).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 5 });

    vi.advanceTimersByTime(HTTP_CACHE_TTL_MS + 1);

    http.get(ENDPOINT).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 6 });
  });

  it('never caches non-GET requests', () => {
    http.post(ENDPOINT, {}).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 7 });

    http.post(ENDPOINT, {}).subscribe();
    controller.expectOne(ENDPOINT).flush({ value: 8 });
  });
});
