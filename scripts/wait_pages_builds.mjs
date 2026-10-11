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
    const response = await fetch(`${root}?env=production`,
      { headers, signal: AbortSignal.timeout(20000), redirect: 'error' });
    const data = await response.json();
    if (!response.ok || !data.success || !Array.isArray(data.result) || !data.result.length) {
      throw new Error('Cannot verify the recent Pages build queue; publication stopped.');
    }
    const pending = pendingProductionBuilds(data.result);
    if (!pending.length) return;
    const label = pending.map(d => `${d.deployment_trigger?.metadata?.commit_hash?.slice(0, 7) || d.id}: ${d.latest_stage?.name || 'unknown'}`).join(', ');
    if (label !== previous) console.log(`Waiting for earlier production builds before publishing: ${label}`);
    previous = label;
    if (Date.now() - start > 10 * 60 * 1000) throw new Error('Pages build queue did not settle within ten minutes; publication stopped.');
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
}
