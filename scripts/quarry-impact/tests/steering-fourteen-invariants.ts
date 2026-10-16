import {restoreChaseAuthorityBytes} from './chase-authority-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steering-fourteen/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteeringFourteenPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteeringFourteen baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteeringFourteenBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseAuthorityBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteeringFourteenPrevious(file);
}
export function verifySteeringFourteenRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5e9e721a188d0a199ab52899193643560bd1c809');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseAuthorityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteeringFourteenBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseAuthorityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteeringFourteen release');
 assert.equal(manifest.previousFixtureCount,3109);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3109);
}
