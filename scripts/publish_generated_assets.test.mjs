import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishGeneratedAssets, validateBundlePaths} from './publish_generated_assets.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'publish-bundles-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const source = join(root, 'build'), target = join(root, 'site');
  for (const dir of [source, target]) mkdirSync(join(dir, 'assets'), {recursive: true});
  writeFileSync(join(source, 'index.html'), '<script src="./assets/new.js"></script>');
  writeFileSync(join(source, 'assets/new.js'), 'import("./lazy.js")');
  writeFileSync(join(source, 'assets/lazy.js'), 'export default 1');
  for (const file of ['current.js', 'previous.js', 'manual.js', 'model.glb']) writeFileSync(join(target, 'assets', file), file);
  writeFileSync(join(target, 'generated-bundles.json'), JSON.stringify({version: 1, current: ['assets/current.js'], previous: ['assets/previous.js']}));
  return {source, target};
}
test('preserves previous release, lazy chunks, unknown assets and models; retires only owned old build', t => {
  const {source, target} = fixture(t);
  assert.deepEqual(publishGeneratedAssets(source, target).retired, ['assets/previous.js']);
  for (const f of ['new.js', 'lazy.js', 'current.js', 'manual.js', 'model.glb']) assert.ok(existsSync(join(target, 'assets', f)));
  assert.ok(!existsSync(join(target, 'assets/previous.js')));
  assert.deepEqual(publishGeneratedAssets(source, target).retired, []);
  assert.deepEqual(JSON.parse(readFileSync(join(target, 'generated-bundles.json'))).previous, ['assets/current.js']);
});
test('refuses missing manifest without changing target', t => {
  const {source, target} = fixture(t); rmSync(join(target, 'generated-bundles.json'));
  assert.throws(() => publishGeneratedAssets(source, target), /Missing reviewed/);
  assert.ok(!existsSync(join(target, 'assets/new.js')));
});
test('refuses traversal, non-bundle ownership, malformed and missing retained files', t => {
  for (const p of ['assets/../../README.md', '/assets/a.js', 'assets/a.glb', 'assets/../a.js']) assert.throws(() => validateBundlePaths([p]));
  assert.throws(() => validateBundlePaths(null));
  const {source, target} = fixture(t); rmSync(join(target, 'assets/current.js'));
  assert.throws(() => publishGeneratedAssets(source, target), /Missing or nonregular/);
  assert.ok(!existsSync(join(target, 'assets/new.js')));
});
