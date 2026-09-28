// Shared read-only forest asset verification. The authored manifest names every
// runtime GLB/texture; browser checks observe application requests, never replace
// them with synthetic fetches. Historical baselines can explicitly opt out.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const treeManifest = 'source/models/quarry-north-firs-manifest.json';
const ridgeManifest = 'source/models/quarry-north-backdrop-manifest.json';
const floorManifest = 'source/north-forest-floor-manifest.json';
const floorFile = 'assets/north-forest-floor.rgba.gz';
const treeFiles = [0, 1, 2].map(i => `models/quarry-north-fir-${i}.glb`);

function assetPath(file) {
  assert.equal(typeof file, 'string');
  assert.match(file, /^(assets|models)\//, 'Forest files must use public-relative local paths');
  assert.ok(!file.includes('\\') && !file.includes('?') && !file.includes('#'));
  assert.equal(path.posix.normalize(file), file, 'No path traversal in asset manifests');
  return file;
}

function externalImages(bytes, file) {
  assert.equal(bytes.readUInt32LE(0), 0x46546c67, `${file} must be GLB`);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  assert.equal(bytes.readUInt32LE(16), 0x4e4f534a, 'The first GLB chunk must be JSON');
  const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString('utf8'));
  return (gltf.images ?? []).filter(image => image.uri && !image.uri.startsWith('data:')).map(image => {
    assert.ok(!/^[a-z]+:/i.test(image.uri) && !image.uri.startsWith('/'), 'Forest image must be bundled locally');
    return assetPath(path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(image.uri))));
  });
}

/** publicAssets=true additionally audits each currently authored forest file,
 * even if an accidentally stale dist omitted its integration. */
export async function forestRuntimeAssetPlan({ historical = false, publicAssets = false } = {}) {
  if (historical) return [];
  const html = await fs.readFile('dist/index.html', 'utf8');
  const modules = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.js)"/g)].map(match => match[1]);
  const code = (await Promise.all(modules.map(file => fs.readFile(path.join('dist', file), 'utf8')))).join('\n');
  const includeFloor = code.includes('north-forest-floor.rgba.gz') || publicAssets;
  const includeTrees = code.includes('quarry-north-fir-') || publicAssets;
  const includeRidge = code.includes('north-backdrop-0-albedo.png') || publicAssets;
  const records = new Map();
  if (includeFloor) {
    const manifest = JSON.parse(await fs.readFile(floorManifest, 'utf8'));
    assert.equal(manifest.file, floorFile);
    records.set(floorFile, { ...manifest, manifest: floorManifest });
    for (const record of manifest.runtimeFiles ?? []) {
      const file = assetPath(record.file), previous = records.get(file);
      if (previous) {
        assert.equal(record.bytes, previous.bytes, `${file} duplicate manifest size`);
        assert.equal(record.sha256, previous.sha256, `${file} duplicate manifest hash`);
      } else records.set(file, { ...record, manifest: floorManifest });
    }
  }
  if (includeTrees) {
    const manifest = JSON.parse(await fs.readFile(treeManifest, 'utf8'));
    assert.ok(Array.isArray(manifest.runtimeFiles) && manifest.runtimeFiles.length >= 3,
      'The authored fir manifest must enumerate all runtime files');
    for (const record of manifest.runtimeFiles) {
      const file = assetPath(record.file);
      assert.ok(!records.has(file), `Duplicate runtime forest file: ${file}`);
      records.set(file, { ...record, manifest: treeManifest });
    }
    for (const record of manifest.optionalRuntimeFiles ?? []) {
      const file = assetPath(record.file);
      assert.ok(!records.has(file), `Duplicate optional forest file: ${file}`);
      records.set(file, { ...record, manifest: treeManifest, optionalBrowserRequest: true });
    }
    for (const file of treeFiles) assert.ok(records.has(file), `Missing authored fir variant ${file}`);
  }
  if (includeRidge) {
    const manifest = JSON.parse(await fs.readFile(ridgeManifest, 'utf8'));
    assert.equal(manifest.runtimeFiles.length, 6, 'Three baked fir variants each need color and normal/depth');
    for (const record of manifest.runtimeFiles) {
      const file = assetPath(record.file);
      assert.ok(!records.has(file), `Duplicate ridge atlas ${file}`);
      records.set(file, { ...record, manifest: ridgeManifest });
    }
    for (const variant of [0, 1, 2]) for (const layer of ['albedo', 'normal-depth'])
      assert.ok(records.has(`models/north-backdrop-${variant}-${layer}.png`), 'Missing baked ridge layer');
  }
  const plan = [];
  for (const [file, record] of records) {
    assetPath(file);
    const source = await fs.readFile(path.join('public', file));
    const built = await fs.readFile(path.join('dist', file));
    const sha256 = hash(source);
    assert.equal(record.bytes, source.length, `${file} public size must match the source manifest`);
    assert.equal(record.sha256, sha256, `${file} public hash must match the source manifest`);
    assert.equal(hash(built), sha256, `${file} dist must match current public bytes`);
    if (file.endsWith('.glb')) for (const image of externalImages(source, file))
      assert.ok(records.has(image), `External texture ${image} must be present in the runtime manifest`);
    plan.push({ file, bytes: source.length, sha256, manifest: record.manifest,
      ...(record.optionalBrowserRequest ? { optionalBrowserRequest: true } : {}) });
  }
  return plan;
}

