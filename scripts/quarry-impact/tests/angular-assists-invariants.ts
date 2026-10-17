import {restoreOnlineAngularDriveBytes} from './online-angular-drive-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/angular-assists/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAngularAssistsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AngularAssists baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAngularAssistsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineAngularDriveBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAngularAssistsPrevious(file);
}
export function verifyAngularAssistsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'11d841fae53efe5d60467e07d9604b464e340066');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineAngularDriveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAngularAssistsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineAngularDriveBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AngularAssists release');
 assert.equal(manifest.previousFixtureCount,3775);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3775);
}
