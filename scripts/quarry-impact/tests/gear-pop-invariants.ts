import {restoreCaliperBytes} from './caliper-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/gear-pop/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGearPopPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GearPop baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGearPopBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCaliperBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGearPopPrevious(file);
}
export function verifyGearPopRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cf519684c34748c2b3024515ef8963f74c38ca12');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCaliperBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGearPopBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCaliperBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GearPop release');
 assert.equal(manifest.previousFixtureCount,5789);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5789);
}
