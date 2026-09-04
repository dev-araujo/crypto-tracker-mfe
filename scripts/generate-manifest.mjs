import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '..');

config({ path: join(workspaceRoot, '.env'), quiet: true });

const REMOTE_DEFAULTS = {
  market: 'http://localhost:4201',
  analytics: 'http://localhost:4202',
  watchlist: 'http://localhost:4203',
};

const manifest = Object.fromEntries(
  Object.entries(REMOTE_DEFAULTS).map(([remote, fallback]) => {
    const origin = process.env[`MFE_${remote.toUpperCase()}_URL`] ?? fallback;

    return [remote, `${origin.replace(/\/+$/, '')}/remoteEntry.json`];
  }),
);

const targetDir = join(workspaceRoot, 'shell', 'public');

mkdirSync(targetDir, { recursive: true });
writeFileSync(
  join(targetDir, 'federation.manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log('[manifest] shell/public/federation.manifest.json atualizado');
console.table(manifest);
