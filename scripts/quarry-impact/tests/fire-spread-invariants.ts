import {restoreExhaustCrushBytes} from './exhaust-crush-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fire-spread/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFireSpreadPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FireSpread baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFireSpreadBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreExhaustCrushBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFireSpreadPrevious(file);
}
export function verifyFireSpreadRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'bdd989db6c1a8045b9f6927d6418d8d0ac5cf354');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreExhaustCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFireSpreadBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreExhaustCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FireSpread release');
 assert.equal(manifest.previousFixtureCount,7328);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7328);
}
