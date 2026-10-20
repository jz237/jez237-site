import {restoreRimWobbleBytes} from './rim-wobble-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bent-rim/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBentRimPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BentRim baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBentRimBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRimWobbleBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBentRimPrevious(file);
}
export function verifyBentRimRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ee785f1cd73f03f4322670277558c0bfdf0fa222');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRimWobbleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBentRimBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRimWobbleBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BentRim release');
 assert.equal(manifest.previousFixtureCount,5334);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5334);
}
