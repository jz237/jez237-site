import test from 'node:test';
import assert from 'node:assert/strict';
import { createTileStream, planImageryTiles, zoomAhead } from '../src/imagery-tiles.js';
import { createImageryCache, createTileLoader, tileImageUrl } from '../src/tile-cache.js';

const region = { west:-75.8, east:-74.7, south:39.7, north:40.55 };
const projection = { metersPerDegLon:85220, metersPerDegLat:111033 };
const pose = { lon:-75.1677, lat:39.9278, dist:300, bearing:.8, pitch:35, fov:42 };
const settle = () => new Promise(r => setImmediate(r));
function harness(options = {}) {
  let time = 0;
  const requests = [], installed = [];
  const stream = createTileStream({region, projection, now:() => time,
    install:e => installed.push(e), remove(){}, ...options,
    load(cell,size,signal,options) {
      return new Promise((resolve,reject) => requests.push({cell,size,signal,options,resolve,reject}));
    }});
  return {stream, requests, installed, advance:ms => { time += ms; },
    consider:(p = pose, mode = 'standard') => stream.consider(p,true,1700,1,'balanced',mode,1000)};
}

test('central full detail starts before outstanding peripheral previews', async () => {
  const h = harness(); h.consider();
  const first = h.requests[0];
  h.advance(500); first.resolve({image:{},source:'survey'}); await settle();
  assert.ok(h.requests.some(r => r.cell.key === first.cell.key && r.size === 2048));
  assert.equal(h.requests[2].signal.aborted,false,'Peripheral preview can continue');
  h.stream.dispose();
});

test('network adaptation increases throughput while retaining the original full resolution', async () => {
  const h = harness(); h.consider();
  const expected = planImageryTiles(pose,region,projection,1.7).visible;
  for (let i=0;i<100;i++) {
    const next = h.requests.find(r => !r.done && !r.signal.aborted);
    if (!next) break;
    next.done = true; h.advance(80); next.resolve({image:{},source:'survey'}); await settle();
    assert.ok(h.stream.stats().pending <= 6);
  }
  assert.ok(h.stream.stats().concurrency > 3);
  for (const c of expected) assert.ok(h.installed.some(e => e.cell.key === c.key && e.size === 2048));
  assert.equal(h.stream.stats().state,'active'); h.stream.dispose();
});

test('slow peripheral work does not occupy every central refinement slot', async () => {
  const h = harness(); h.consider();
  const first = h.requests[0];
  h.advance(6000); first.resolve({image:{},source:'survey'}); await settle();
  assert.equal(h.stream.stats().concurrency,2,'Slow connection lowers ordinary concurrency');
  assert.ok(h.requests.some(r => r.cell.key === first.cell.key && r.size === 2048));
  assert.ok(h.stream.stats().pending <= 3,'Only one bounded rescue slot');
  h.stream.dispose();
});

test('zoom prediction prepares the next detail level without replacing visible coverage', async () => {
  const before = {...pose,dist:900,pitch:0}, next = {...before,dist:650};
  const visible = planImageryTiles(next,region,projection,1.7).visible;
  const predicted = zoomAhead(next,before,region,projection,1.7,'standard',visible);
  assert.ok(predicted.length > 0 && predicted.length <= 2);
  assert.ok(predicted.every(c => c.level < Math.min(...visible.map(v => v.level))));
  const h = harness(); h.consider(before); h.consider(next);
  const expected = new Set(visible.map(c => c.key));
  let preparation;
  for (let i=0;i<50;i++) {
    preparation = h.requests.find(r => predicted.some(c => c.key === r.cell.key) && !r.signal.aborted);
    if (preparation) break;
    const request = h.requests.find(r => !r.done && !r.signal.aborted);
    assert.ok(request); request.done = true; h.advance(100);
    request.resolve({image:{},source:'survey'}); await settle();
  }
  assert.ok(preparation); assert.equal(preparation.size,2048);
  assert.ok(h.requests.some(r => expected.has(r.cell.key) && !r.done && !r.signal.aborted),
    'Zoom preparation starts while visible work continues');
  const key = preparation.cell.key;
  preparation.done = true; preparation.resolve({image:{},source:'survey'}); await settle();
  const count = h.requests.filter(r => r.cell.key === key).length;
  h.consider({...next,dist:422});
  assert.equal(h.requests.filter(r => r.cell.key === key).length,count,'Prepared detail is reused');
  h.stream.dispose();
});

