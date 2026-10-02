import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/time-trial-playability/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTimeTrialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Time Trial baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreTimeTrialPlayabilityBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTimeTrialPrevious(file);
}
export function verifyTimeTrialPlayabilityRevision():void{
 const manifest=revision();assert.equal(manifest.baseline,'004353fd1511692fd2a4564ac12d58976457fb02');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTimeTrialPlayabilityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during Time Trial playability');
 const fixtures=Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/'));
 assert.equal(manifest.previousFixtureCount,789);assert.equal(fixtures.length,789,'All earlier fixture files remain protected');
 assert.equal(hash(readTimeTrialPrevious('src/main.ts')),'61d55c9c1f6f90a7c62dd6ddcaf3dd805267099abd220019bed7cc45f1a4ad24');
}
