import {restoreClubEngineHudBytes} from './club-engine-hud-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/club-engines/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClubEnginesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ClubEngines baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreClubEnginesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreClubEngineHudBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readClubEnginesPrevious(file);
}
export function verifyClubEnginesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'04f6a7676b3c1a8b11bca705c4016097651b9dcc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreClubEngineHudBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClubEnginesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreClubEngineHudBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ClubEngines release');
 assert.equal(manifest.previousFixtureCount,4029);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4029);
}
