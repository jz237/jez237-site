import {restoreDerbyFlagBytes} from './derby-flag-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/paint-chips/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPaintChipsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PaintChips baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePaintChipsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDerbyFlagBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPaintChipsPrevious(file);
}
export function verifyPaintChipsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0774b00d789a2906d90c3a59720a843c48576eb2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDerbyFlagBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePaintChipsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDerbyFlagBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PaintChips release');
 assert.equal(manifest.previousFixtureCount,7649);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7649);
}
