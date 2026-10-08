import {restoreHarrowBytes,verifyHarrowRevision} from './harrow-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/setup-benchmark/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSetupBenchmarkPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SetupBenchmark baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSetupBenchmarkBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHarrowBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSetupBenchmarkPrevious(file);
}
export function verifySetupBenchmarkRevision(){
 verifyHarrowRevision();
 const manifest=revision();assert.equal(manifest.baseline,'c7ff90ff699b08f41b4f05b2d517d63134cda105');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHarrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSetupBenchmarkBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHarrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SetupBenchmark release');
 assert.equal(manifest.previousFixtureCount,1221);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1221);
}
