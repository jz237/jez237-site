import {restoreBarnDoorsBytes} from './barn-doors-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roll-master/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRollMasterPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RollMaster baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRollMasterBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBarnDoorsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRollMasterPrevious(file);
}
export function verifyRollMasterRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8c02a36b4d4bf8901510877c5f8cbd76b9767bba');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBarnDoorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRollMasterBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBarnDoorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RollMaster release');
 assert.equal(manifest.previousFixtureCount,6685);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6685);
}
