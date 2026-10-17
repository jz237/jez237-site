import {restoreCoastalPavilionBytes} from './coastal-pavilion-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-loadout-draft/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineLoadoutDraftPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineLoadoutDraft baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineLoadoutDraftBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCoastalPavilionBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineLoadoutDraftPrevious(file);
}
export function verifyOnlineLoadoutDraftRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8a6a6fce234e5e61f3ff06411c6ee37190eaa146');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCoastalPavilionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineLoadoutDraftBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCoastalPavilionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineLoadoutDraft release');
 assert.equal(manifest.previousFixtureCount,4247);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4247);
}
