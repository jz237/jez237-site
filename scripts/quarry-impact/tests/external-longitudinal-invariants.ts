import {restoreSharedDrivetrainBytes} from './shared-drivetrain-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/external-longitudinal/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExternalLongitudinalPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExternalLongitudinal baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExternalLongitudinalBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSharedDrivetrainBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExternalLongitudinalPrevious(file);
}
export function verifyExternalLongitudinalRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'693a401ceb7922d8d679aeba151d03438d38985f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSharedDrivetrainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExternalLongitudinalBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSharedDrivetrainBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExternalLongitudinal release');
 assert.equal(manifest.previousFixtureCount,3725);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3725);
}
