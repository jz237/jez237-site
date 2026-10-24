import {restoreFrenzyBytes} from './frenzy-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wreck-note/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWreckNotePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WreckNote baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWreckNoteBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFrenzyBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWreckNotePrevious(file);
}
export function verifyWreckNoteRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d050e538a571e8add7009d59546477c894ffccc0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFrenzyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWreckNoteBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFrenzyBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WreckNote release');
 assert.equal(manifest.previousFixtureCount,6626);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6626);
}
