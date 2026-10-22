import {restorePowerSteeringBytes} from './power-steering-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-fluid/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakeFluidPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakeFluid baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakeFluidBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePowerSteeringBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakeFluidPrevious(file);
}
export function verifyBrakeFluidRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f83885ddbd89ed6f8b2b8ecd4822798d70553d8c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePowerSteeringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakeFluidBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePowerSteeringBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakeFluid release');
 assert.equal(manifest.previousFixtureCount,5551);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5551);
}
