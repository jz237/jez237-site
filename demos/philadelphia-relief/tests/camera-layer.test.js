import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WEBCAMS, trafficCameras, groupCameras, popupPosition } from '../src/camera-data.js';
import { onRequest } from '../../../functions/demos/philadelphia-relief/_middleware.js';

test('camera catalog only exposes bounded public locations and published preview widgets', async () => {
  const doc = JSON.parse(await readFile(new URL('../data/camera-locations.json', import.meta.url)));
  const traffic = trafficCameras(doc);
  assert.equal(traffic.length, 549);
  assert.equal(new Set(traffic.map(p => p.id)).size, traffic.length);
  assert.ok(!JSON.stringify(doc).includes('.lcl'));
  for (const p of [...WEBCAMS, ...traffic]) {
    assert.ok(p.lon >= -75.8 && p.lon <= -74.7 && p.lat >= 39.7 && p.lat <= 40.55);
    assert.equal(new URL(p.url).protocol, 'https:');
    if (p.preview) {
      const u = new URL(p.preview);
      assert.equal(u.origin, 'https://api.wetmet.net');
      assert.equal(u.pathname, '/widgets/image/frame.php');
      assert.match(u.searchParams.get('uid'), /^[a-f0-9]{32}$/);
    }
  }
  const sample = traffic[0];
  assert.equal(trafficCameras({ cameras: [sample, sample, { ...sample, id: 'outside', lat: 90 }] }).length, 1);
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
  assert.ok(csp.includes("frame-src 'self' https://api.wetmet.net;"));
  assert.ok(csp.includes("frame-ancestors 'self'"));
  assert.ok(csp.includes("object-src 'none'"));
  assert.ok(!csp.split(';').find(s => s.includes('script-src')).includes('wetmet'));
});
