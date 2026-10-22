import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {onRequest,streetCell} from '../../../functions/demos/philadelphia-relief/street-detail.js';
import {snapshotDate,snapshotCells} from '../../../functions/demos/philadelphia-relief/_lib/neighborhood-snapshot.js';

const root=new URL(`../data/neighborhoods/${snapshotDate}/`,import.meta.url);
const request=(query='lon=-75.164&lat=39.949',headers={referer:'https://jez237.com/demos/philadelphia-relief/'})=>
  new Request(`https://jez237.com/demos/philadelphia-relief/street-detail?${query}`,{headers});

test('published neighborhoods are complete, bounded, attributed and match the server grid',async()=>{
  const manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
  assert.equal(manifest.date,snapshotDate);
  assert.deepEqual([...snapshotCells].sort(),Object.keys(manifest.cells).sort());
  for(const [key,entry] of Object.entries(manifest.cells)){
    const body=await readFile(new URL(entry.file,root));
    assert.equal(body.length,entry.bytes);
    assert.equal(createHash('sha256').update(body).digest('hex'),entry.sha256);
    assert.ok(body.length<8*1024*1024);
    const doc=JSON.parse(body);
    assert.equal(doc.key,key);assert.equal(doc.snapshotDate,snapshotDate);
    assert.equal(doc.source,'OpenStreetMap contributors · ODbL 1.0');
    assert.equal(doc.elements.length,entry.elements);assert.ok(doc.elements.length<=6000);
    const cell=streetCell(new URLSearchParams({lon:doc.lon,lat:doc.lat}));
    assert.equal(cell.key,key);
    for(const edge of Object.keys(cell.bounds))assert.ok(Math.abs(cell.bounds[edge]-doc.bounds[edge])<1e-9);
    const ids=new Set();
    for(const e of doc.elements){
      assert.ok(!ids.has(`${e.type}/${e.id}`));ids.add(`${e.type}/${e.id}`);
      assert.equal(e.user,undefined);assert.equal(e.uid,undefined);
      const points=e.type==='node'?[[e.lon,e.lat]]:e.geometry;
      assert.ok(points.length>0&&points.length<=1200);
      assert.ok(points.every(p=>p.length===2&&p.every(Number.isFinite)));
    }
  }
});

test('covered neighborhoods stream the published asset without contacting a provider',async t=>{
  t.mock.method(globalThis,'fetch',()=>assert.fail('A snapshot must not contact Overpass'));
  let assetUrl;
  const env={ASSETS:{fetch:async url=>{
    assetUrl=url;
    return new Response(await readFile(new URL(url.pathname.split('/').at(-1),root)),
      {headers:{'Content-Type':'application/json','ETag':'test-snapshot'}});
  }}};
  const response=await onRequest({request:request(),env});
  assert.equal(response.status,200);
  assert.equal(response.headers.get('X-Neighborhood-Source'),`snapshot-${snapshotDate}`);
  assert.equal(response.headers.get('ETag'),'test-snapshot');
  assert.equal(assetUrl.origin,'https://jez237.com');
  assert.equal(assetUrl.search,'');
  const doc=await response.json();
  assert.equal(doc.key,'-75.1640,39.9490');assert.ok(doc.elements.some(e=>e.tags?.building));
});

test('missing or HTML snapshot responses fall back without caching the wrong asset',async t=>{
  const oldCaches=globalThis.caches;
  globalThis.caches={default:{match:async()=>null,put:async()=>{}}};
  t.after(()=>{globalThis.caches=oldCaches;});
  let calls=0;
  t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({elements:[]});});
  for(const status of [200,404]){
    const tasks=[];
    const env={ASSETS:{fetch:async()=>new Response('<html>Not a map</html>',{status,headers:{'Content-Type':'text/html'}})}};
    const response=await onRequest({request:request(),env,waitUntil:p=>tasks.push(p)});
    await Promise.all(tasks);
    assert.equal(response.status,200);assert.deepEqual((await response.json()).elements,[]);
    assert.equal(response.headers.get('X-Neighborhood-Source'),null);
  }
  assert.equal(calls,2);
});

test('snapshot lookup preserves the same-origin and bounded-coordinate restrictions',async()=>{
  const env={ASSETS:{fetch:()=>assert.fail('Invalid requests must not reach assets')}};
  for(const [req,status] of [[request('lon=-75.164&lat=39.949',{}),403],
    [request('lon=-75.164&lat=39.949',{origin:'https://other.test'}),403],
    [request('lon=-180&lat=0'),400],[request(''),400]]){
    assert.equal((await onRequest({request:req,env})).status,status);
  }
});
