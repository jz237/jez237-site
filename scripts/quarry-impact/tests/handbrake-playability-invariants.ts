import assert from 'node:assert/strict';
import {restoreCinderbankPlayabilityBytes,verifyCinderbankPlayabilityRevision} from './cinderbank-playability-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/handbrake-playability/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHandbrakePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No handbrake-playability baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreHandbrakePlayabilityBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCinderbankPlayabilityBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHandbrakePrevious(file);
}
export function verifyHandbrakePlayabilityRevision():void{
 verifyCinderbankPlayabilityRevision();
 const manifest=revision();assert.equal(manifest.baseline,'21592fd35a30d5623472d50debc809696737bf27');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCinderbankPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHandbrakePlayabilityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCinderbankPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during handbrake playability');
 const fixtures=Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/'));
 assert.equal(manifest.previousFixtureCount,755);assert.equal(fixtures.length,755,'All earlier fixture files remain protected');
 assert.equal(hash(readHandbrakePrevious('src/vehicle-physics.ts')),'f4ff63df9c4aafc755b4e71809637c0efccca9e0185bf56ef894b970b67713a4');
 assert.equal(hash(readHandbrakePrevious('src/event-ui.ts')),'18509d4cbea23a6410f23592141d25fe248ff7f5f1f3f2aa02c7d38f92953a4a');
 assert.equal(hash(readHandbrakePrevious('tests/challenge-playability-invariants.ts')),'a0a08803f95146b5a0429f8d029db312674162d2c48ca1ef81a5eff1221d3378');
}
