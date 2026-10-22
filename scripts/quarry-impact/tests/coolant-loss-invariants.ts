import {restoreRoofGlassBytes} from './roof-glass-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/coolant-loss/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCoolantLossPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CoolantLoss baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCoolantLossBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRoofGlassBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCoolantLossPrevious(file);
}
export function verifyCoolantLossRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8cd858527899b96ab1392967dcba895a55ff4cdc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRoofGlassBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCoolantLossBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRoofGlassBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CoolantLoss release');
 assert.equal(manifest.previousFixtureCount,5590);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5590);
}
