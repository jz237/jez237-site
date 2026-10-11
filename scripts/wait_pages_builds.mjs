import { spawnSync } from 'node:child_process';

// Wrangler's formatted deployment list loses the stage name: a successful
// clone or build looks finished even though it can still publish old files.
export function pendingProductionBuilds(deployments) {
  return deployments.filter(deployment => {
    if (deployment.environment !== 'production') return false;
    const stage = deployment.latest_stage;
    if (['failure', 'canceled', 'skipped'].includes(stage?.status)) return false;
    return !(stage?.name === 'deploy' && stage.status === 'success' && stage.ended_on);
  });
}

export async function readProductionBuilds(url, headers, { fetcher = fetch, deadline = Infinity,
  pause = ms => new Promise(resolve => setTimeout(resolve, ms)), now = Date.now } = {}) {
  let status = 'network';
  for (let attempt = 0; attempt < 3; attempt++) {
    if (now() >= deadline) throw new Error('Publication cutoff reached while checking Pages builds.');
    try {
      const response = await fetcher(url, { headers, redirect: 'error',
        signal: AbortSignal.timeout(Math.max(1, Math.min(20000, deadline - now()))) });
      status = response.status;
      if ([400, 401, 403, 404].includes(status)) break;
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.result) && data.result.length) return data.result;
    } catch { /* Never log an upstream body or a credential-bearing request. */ }
    if (attempt < 2) await pause(Math.min(2000 * (attempt + 1), Math.max(0, deadline - now())));
  }
  throw new Error(`Cannot verify the recent Pages build queue (${status}); publication stopped.`);
}

export async function waitForProductionBuilds({ wrangler, repo, env, accountId, projectName, deadline = Infinity }) {
  // Credentials stay in memory and are sent only to Cloudflare's API.
  const result = spawnSync(process.execPath, [wrangler, 'auth', 'token', '--json'],
    { cwd: repo, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error('Cannot check the Pages build queue: authentication unavailable.');
  const auth = JSON.parse(result.stdout);
  const headers = auth.token ? { Authorization: `Bearer ${auth.token}` }
    : auth.type === 'api_key' ? { 'X-Auth-Key': auth.key, 'X-Auth-Email': auth.email } : null;
  if (!headers) throw new Error('Cannot check the Pages build queue: unsupported credentials.');
  const root = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`;
  const start = Date.now();
  let previous = '';
  for (;;) {
    if (Date.now() >= deadline) throw new Error('Publication cutoff reached while waiting for Pages builds.');
    const deployments = await readProductionBuilds(`${root}?env=production`, headers, { deadline });
    const pending = pendingProductionBuilds(deployments);
    if (!pending.length) return;
    const label = pending.map(d => `${d.deployment_trigger?.metadata?.commit_hash?.slice(0, 7) || d.id}: ${d.latest_stage?.name || 'unknown'}`).join(', ');
    if (label !== previous) console.log(`Waiting for earlier production builds before publishing: ${label}`);
    previous = label;
    if (Date.now() - start > 10 * 60 * 1000) throw new Error('Pages build queue did not settle within ten minutes; publication stopped.');
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
}
