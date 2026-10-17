import {restoreDemoStartModeBytes} from './demo-start-mode-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ashford-road-wear/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAshfordRoadWearPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AshfordRoadWear baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAshfordRoadWearBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDemoStartModeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAshfordRoadWearPrevious(file);
}
export function verifyAshfordRoadWearRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'baca253c7fe1b53ac76c77a7f0e68a9688476106');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDemoStartModeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAshfordRoadWearBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDemoStartModeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AshfordRoadWear release');
 assert.equal(manifest.previousFixtureCount,3304);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3304);
}
