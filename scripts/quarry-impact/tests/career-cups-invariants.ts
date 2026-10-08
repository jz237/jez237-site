import {restoreSetupBenchmarkBytes,verifySetupBenchmarkRevision} from './setup-benchmark-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/career-cups/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCareerCupsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CareerCups baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCareerCupsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSetupBenchmarkBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCareerCupsPrevious(file);
}
export function verifyCareerCupsRevision(){
 verifySetupBenchmarkRevision();
 const manifest=revision();assert.equal(manifest.baseline,'e5e3059bbc4fd4584dfc5ef04e8d77eabc644efe');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSetupBenchmarkBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCareerCupsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSetupBenchmarkBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CareerCups release');
 assert.equal(manifest.previousFixtureCount,1205);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1205);
}
