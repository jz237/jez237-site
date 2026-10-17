import {restoreCupVenueLabelsBytes} from './cup-venue-labels-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-spectating/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineSpectatingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineSpectating baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineSpectatingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCupVenueLabelsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineSpectatingPrevious(file);
}
export function verifyOnlineSpectatingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'87beb0da87f9a435c756fa8505ad367bc5015611');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCupVenueLabelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineSpectatingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCupVenueLabelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineSpectating release');
 assert.equal(manifest.previousFixtureCount,4128);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4128);
}
