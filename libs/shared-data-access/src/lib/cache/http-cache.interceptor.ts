import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { CACHE_POLICY } from './cache-policy.context';
import { HttpCacheStore } from './http-cache.store';

export const httpCacheInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.method !== 'GET') {
    return next(request);
  }

  const cache = inject(HttpCacheStore);
  const key = request.urlWithParams;

  if (request.context.get(CACHE_POLICY) === 'revalidate') {
    return cache.track(key, next(request));
  }

  const cached = cache.read(key);

  if (cached !== null) {
    return of(cached.clone());
  }

  return cache.pending(key) ?? cache.track(key, next(request));
};