export async function observeForestRequests(page, base, plan) {
  // Chromium's default inspector resource limit is below one authored fir GLB.
  // Increase only this QA session's response cache before application loading.
  const session = await page.context().newCDPSession(page);
  await session.send('Network.enable', { maxResourceBufferSize: 64 * 1024 * 1024,
    maxTotalBufferSize: 512 * 1024 * 1024 });
  const requests = new Map(), waiting = new Map();
  session.on('Network.responseReceived', event => {
    const pending = waiting.get(event.response.url);
    if (pending) requests.set(event.requestId, { ...pending, info: event.response, resourceType: event.type });
  });
  session.on('Network.loadingFinished', async event => {
    const request = requests.get(event.requestId);
    if (!request) return;
    requests.delete(event.requestId); clearTimeout(request.timer);
    try {
      // Read from this same CDP session: Playwright's separate inspector session
      // retains its default small cache even after our Network.enable call.
      const result = await session.send('Network.getResponseBody', { requestId: event.requestId });
      const bytes = Buffer.from(result.body, result.base64Encoded ? 'base64' : 'utf8');
      request.resolve({ status: request.info.status, url: request.info.url,
        resourceType: request.resourceType.toLowerCase(), bytes: bytes.length, sha256: hash(bytes) });
    } catch (error) { request.reject(new Error(`${request.info.url}: ${error}`)); }
  });
  session.on('Network.loadingFailed', event => {
    const request = requests.get(event.requestId);
    if (request) { clearTimeout(request.timer); request.reject(new Error(`${request.info.url}: ${event.errorText}`)); }
  });
  const observations = plan.filter(asset => !asset.optionalBrowserRequest).map(asset => {
    const url = new URL(asset.file, base).href;
    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Application did not request ${url}`)), 120000);
      timer.unref(); waiting.set(url, { resolve, reject, timer });
    });
    response.catch(() => {});
    return { asset, response };
  });
  observations.release = () => session.detach();
  return observations;
}

export async function verifyForestRequests(observations, output) {
  for (const { asset, response: pending } of observations) {
    const response = await pending;
    assert.equal(response.status, 200, `${asset.file} application request`);
    assert.equal(response.bytes, asset.bytes, `${asset.file} actual response size`);
    assert.equal(response.sha256, asset.sha256, `${asset.file} actual application bytes must match public/dist`);
    output.push({ ...asset, url: response.url, observedApplicationRequest: true,
      resourceType: response.resourceType });
  }
  // Do not retain a large inspection response cache during performance capture.
  await observations.release?.();
}
