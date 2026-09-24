import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export async function recoverRelay({ stopped, healthy, start }) {
  if (stopped()) return 'stopped';
  try { if (await healthy()) return 'healthy'; } catch { /* helper exited */ }
  // Honor Stop even if pressed while the health request was pending.
  if (stopped()) return 'stopped';
  await start(); return 'restarted';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2];
  const config = JSON.parse(readFileSync(join(root, 'config.json'), 'utf8'));
  await recoverRelay({
    stopped: () => existsSync(join(root, 'stop')),
    healthy: async () => {
      const response = await fetch(`http://127.0.0.1:${config.port}/health`, {
        headers: { Authorization: `Bearer ${config.token}` },
        signal: AbortSignal.timeout(3000), redirect: 'error',
      });
      await response.body?.cancel();
      return response.status === 204 && response.headers.get('X-Philadelphia-Aircraft-Relay') === '1';
    },
    start: () => new Promise((resolve, reject) => {
      const child = spawn(config.node, [join(root, 'run.mjs'), root],
        { cwd: root, detached: true, windowsHide: true, stdio: 'ignore' });
      child.on('error', reject);
      child.once('spawn', () => { child.unref(); resolve(); });
    }),
  });
}
