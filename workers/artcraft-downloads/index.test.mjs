import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.mjs';
const path = `/software-downloads/photocraft/${'a'.repeat(64)}/PhotoCraft-0.3.0-Setup-x64.exe`;
test('streams only the scoped EXE with attachment/noindex headers', async () => {
  let key;
  const response = await worker.fetch(new Request('https://jez237.com' + path), {INSTALLERS: {get: async k => {key=k; return {size:3,httpEtag:'"abc"',body:new Blob(['exe']).stream()};}}});
  assert.equal(key, path.slice(1)); assert.equal(await response.text(), 'exe');
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(response.headers.get('Content-Disposition'), /^attachment;/);
});
test('rejects directory listing, unrelated objects, mismatched app, other hosts and writes', async () => {
  const env={INSTALLERS:{get:()=>{throw Error('must not read storage');}}};
  for (const url of ['https://jez237.com/software-downloads/', 'https://jez237.com/photos/cats/x.jpg', 'https://elsewhere.test'+path, 'https://jez237.com'+path.replace('/photocraft/','/vectorcraft/')]) {
    const r=await worker.fetch(new Request(url),env); assert.equal(r.status,404);assert.match(r.headers.get('X-Robots-Tag'),/noindex/);
  }
  assert.equal((await worker.fetch(new Request('https://jez237.com'+path,{method:'PUT'}),env)).status,405);
});
test('HEAD reads metadata only; missing and storage failure remain noindex', async () => {
  const r=await worker.fetch(new Request('https://jez237.com'+path,{method:'HEAD'}),{INSTALLERS:{head:async()=>({size:3,httpEtag:'"abc"'})}});
  assert.equal(await r.text(),'');assert.equal(r.headers.get('Content-Length'),'3');
  const missing=await worker.fetch(new Request('https://jez237.com'+path),{INSTALLERS:{get:async()=>null}});assert.equal(missing.status,404);
  const failed=await worker.fetch(new Request('https://jez237.com'+path),{INSTALLERS:{get:async()=>{throw Error('offline');}}});assert.equal(failed.status,503);assert.match(failed.headers.get('X-Robots-Tag'),/noindex/);
});

test('serves SignForge with its own path and preserves app matching', async () => {
 const url='https://jez237.com/software-downloads/signforge/'+ 'b'.repeat(64) + '/SignForge-1.138.0-Setup-x64.exe';
 const env={INSTALLERS:{head:async()=>({size:123,httpEtag:'abc'})}};
 assert.equal((await worker.fetch(new Request(url,{method:'HEAD'}),env)).status,200);
 assert.equal((await worker.fetch(new Request(url.replace('/signforge/','/photocraft/'),{method:'HEAD'}),env)).status,404);
});
