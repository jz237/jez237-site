import {restoreDrivelineBytes} from './driveline-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cornering/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCorneringPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Cornering baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCorneringBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDrivelineBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCorneringPrevious(file);
}
export function verifyCorneringRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2e7a2b45a3a226c81a9e59d1105f043c05cfe635');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDrivelineBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCorneringBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDrivelineBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Cornering release');
 assert.equal(manifest.previousFixtureCount,1847);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1847);
}
