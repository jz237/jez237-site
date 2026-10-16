import {restoreCinderbankSurroundingsBytes} from './cinderbank-surroundings-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-rule-draft/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineRuleDraftPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineRuleDraft baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineRuleDraftBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCinderbankSurroundingsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineRuleDraftPrevious(file);
}
export function verifyOnlineRuleDraftRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6bf0cd5301a44d2dec3f5936887d782f06a4e5b3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCinderbankSurroundingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineRuleDraftBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCinderbankSurroundingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineRuleDraft release');
 assert.equal(manifest.previousFixtureCount,3200);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3200);
}
