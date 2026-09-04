export const config = { runtime: 'edge' };

const UPSTREAM_URL = process.env.COINRANKING_UPSTREAM_URL ?? 'https://api.coinranking.com/v2';
const ACCESS_TOKEN = process.env.COINRANKING_API_KEY ?? '';
const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';

const ALLOWED_PATHS = [/^coins$/, /^coin\/[\w-]+$/, /^coin\/[\w-]+\/history$/];

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return problem(405, 'Only GET and HEAD are supported.');
  }

  if (ACCESS_TOKEN.length === 0) {
    return problem(500, 'The upstream credential is not configured.');
  }

  const url = new URL(request.url);
  const path = (url.searchParams.get('path') ?? '').replace(/^\/+|\/+$/g, '');

  if (!ALLOWED_PATHS.some((allowed) => allowed.test(path))) {
    return problem(404, 'Unknown resource.');
  }

  const query = new URLSearchParams(url.searchParams);
  query.delete('path');

  const upstream = await fetch(`${UPSTREAM_URL}/${path}?${query.toString()}`, {
    headers: { 'x-access-token': ACCESS_TOKEN, accept: 'application/json' },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': upstream.ok ? CACHE_CONTROL : 'no-store',
    },
  });
}

function problem(status: number, message: string): Response {
  return new Response(JSON.stringify({ status: 'fail', message }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
