import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

config({ path: join(workspaceRoot, '.env'), quiet: true });

const UPSTREAM_URL = process.env.COINRANKING_UPSTREAM_URL ?? 'https://api.coinranking.com/v2';
const ACCESS_TOKEN = process.env.COINRANKING_API_KEY ?? '';

if (ACCESS_TOKEN.length === 0) {
  console.warn('[proxy] COINRANKING_API_KEY ausente: as requisições à Coinranking vão falhar.');
}

export default {
  '/api/coinranking': {
    target: UPSTREAM_URL,
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/api/coinranking': '' },
    on: {
      proxyReq: (proxyRequest) => proxyRequest.setHeader('x-access-token', ACCESS_TOKEN),
    },
  },
};