test('data saver and limited connections disable speculation without changing standard detail size', async () => {
  const h = harness({connection:() => ({saveData:true,effectiveType:'4g'})});
  h.consider({...pose,dist:900,pitch:0}); h.consider({...pose,dist:650,pitch:0});
  assert.ok(h.stream.stats().pending <= 2);
  for (let i=0;i<40;i++) {
    const r = h.requests.find(r => !r.done && !r.signal.aborted); if (!r) break;
    r.done = true; r.resolve({image:{},source:'survey'}); await settle();
    assert.ok(h.stream.stats().pending <= 2);
  }
  assert.ok(h.installed.some(e => e.size === 2048)); h.stream.dispose();
  const visible = planImageryTiles(pose,region,projection,1.7,'data').visible;
  assert.deepEqual(zoomAhead(pose,{...pose,dist:900},region,projection,1.7,'data',visible),[]);
});

test('nearly completed nearby downloads survive a pan, but expire and never survive a far jump', async () => {
  const h = harness(); h.consider();
  const first = h.requests[0], moved = {...pose,lon:pose.lon+.007};
  assert.ok(!planImageryTiles(moved,region,projection,1.7).visible.some(c => c.key === first.cell.key));
  h.advance(1000); first.options.progress({loaded:80,total:100,complete:false}); h.consider(moved);
  assert.equal(first.signal.aborted,false,'Keep the useful 80-percent-complete download');
  first.resolve({image:{},source:'survey'}); await settle();
  assert.ok(h.installed.some(e => e.cell.key === first.cell.key));
  h.consider({...pose,lon:-74.9});
  assert.ok(h.requests.slice(0,3).every(r => r.signal.aborted || r === first));
  h.stream.dispose();
  const expiring = harness(); expiring.consider();
  const r = expiring.requests[0]; r.options.progress({loaded:80,total:100});
  expiring.advance(1000); expiring.consider(moved); assert.equal(r.signal.aborted,false);
  expiring.advance(1600); expiring.consider(moved); assert.equal(r.signal.aborted,true);
  expiring.stream.dispose();
});

function memoryStorage() {
  const responses = new Map();
  const key = r => typeof r === 'string' ? r : r.url;
  return {responses, open:async () => ({
    match:async r => responses.get(key(r))?.clone(),
    put:async (r,response) => responses.set(key(r),response.clone()),
    delete:async r => responses.delete(key(r)),
    keys:async () => [...responses.keys()].map(url => new Request(url)),
  })};
}
const headers = {'Content-Type':'image/jpeg','Cache-Control':'public, max-age=300',
  'X-Imagery-Source':'Verified survey source'};

test('persistent image cache preserves exact bytes and credit across loader instances', async () => {
  const storage = memoryStorage(), bytes = new Uint8Array([255,216,0,44,255,217]);
  const makeCache = () => createImageryCache({storage:() => storage,base:() => 'https://example.test/map/'});
  const cache = makeCache(), cell = planImageryTiles(pose,region,projection,1.7).visible[0];
  let downloads = 0;
  const request = async () => { downloads++; return new Response(bytes,{headers}); };
  const decode = async blob => new Uint8Array(await blob.arrayBuffer());
  const signal = new AbortController().signal;
  await createTileLoader({cache,request,decode})(cell,2048,signal,{maxSize:2048});
  await cache.settled();
  const second = await createTileLoader({cache:makeCache(),request,decode})(cell,512,signal,{maxSize:2048});
  assert.equal(downloads,1); assert.equal(second.cached,true); assert.equal(second.size,2048);
  assert.deepEqual(second.image,bytes); assert.equal(second.source,headers['X-Imagery-Source']);
});

