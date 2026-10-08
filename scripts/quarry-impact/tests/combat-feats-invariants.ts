import {restoreShuttleBytes,verifyShuttleRevision} from './shuttle-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/combat-feats/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCombatFeatsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CombatFeats baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCombatFeatsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreShuttleBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCombatFeatsPrevious(file);
}
export function verifyCombatFeatsRevision(){
 verifyShuttleRevision();
 const manifest=revision();assert.equal(manifest.baseline,'781be32e76e51169c5289df8aedc5df7167d7cd1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreShuttleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCombatFeatsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreShuttleBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CombatFeats release');
 assert.equal(manifest.previousFixtureCount,1309);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1309);
}
