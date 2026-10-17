import {restoreAggregateConveyorBytes} from './aggregate-conveyor-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/kingswell-bandstands/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readKingswellBandstandsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No KingswellBandstands baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreKingswellBandstandsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAggregateConveyorBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readKingswellBandstandsPrevious(file);
}
export function verifyKingswellBandstandsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'bcecc3e2b15006369a697e618e98950d72a99816');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAggregateConveyorBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreKingswellBandstandsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAggregateConveyorBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the KingswellBandstands release');
 assert.equal(manifest.previousFixtureCount,3924);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3924);
}
