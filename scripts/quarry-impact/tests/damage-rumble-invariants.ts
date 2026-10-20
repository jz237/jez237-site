import {restoreSlowPunctureBytes} from './slow-puncture-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/damage-rumble/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDamageRumblePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DamageRumble baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDamageRumbleBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSlowPunctureBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDamageRumblePrevious(file);
}
export function verifyDamageRumbleRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b62662b07344a260ab9620fe11063dcb92240a63');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSlowPunctureBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDamageRumbleBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSlowPunctureBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DamageRumble release');
 assert.equal(manifest.previousFixtureCount,5043);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5043);
}
