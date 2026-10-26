import {restoreBaldTyresBytes} from './bald-tyres-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/stone-chips/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStoneChipsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StoneChips baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStoneChipsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBaldTyresBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStoneChipsPrevious(file);
}
export function verifyStoneChipsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5762adad65d77bdc53a3660425a7d9870a008a0e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBaldTyresBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStoneChipsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBaldTyresBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StoneChips release');
 assert.equal(manifest.previousFixtureCount,9329);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9329);
}
