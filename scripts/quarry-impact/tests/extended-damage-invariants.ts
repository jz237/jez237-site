import {restoreWheelReachBytes} from './wheel-reach-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/extended-damage/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExtendedDamagePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExtendedDamage baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExtendedDamageBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWheelReachBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExtendedDamagePrevious(file);
}
export function verifyExtendedDamageRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5ffd8d9ab2f0ce644c6ce06975308028ab35a9c4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWheelReachBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExtendedDamageBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWheelReachBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExtendedDamage release');
 assert.equal(manifest.previousFixtureCount,4982);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4982);
}
