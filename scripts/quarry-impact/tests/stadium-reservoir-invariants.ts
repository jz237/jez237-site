import {restoreTrailBytes} from './trail-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/stadium-reservoir/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStadiumReservoirPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StadiumReservoir baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStadiumReservoirBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTrailBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStadiumReservoirPrevious(file);
}
export function verifyStadiumReservoirRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'286930c13906702eceb8deddd5fe4b41b490e644');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTrailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStadiumReservoirBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTrailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StadiumReservoir release');
 assert.equal(manifest.previousFixtureCount,1913);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1913);
}
