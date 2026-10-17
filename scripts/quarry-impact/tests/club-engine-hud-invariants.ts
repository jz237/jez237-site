import {restoreLoadingStagesBytes} from './loading-stages-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/club-engine-hud/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClubEngineHudPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ClubEngineHud baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreClubEngineHudBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLoadingStagesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readClubEngineHudPrevious(file);
}
export function verifyClubEngineHudRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9db365d867d0cdbc3c95d9685c659d8f6c4a1bf2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLoadingStagesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClubEngineHudBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLoadingStagesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ClubEngineHud release');
 assert.equal(manifest.previousFixtureCount,4040);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4040);
}
