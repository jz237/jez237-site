import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

/** Fail closed for unrelated workflows, active/rerun jobs and incomplete metadata. */
export function planPagesArtifactCleanup(artifacts, runs, workflowId, branch = 'main') {
  const byRun = new Map(runs.map(run => [run.id, run]));
  const owned = artifacts.filter(artifact => {
    const run = byRun.get(artifact.workflow_run?.id);
    return run?.workflow_id === workflowId && run.head_branch === branch &&
      artifact.name === `github-pages-${run.id}-${run.run_attempt}` &&
      run.status === 'completed' && !artifact.expired;
  });
  const successful = owned.filter(a => byRun.get(a.workflow_run.id).conclusion === 'success')
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);
  // Retain both current and rollback. If fewer than two are available, do nothing.
  const keep = successful.slice(0, 2).map(a => a.id);
  return {keep, remove: keep.length < 2 ? [] : owned.filter(a => !keep.includes(a.id))};
}

function api(endpoint, method = 'GET') {
  const output = execFileSync('gh', ['api', '--method', method, endpoint], {
    encoding: 'utf8', timeout: 30_000, maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.trim() ? JSON.parse(output) : null;
}
function list(endpoint, key) {
  const rows = [];
  // Bound API work and fail closed if there is more data than the bound permits.
  for (let page = 1; page <= 20; page++) {
    const result = api(`${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!Array.isArray(result[key])) throw new Error(`Unexpected ${key} API response`);
    rows.push(...result[key]);
    if (result[key].length < 100 || rows.length >= result.total_count) return rows;
  }
  throw new Error(`Pagination limit reached for ${key}; no cleanup performed`);
}
export function runCleanup({repo, apply = false}) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo ?? '')) throw new Error('Set GH_REPO to owner/repository');
  const base = `repos/${repo}/actions`;
  const workflow = api(`${base}/workflows/pages.yml`);
  const artifacts = list(`${base}/artifacts`, 'artifacts');
  // Inspect only the runs attached to extant, correctly named uploads. Do not
  // walk the ever-growing historical workflow-run archive on every deployment.
  const runIds = [...new Set(artifacts.filter(a =>
    Number.isSafeInteger(a.workflow_run?.id) && /^github-pages-\d+-\d+$/.test(a.name)
  ).map(a => a.workflow_run.id))];
  const runs = runIds.map(id => api(`${base}/runs/${id}`));
  const plan = planPagesArtifactCleanup(artifacts, runs, workflow.id);
  const receipt = {apply, keep: plan.keep, candidateCount: plan.remove.length, deleted: [], skipped: []};
  if (apply) for (const artifact of plan.remove) {
    // Recheck the run, including attempt number, immediately before deletion.
    const freshRun = api(`${base}/runs/${artifact.workflow_run.id}`);
    if (freshRun.status !== 'completed' || freshRun.workflow_id !== workflow.id ||
        freshRun.head_branch !== 'main' || artifact.name !== `github-pages-${freshRun.id}-${freshRun.run_attempt}`) {
      receipt.skipped.push(artifact.id); continue;
    }
    const freshArtifact = api(`${base}/artifacts/${artifact.id}`);
    if (freshArtifact.name !== artifact.name || freshArtifact.workflow_run?.id !== freshRun.id) {
      throw new Error(`Artifact identity changed: ${artifact.id}`);
    }
    api(`${base}/artifacts/${artifact.id}`, 'DELETE');
    receipt.deleted.push({id: artifact.id, bytes: artifact.size_in_bytes});
  }
  receipt.deletedBytes = receipt.deleted.reduce((sum, a) => sum + a.bytes, 0);
  return receipt;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(runCleanup({repo: process.env.GH_REPO, apply: process.argv.includes('--apply')}), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
