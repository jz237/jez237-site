import {restoreAngularDifferentialBytes} from './angular-differential-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/drive-calibration/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDriveCalibrationPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DriveCalibration baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDriveCalibrationBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAngularDifferentialBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDriveCalibrationPrevious(file);
}
export function verifyDriveCalibrationRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'172932c05a281235edf7394e68e438f332aaa64c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAngularDifferentialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDriveCalibrationBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAngularDifferentialBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DriveCalibration release');
 assert.equal(manifest.previousFixtureCount,3756);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3756);
}
