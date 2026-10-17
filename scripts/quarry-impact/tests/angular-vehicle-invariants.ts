import {restoreDriveCalibrationBytes} from './drive-calibration-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/angular-vehicle/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAngularVehiclePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AngularVehicle baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAngularVehicleBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDriveCalibrationBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAngularVehiclePrevious(file);
}
export function verifyAngularVehicleRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d5d217984c2a29b516247b23e3d01d9b8222f34b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDriveCalibrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAngularVehicleBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDriveCalibrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AngularVehicle release');
 assert.equal(manifest.previousFixtureCount,3744);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3744);
}
