import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {resolve} from 'node:path';
import {checkOpenSeaLive,checkOceanSnapshot} from '../../check_open_sea_live.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const mock=change=>async url=>{
 const path=url.pathname.slice(1);let bytes=readFileSync(resolve(repo,path));
 bytes=change(path,bytes);return new Response(bytes,{status:200});
};
test('complete matching ocean release passes',async()=>{
 checkOceanSnapshot(repo,repo);
 await checkOpenSeaLive('https://example.test/',repo,mock((_,b)=>b));
});
test('old entry is rejected even with a successful HTTP response',async()=>{
 await assert.rejects(checkOpenSeaLive('https://example.test/',repo,mock((p,b)=>p.endsWith('index.html')?Buffer.from(b.toString().replaceAll('sailview-20260930','detail-20260930')):b)),/older or mixed release/);
});
test('old yacht shader is rejected even with the current entry',async()=>{
 await assert.rejects(checkOpenSeaLive('https://example.test/',repo,mock((p,b)=>p.endsWith('/yacht.js')?Buffer.from('// previous shader'):b)),/asset differs/);
});
test('old yacht mesh is rejected even with the current modules',async()=>{
 await assert.rejects(checkOpenSeaLive('https://example.test/',repo,mock((p,b)=>p.endsWith('.bin.gz')?b.subarray(0,b.length-1):b)),/asset differs/);
});