test('persistent cache enforces byte/count bounds and source expiry', async () => {
  const storage = memoryStorage(); let time = 1000;
  const cache = createImageryCache({storage:() => storage,base:() => 'https://example.test/',
    now:() => time,maxBytes:9,maxEntries:2});
  for (const name of ['a','b','c']) { await cache.put(name,new Blob(['1234']),headers); time++; }
  assert.equal(storage.responses.size,2); assert.equal(await cache.get('a'),null);
  assert.ok(await cache.get('c'));
  await cache.put('oversize',new Blob(['1234567890']),headers); assert.equal(storage.responses.size,2);
  time += 300001; assert.equal(await cache.get('c'),null);
});

test('disk caching honors upstream age and no-store instead of extending source freshness', async () => {
  const storage = memoryStorage(); let time = 1000000;
  const cache = createImageryCache({storage:() => storage,base:() => 'https://example.test/',now:() => time});
  await cache.put('old',new Blob(['old']),{...headers,Age:'299'});
  assert.ok(await cache.get('old')); time += 1100; assert.equal(await cache.get('old'),null);
  await cache.put('private',new Blob(['private']),{'Cache-Control':'no-store'});
  assert.equal(await cache.get('private'),null);
});

test('image loader reports real transfer progress and preserves bytes through decoding', async () => {
  const events = [], bytes = new Uint8Array([1,2,3,4]);
  const body = new ReadableStream({start(controller) {
    controller.enqueue(bytes.slice(0,2)); controller.enqueue(bytes.slice(2)); controller.close();
  }});
  const loader = createTileLoader({cache:{get:async () => null,put:async () => {}},
    request:async () => new Response(body,{headers:{...headers,'Content-Length':'4'}}),
    decode:async blob => new Uint8Array(await blob.arrayBuffer())});
  const cell = planImageryTiles(pose,region,projection,1.7).visible[0];
  const result = await loader(cell,2048,new AbortController().signal,{progress:p => events.push(p)});
  assert.deepEqual(result.image,bytes);
  assert.deepEqual(events.map(p => p.loaded),[2,4,4]); assert.equal(events.at(-1).complete,true);
});

test('unavailable browser storage and corrupt cached data fall back to the original network response', async () => {
  const cell = planImageryTiles(pose,region,projection,1.7).visible[0];
  const denied = createImageryCache({storage:() => {throw Error('Storage denied');}});
  let downloads = 0;
  const loader = createTileLoader({cache:denied,decode:blob => blob.text(),
    request:async () => {downloads++; return new Response('original',{headers});}});
  assert.equal((await loader(cell,2048,new AbortController().signal)).image,'original');
  await denied.settled(); assert.equal(downloads,1);
  const corrupt = createTileLoader({cache:{get:async () => new Response('bad'),put:async () => {}},
    decode:async blob => {const value=await blob.text();if(value==='bad')throw Error('Invalid image');return value;},
    request:async () => new Response('original',{headers})});
  assert.equal((await corrupt(cell,512,new AbortController().signal)).image,'original');
});

test('cached full detail is installed at its real resolution and never downloaded again as a preview', async () => {
  const installed = [], calls = [];
  const stream = createTileStream({region,projection,install:e => installed.push(e),remove(){},
    load:async (cell,size) => {calls.push([cell.key,size]);return {image:{},source:'survey',size:2048,cached:true};}});
  stream.consider(pose,true,1700,1,'balanced','standard',1000); await settle();
  assert.ok(installed.every(e => e.size === 2048));
  assert.equal(new Set(calls.map(c => c[0])).size,calls.length);
  assert.equal(stream.stats().concurrency,3,'Disk hits do not inflate network concurrency'); stream.dispose();
});
