import {restoreAngularAssistsBytes} from './angular-assists-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/angular-differential/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAngularDifferentialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AngularDifferential baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAngularDifferentialBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAngularAssistsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAngularDifferentialPrevious(file);
}
export function verifyAngularDifferentialRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'523338e19c3bdca2dabfe32d92e3d397991754b1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAngularAssistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAngularDifferentialBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAngularAssistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AngularDifferential release');
 assert.equal(manifest.previousFixtureCount,3766);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3766);
}
