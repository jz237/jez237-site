import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { forestRuntimeAssetPlan } from './forest-runtime-assets.mjs';

// Read-only release check. Run after the site's mandatory deployment wrapper.
const base = 'https://jez237.com/games/2026-09-27/quarry-impact/';
const output = process.env.QUARRY_RELEASE_CHECK_OUTPUT ?? 'outputs/live-release.json';
const html = await fs.readFile('dist/index.html', 'utf8');
const bundled = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.(?:js|css))"/g)].map(match => match[1]);
const build = bundled.find(file => /\/index-[^/]+\.js$/.test(file));
assert.ok(build, 'Local dist must identify its versioned application bundle');
const report = { checkedAt: new Date().toISOString(), base, build, files: [], forestAssets: [], site: [], passed: false };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
try {
  const forestAssets = await forestRuntimeAssetPlan({ publicAssets: true });
  report.forestAssetsExpected = forestAssets;
  const document = await fetch(base, { signal: AbortSignal.timeout(60000) });
  assert.equal(document.status, 200);
  assert.ok((await document.text()).includes(build), 'Production must serve the tested application bundle');
  assert.ok(document.headers.get('content-security-policy')?.includes('wss://quarry-impact-online.quarry-impact-free.workers.dev'));
  const files = [...new Set([...bundled, 'models/quarry-cut.glb', 'models/quarry-roadside.glb', 'models/quarry-extension.glb', 'models/quarry-headwall.glb', 'models/quarry-road-approach.glb', 'models/coupe.glb', 'models/sedan.glb', 'models/hatch.glb', 'multiplayer.json', 'assets/scree_diff.jpg', 'assets/scree_nor_gl.jpg', 'assets/scree_rough.jpg', 'assets/arena-floor-mask.rgba.gz', ...forestAssets.map(asset => asset.file)])];
  for (const file of files) {
    const response = await fetch(new URL(file, base), { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, file);
    const remote = Buffer.from(await response.arrayBuffer()), local = await fs.readFile(path.join('dist', file));
    assert.equal(hash(remote), hash(local), `${file} must match the tested local file`);
    report.files.push({ path: file, bytes: remote.length, sha256: hash(remote) });
    const forest = forestAssets.find(asset => asset.file === file);
    if (forest) {
      assert.equal(hash(remote), forest.sha256, `${file} live bytes must match current public source`);
      report.forestAssets.push({ ...forest, observedApplicationRequest: false, verification: 'HTTP response matches manifest, public and dist' });
    }
  }
  for (const file of [
    'games/', 'experiments/amiga-mod-player/audio/Alien_Breed_II/01_intro.mp3',
    'experiments/amiga-mod-player/mods/4-Mat/a_city_at_night.mod',
    'experiments/sid-player/sids/Ass_It/Fist_2.sid', 'ops/',
  ]) {
    const response = await fetch(new URL(file, 'https://jez237.com/'), { method: 'HEAD', signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, file);
    report.site.push({ path: file, status: response.status });
  }
  report.passed = true;
} catch (error) {
  report.error = String(error);
  process.exitCode = 1;
} finally {
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
