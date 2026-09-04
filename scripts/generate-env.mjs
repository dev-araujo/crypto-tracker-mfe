import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '..');

config({ path: join(workspaceRoot, '.env'), quiet: true });

const REMOTES = ['market', 'analytics', 'watchlist'];
const BASE_URL = process.env.COINRANKING_BASE_URL ?? '/api/coinranking';
const DEFAULT_REVALIDATE_INTERVAL_MS = 120_000;
const REVALIDATE_INTERVAL_MS =
  Number(process.env.DATA_REVALIDATE_INTERVAL_MS) || DEFAULT_REVALIDATE_INTERVAL_MS;

for (const remote of REMOTES) {
  const targetDir = join(workspaceRoot, 'remotes', remote, 'src', 'environments');

  mkdirSync(targetDir, { recursive: true });

  for (const [fileName, production] of [
    ['environment.ts', true],
    ['environment.development.ts', false],
  ]) {
    writeFileSync(
      join(targetDir, fileName),
      `export const environment = {\n  production: ${production},\n  api: {\n    baseUrl: '${BASE_URL}',\n  },\n  revalidation: {\n    intervalMs: ${REVALIDATE_INTERVAL_MS},\n  },\n};\n`,
      'utf8',
    );
  }

  console.log(`[env] gerado remotes/${remote}/src/environments`);
}
