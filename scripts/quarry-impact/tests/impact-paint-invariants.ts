import {restoreRookvaleFreightBytes} from './rookvale-freight-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/impact-paint/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readImpactPaintPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ImpactPaint baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreImpactPaintBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleFreightBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readImpactPaintPrevious(file);
}
export function verifyImpactPaintRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a77bfae0a608a1514efffbc83f7395c1bc91e6de');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleFreightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreImpactPaintBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleFreightBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ImpactPaint release');
 assert.equal(manifest.previousFixtureCount,3699);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3699);
}
