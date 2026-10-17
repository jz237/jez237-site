import {restoreReservoirPumphouseBytes} from './reservoir-pumphouse-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cup-venue-labels/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCupVenueLabelsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CupVenueLabels baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCupVenueLabelsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReservoirPumphouseBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCupVenueLabelsPrevious(file);
}
export function verifyCupVenueLabelsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e6340a6bc1b8e5075cdc08ef97ad8ac22676bd58');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReservoirPumphouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCupVenueLabelsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReservoirPumphouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CupVenueLabels release');
 assert.equal(manifest.previousFixtureCount,4137);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4137);
}
