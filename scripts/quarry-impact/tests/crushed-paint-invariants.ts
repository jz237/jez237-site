import {restoreImpactPaintBytes} from './impact-paint-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crushed-paint/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrushedPaintPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrushedPaint baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrushedPaintBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreImpactPaintBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrushedPaintPrevious(file);
}
export function verifyCrushedPaintRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'48e0f61e881d55581046128c6833e7a0d6094945');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreImpactPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrushedPaintBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreImpactPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrushedPaint release');
 assert.equal(manifest.previousFixtureCount,3689);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3689);
}
