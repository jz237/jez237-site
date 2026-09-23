import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { checkPhillyLive } from './check_philly_live.mjs';

// All commands use an explicit project root, even when invoked from a staging
// directory. A static-only upload must never replace the live Functions bundle.
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stage = resolve(process.argv[2] || '.');
const prepareOnly = process.argv.includes('--prepare-only');
const rel = relative(repo, stage);
if (!rel || (!rel.startsWith('..') && !isAbsolute(rel))) {
  throw new Error('Use a separate, disposable public upload directory outside the repository.');
}
for (const path of ['_headers', 'index.html', 'demos/philadelphia-relief/index.html']) {
  if (!existsSync(resolve(stage, path))) throw new Error(`Upload directory is missing ${path}.`);
}
const wranglerPackage = createRequire(import.meta.url).resolve('wrangler/package.json');
const wrangler = resolve(dirname(wranglerPackage),
  JSON.parse(readFileSync(wranglerPackage, 'utf8')).bin.wrangler);
const env = { ...process.env, CF_PAGES_BRANCH: 'main',
  CLOUDFLARE_ACCOUNT_ID: 'ac73a259dff5a3cbeccbb78824ac0db6' };
function run(command, args) {
  const result = spawnSync(command, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) throw new Error('Deployment command failed; publication stopped.');
  return result.stdout;
}
const git = (...args) => run('git', args).trim();
async function verifyRelease(url) {
  // A newly uploaded Pages Worker may lag its static assets briefly. Keep all
  // checks fail-closed, but allow 30 seconds of bounded readiness backoff.
  for (let attempt = 0; attempt < 6; attempt++) {
    try { await checkPhillyLive(url); return; }
    catch (error) {
      if (attempt === 5) throw error;
      console.log(`${error.message} Retrying the newly deployed service.`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}
if (git('status', '--porcelain')) throw new Error('Commit changes before preparing a deployment.');
git('fetch', 'origin', 'main');
const sha = git('rev-parse', 'HEAD');
if (sha !== git('rev-parse', 'origin/main')) throw new Error('Refusing to deploy a stale or unpushed checkout.');
run(process.execPath, ['scripts/guard_cloudflare_deploy.mjs']);
const worker = resolve(stage, '_worker.js');
if (existsSync(worker)) throw new Error('Use a fresh upload directory; an old Worker must not be reused.');
mkdirSync(worker);
run(process.execPath, [wrangler, 'pages', 'functions', 'build', resolve(repo, 'functions'),
  '--outdir', worker, '--output-routes-path', resolve(stage, '_routes.json')]);
const bundle = readFileSync(resolve(worker, 'index.js'), 'utf8');
for (const marker of ['Invalid detail imagery request', 'Invalid neighborhood', 'philly-aircraft-relay', 'unsafe-eval']) {
  if (!bundle.includes(marker)) throw new Error(`Compiled Functions failed verification: ${marker}.`);
}
if (prepareOnly) {
  console.log('Upload prepared with compiled Functions. No deployment was made.');
} else {
  const deploy = branch => run(process.execPath, [wrangler, 'pages', 'deploy', stage,
    '--project-name', 'jez237-site', '--branch', branch, '--commit-hash', sha, '--commit-dirty=false']);
  const preview = deploy(`release-check-${sha.slice(0, 12)}`);
  const previewUrl = preview.match(/https:\/\/[a-z0-9]+\.jez237-site\.pages\.dev/)?.[0];
  if (!previewUrl) throw new Error('Preview deployment URL was not returned; production unchanged.');
  await verifyRelease(previewUrl);
  git('fetch', 'origin', 'main');
  if (sha !== git('rev-parse', 'origin/main')) throw new Error('Main changed during preview; production unchanged.');
  deploy('main');
  await verifyRelease('https://jez237.com');
}
