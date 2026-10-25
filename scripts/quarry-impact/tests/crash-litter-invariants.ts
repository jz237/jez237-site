import {restorePaintChipsBytes} from './paint-chips-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crash-litter/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrashLitterPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrashLitter baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrashLitterBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePaintChipsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrashLitterPrevious(file);
}
export function verifyCrashLitterRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'901681275034befe6026e8de583c197d7ff2427b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePaintChipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrashLitterBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePaintChipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrashLitter release');
 assert.equal(manifest.previousFixtureCount,7633);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7633);
}
