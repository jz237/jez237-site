import {restoreCombatFeatsBytes,verifyCombatFeatsRevision} from './combat-feats-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/transmission/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTransmissionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Transmission baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTransmissionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCombatFeatsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTransmissionPrevious(file);
}
export function verifyTransmissionRevision(){
 verifyCombatFeatsRevision();
 const manifest=revision();assert.equal(manifest.baseline,'5b6d2b8c12cfd5480dcb9cf67923ea57b16b27d3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCombatFeatsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTransmissionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCombatFeatsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Transmission release');
 assert.equal(manifest.previousFixtureCount,1282);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1282);
}
