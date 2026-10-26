import {restoreLoopVoicesBytes} from './loop-voices-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steady-tiers/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteadyTiersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteadyTiers baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteadyTiersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLoopVoicesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteadyTiersPrevious(file);
}
export function verifySteadyTiersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b3879f65a4a2d6872e090aa2420d70c65bd60b8d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLoopVoicesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteadyTiersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLoopVoicesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteadyTiers release');
 assert.equal(manifest.previousFixtureCount,9228);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9228);
}
