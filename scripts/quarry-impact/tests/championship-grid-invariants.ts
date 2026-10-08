import {restoreTimedRacesBytes,verifyTimedRacesRevision} from './timed-races-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/championship-grid/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChampionshipGridPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChampionshipGrid baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChampionshipGridBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTimedRacesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChampionshipGridPrevious(file);
}
export function verifyChampionshipGridRevision(){
 verifyTimedRacesRevision();
 const manifest=revision();assert.equal(manifest.baseline,'6b76ce153119d68fe8961de46d4d94086df6fed7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTimedRacesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChampionshipGridBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTimedRacesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChampionshipGrid release');
 assert.equal(manifest.previousFixtureCount,979);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,979);
}
