import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WEBCAMS, trafficCameras, regionalCameras, hasCameraPreview,
  groupCameras, popupPosition } from '../src/camera-data.js';
import { onRequest } from '../../../functions/demos/philadelphia-relief/_middleware.js';

test('camera catalog only exposes bounded public locations and published preview widgets', async () => {
  const doc = JSON.parse(await readFile(new URL('../data/camera-locations.json', import.meta.url)));
  const traffic = trafficCameras(doc);
  assert.equal(traffic.length, 569);
  assert.equal(new Set(traffic.map(p => p.id)).size, traffic.length);
  assert.ok(!JSON.stringify(doc).includes('.lcl'));
  for (const p of [...WEBCAMS, ...traffic]) {
    assert.ok(p.lon >= -75.8 && p.lon <= -74.7 && p.lat >= 39.7 && p.lat <= 40.55);
    assert.equal(new URL(p.url).protocol, 'https:');
    if (p.traffic) {
      assert.match(p.id, /^\d+$/);
      assert.equal(p.url, `https://511pa.com/map#camera-${p.id}`);
      assert.ok(p.name.trim());
    }
    if (p.preview) {
      const u = new URL(p.preview);
      assert.equal(u.origin, 'https://api.wetmet.net');
      assert.equal(u.pathname, '/widgets/image/frame.php');
      assert.match(u.searchParams.get('uid'), /^[a-f0-9]{32}$/);
    }
  }
  const sample = traffic[0];
  assert.equal(trafficCameras({ cameras: [sample, sample, { ...sample, id: 'outside', lat: 90 }] }).length, 1);
  assert.equal(trafficCameras({ cameras: [
    { ...sample, id: 'CAM-06-271' }, { ...sample, id: '3215?other' },
    { ...sample, name: '' }, { ...sample, lon: NaN },
  ] }).length, 0);
  assert.equal(traffic.find(p => p.id === '3215').name, 'US-1 SOUTH OF I-295');
});

test('camera clustering preserves every location and separates preview from traffic-only markers', () => {
  const points = Array.from({ length: 550 }, (_, i) => ({ x: i % 32 * 8, y: Math.floor(i / 32) * 6,
    item: { id: String(i), traffic: i > 9 } }));
  const groups = groupCameras(points);
  assert.ok(groups.length < points.length / 10);
  assert.equal(groups.flatMap(g => g.items).length, points.length);
  assert.equal(new Set(groups.flatMap(g => g.items.map(p => p.id))).size, points.length);
  for (const g of groups) assert.ok(g.items.every(p => !!p.traffic === g.traffic));
  assert.equal(groupCameras([{ x: 1, y: 1, item: { id: 'a' } },
    { x: 200, y: 1, item: { id: 'b' } }]).length, 2);
});

test('camera preview placement stays inside desktop and phone screens at every corner', () => {
  for (const [w, h, cw, ch] of [[1280, 800, 344, 430], [390, 844, 344, 430], [667, 375, 344, 351]]) {
    for (const x of [0, w / 2, w]) for (const y of [0, h / 2, h]) {
      const p = popupPosition(x, y, w, h, cw, ch);
      assert.ok(p.left >= 8 && p.top >= 8);
      assert.ok(p.left + cw <= w - 8 && p.top + ch <= h - 8);
    }
  }
});

test('regional camera policy adds only the widget frame host and preserves photographic restrictions', async () => {
  const result = await onRequest({ next: async () => new Response('map') });
  const csp = result.headers.get('Content-Security-Policy');
  assert.ok(csp.includes("frame-src 'self' https://api.wetmet.net https://attheshore.com https://www.attheshore.com;"));
  assert.ok(csp.includes("media-src 'self' blob: https://video.deldot.gov"));
  assert.ok(csp.includes("img-src 'self' https://api.igotview.com"));
  assert.ok(csp.includes("frame-ancestors 'self'"));
  assert.ok(csp.includes("object-src 'none'"));
  assert.ok(!csp.split(';').find(s => s.includes('script-src')).includes('wetmet'));
  assert.ok(!csp.split(';').find(s => s.includes('script-src')).includes('attheshore'));
});

test('additional cameras have exact provider identities, bounded locations and safe media URLs', async () => {
  const doc = JSON.parse(await readFile(new URL('../data/regional-cameras.json', import.meta.url)));
  const cams = regionalCameras(doc);
  assert.equal(cams.length, 147);
  assert.equal(cams.filter(p => p.provider === 'DelDOT').length, 93);
  assert.equal(cams.filter(p => p.snapshot).length, 54);
  assert.equal(cams.filter(hasCameraPreview).length, 147);
  assert.equal(new Set(cams.map(p => p.id)).size, 147);
  assert.ok(!JSON.stringify(doc).includes('wowzatoken'));
  const de = doc.cameras.find(p => p.source === 'deldot');
  const ats = doc.cameras.find(p => p.source === 'attheshore');
  assert.equal(regionalCameras({cameras: [de, de, {...de, stream: 'https://evil.test/camera'}]}).length, 1);
  for (const bad of [{...de, lon: NaN}, {...de, lat: 90}, {...ats, url: 'javascript:alert(1)'},
    {...ats, snapshot: 'https://evil.test/image.jpg'}]) {
    assert.deepEqual(regionalCameras({cameras: [bad]}), []);
  }
  assert.equal(regionalCameras({cameras: [{...ats, player: 'https://evil.test/player'}]})[0].player, undefined);
  assert.equal(regionalCameras({cameras: [{...de, enabled: false}]})[0].stream, undefined);
  assert.equal(new URL(cams.find(p => p.stream).url, 'https://jez237.com/demos/philadelphia-relief/').origin,
    'https://jez237.com');
});
