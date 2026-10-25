import {restoreEndHornBytes} from './end-horn-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cabin-smoke/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCabinSmokePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CabinSmoke baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCabinSmokeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEndHornBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCabinSmokePrevious(file);
}
export function verifyCabinSmokeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'315bd9754afbb57380fab1218be5389da777c53d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEndHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCabinSmokeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEndHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CabinSmoke release');
 assert.equal(manifest.previousFixtureCount,7759);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7759);
}
