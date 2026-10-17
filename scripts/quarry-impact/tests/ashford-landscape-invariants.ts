import {restoreAshfordRoadWearBytes} from './ashford-road-wear-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ashford-landscape/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAshfordLandscapePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AshfordLandscape baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAshfordLandscapeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAshfordRoadWearBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAshfordLandscapePrevious(file);
}
export function verifyAshfordLandscapeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e0f07eebb4b91ea3c6a6133c952e31578366d970');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAshfordRoadWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAshfordLandscapeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAshfordRoadWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AshfordLandscape release');
 assert.equal(manifest.previousFixtureCount,3295);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3295);
}
