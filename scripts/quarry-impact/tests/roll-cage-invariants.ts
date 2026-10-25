import {restoreDriverLookBytes} from './driver-look-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roll-cage/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRollCagePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RollCage baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRollCageBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDriverLookBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRollCagePrevious(file);
}
export function verifyRollCageRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'61367f2fc62081cbf47ddd8200394b7e9b4dc63d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDriverLookBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRollCageBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDriverLookBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RollCage release');
 assert.equal(manifest.previousFixtureCount,7597);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7597);
}
