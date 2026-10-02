import test from 'node:test';
import assert from 'node:assert/strict';
import { outageTiles, outagePaths, outagePoint, compactOutage, readOutages, onRequest }
  from '../../../functions/demos/philadelphia-relief/peco-outages.js';

const state = { data: { interval_generation_data: 'data/1957a8a0-ba9d-49b1-a1e7-b54934af8543',
  cluster_interval_generation_data: 'cluster-data/{qkh}/55935caa-7d50-44b8-829a-d9e82d052f99/1957a8a0-ba9d-49b1-a1e7-b54934af8543' } };
const row = () => ({ id: '10-0', geom: { p: ['aadsFdmkmM'] }, desc: { n_out: 1,
  cust_a: { val: 4, mask: 5 }, crew_status: { 'EN-US': 'Crew Dispatched' },
  cause: { 'EN-US': 'Under Evaluation' }, etr: 'ETR-NULL', cluster: false } });
const summary = () => ({ summaryFileData: { date_generated: new Date().toISOString(),
  totals: [{ total_outages: 1, total_cust_a: { val: 4 } }] } });

test('PECO requests a fixed bounded regional tile set with safe publication paths', () => {
  assert.equal(outageTiles().length, 16); assert.equal(new Set(outageTiles()).size, 16);
  assert.ok(outageTiles().every(q => /^[0-3]{10}$/.test(q)));
  assert.match(outagePaths(state).tile('0320101022'), /cluster-data\/220\//);
  assert.throws(() => outagePaths({ data: { ...state.data, interval_generation_data: '//evil.test/a' } }));
  assert.throws(() => outagePaths({ data: { ...state.data, cluster_interval_generation_data: 'cluster-data/{qkh}/../../private' } }));
});

test('outage points retain approximate geography, masking, missing estimates and stable identity', () => {
  assert.deepEqual(outagePoint('aadsFdmkmM'), { lat: 40.00289, lon: -75.75779 });
  for (const bad of ['', '~', '\0', 'aadsFdmkmM?', 'x'.repeat(100)]) assert.equal(outagePoint(bad), null);
  const r = row(), out = compactOutage(r, 'tile');
  assert.equal(out.customers, null); assert.equal(out.customersLabel, 'Fewer than 5');
  assert.equal(out.restoration, null); assert.equal(out.crew, 'Crew Dispatched');
  r.id = '10-99'; assert.equal(compactOutage(r, 'tile').id, out.id);
  r.desc.cust_a = { val: 100 }; r.desc.cluster = true; r.desc.n_out = 3;
  r.desc.etr = '2026-10-02T05:00:00Z';
  const group = compactOutage(r, 'tile'); assert.equal(group.customers, 100);
  assert.equal(group.outages, 3); assert.equal(group.grouped, true);
  assert.equal(group.restoration, '2026-10-02T05:00:00.000Z');
  assert.equal(compactOutage({ ...r, geom: { p: ['??'] } }, 'tile'), null);
  assert.throws(() => compactOutage({ ...r, desc: {} }, 'tile'));
});

test('public PECO feed treats only tile 404s as empty and never presents a partial download as complete', async t => {
  let failure = false, calls = 0;
  t.mock.method(globalThis, 'fetch', async url => {
    calls++;
    if (url.includes('currentState')) return Response.json(state);
    if (url.includes('summary-1')) return Response.json(summary());
    if (url.endsWith('/0320101022.json')) return Response.json({ file_data: [row()] });
    return new Response('', { status: failure ? 503 : 404 });
  });
  const result = await readOutages();
  assert.equal(calls, 18); assert.equal(result.outages.length, 1);
  assert.equal(result.serviceTotals.customers, 4);
  failure = true; await assert.rejects(readOutages());
});

test('invalid, paused, expired and oversized PECO publications fail instead of showing zero outages', async t => {
  let mode = 'expired';
  t.mock.method(globalThis, 'fetch', async url => {
    if (url.includes('currentState')) return Response.json(state);
    const doc = summary();
    if (mode === 'expired') doc.summaryFileData.date_generated = '2020-01-01T00:00:00Z';
    if (mode === 'paused') doc.summaryFileData.page_mode = { pausePublish: true };
    if (mode === 'invalid') doc.summaryFileData.totals = [];
    if (mode === 'oversized') return new Response(' '.repeat(524289));
    return Response.json(doc);
  });
  for (mode of ['expired', 'paused', 'invalid', 'oversized']) await assert.rejects(readOutages());
});

test('PECO route rejects writes and caches only successful snapshots under a fixed key', async t => {
  const old = globalThis.caches; let puts = 0, gets = 0;
  globalThis.caches = { default: { match: async key => { gets++; assert.ok(key.url.endsWith('?v=1')); },
    put: async () => { puts++; } } };
  t.after(() => { globalThis.caches = old; });
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  const context = method => ({ request: new Request('https://example.test/peco-outages?url=https://evil.test', { method }), waitUntil() {} });
  assert.equal((await onRequest(context('POST'))).status, 405); assert.equal(gets, 0);
  const failed = await onRequest(context('GET'));
  assert.equal(failed.status, 503); assert.equal(puts, 0);
  assert.equal(failed.headers.get('Cache-Control'), 'no-store');
  assert.equal((await failed.json()).outages, undefined);
});
