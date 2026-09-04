import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, shareReplay, tap } from 'rxjs';
import { HTTP_CACHE_TTL_MS } from './cache-policy.context';

interface CacheEntry {
  readonly response: HttpResponse<unknown>;
  readonly storedAt: number;
}

const MAX_ENTRIES = 40;

@Injectable({ providedIn: 'root' })
export class HttpCacheStore {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

  read(key: string): HttpResponse<unknown> | null {
    const entry = this.entries.get(key);

    if (entry === undefined) {
      return null;
    }

    if (Date.now() - entry.storedAt > HTTP_CACHE_TTL_MS) {
      this.entries.delete(key);

      return null;
    }

    return entry.response;
  }

  pending(key: string): Observable<HttpEvent<unknown>> | null {
    return this.inFlight.get(key) ?? null;
  }

  track(key: string, stream: Observable<HttpEvent<unknown>>): Observable<HttpEvent<unknown>> {
    const shared = stream.pipe(
      tap((event) => this.write(key, event)),
      finalize(() => this.inFlight.delete(key)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.inFlight.set(key, shared);

    return shared;
  }

  clear(): void {
    this.entries.clear();
    this.inFlight.clear();
  }

  private write(key: string, event: HttpEvent<unknown>): void {
    if (!(event instanceof HttpResponse)) {
      return;
    }

    this.evictOldestWhenFull();
    this.entries.set(key, { response: event, storedAt: Date.now() });
  }

  private evictOldestWhenFull(): void {
    if (this.entries.size < MAX_ENTRIES) {
      return;
    }

    const oldestKey = this.entries.keys().next().value;

    if (oldestKey !== undefined) {
      this.entries.delete(oldestKey);
    }
  }
}
