import assert from 'node:assert/strict';
import {restoreHandbrakePlayabilityBytes,verifyHandbrakePlayabilityRevision} from './handbrake-playability-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/challenge-playability/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChallengePlayabilityPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No challenge-playability baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreChallengePlayabilityBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHandbrakePlayabilityBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChallengePlayabilityPrevious(file);
}
export function verifyChallengePlayabilityRevision():void{
 verifyHandbrakePlayabilityRevision();
 const manifest=revision();assert.equal(manifest.baseline,'8fa7c2a41ad0f6a80013cab91b17c8f983fe1582');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHandbrakePlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChallengePlayabilityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHandbrakePlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during challenge playability');
 const fixtures=Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/'));
 assert.equal(manifest.previousFixtureCount,744);assert.equal(fixtures.length,744,'All earlier fixture files remain protected');
 assert.equal(hash(readChallengePlayabilityPrevious('src/main.ts')),'46cc37f3d98a0bfc2690e307e4032374b7857fd590b71f7cb88f4d9df6d2cd4b');
 assert.equal(hash(readChallengePlayabilityPrevious('src/challenges.ts')),'ea2a9fe750780eff7310151a76db5ae7a032b7f0ca06c7b5090f932391afa0b0');
 assert.equal(hash(readChallengePlayabilityPrevious('tests/controller-playability-invariants.ts')),'e872bd1665292bdf0d375a7f11e1239f771370b24f7bc54dd54e0e9ed483d68b');
}
