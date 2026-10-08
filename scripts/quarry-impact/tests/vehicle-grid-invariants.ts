import {restoreDamageRulesBytes,verifyDamageRulesRevision} from './damage-rules-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/vehicle-grid/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readVehicleGridPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No VehicleGrid baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreVehicleGridBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDamageRulesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readVehicleGridPrevious(file);
}
export function verifyVehicleGridRevision(){
 verifyDamageRulesRevision();
 const manifest=revision();assert.equal(manifest.baseline,'147f2d1d86ed8e7a629f774476a2b87ebdc899b4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDamageRulesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreVehicleGridBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDamageRulesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the VehicleGrid release');
 assert.equal(manifest.previousFixtureCount,1011);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1011);
}
