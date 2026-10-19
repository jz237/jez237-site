import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { migratedMediaResponse } from '../shared/media-redirects.mjs';

const manifest = JSON.parse(fs.readFileSync(new URL('../media-r2-manifest.json', import.meta.url)));
test('all catalog tracks are in the verified R2 manifest', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../experiments/amiga-mod-player/tracks.js', import.meta.url), 'utf8'), context);
  const paths = new Set(manifest.objects.map(o => o.path));
  assert.equal(context.window.AMIGA_MOD_LIBRARY.length, 1123);
  for (const track of context.window.AMIGA_MOD_LIBRARY) {
    assert.ok(paths.has('experiments/amiga-mod-player/' + track.path), track.path);
  }
});
test('old public URLs redirect to exact objects without losing query strings', () => {
  for (const object of manifest.objects) {
    const response = migratedMediaResponse(new Request('https://jez237.com/' + encodeURI(object.path) + '?download=1'));
    assert.ok(response, `Missing media redirect for ${object.path}`);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), object.url + '?download=1');
    assert.match(object.sha256, /^[a-f0-9]{64}$/);
  }
});
test('unknown, malformed and non-read requests do not redirect', () => {
  for (const path of ['/index.html', '/multimedia/unknown.mp4', '/%E0%A4%A', '/__proto__']) {
    assert.equal(migratedMediaResponse(new Request('https://jez237.com' + path)), null);
  }
  assert.equal(migratedMediaResponse(new Request('https://jez237.com/' + manifest.objects[0].path, { method: 'POST' })), null);
});
test('both fetch audio and video are allowed by site CSP', () => {
  const headers = fs.readFileSync(new URL('../_headers', import.meta.url), 'utf8');
  assert.match(headers, /connect-src[^;]*https:\/\/media\.jez237\.com/);
  assert.match(headers, /media-src[^;]*https:\/\/media\.jez237\.com/);
});
