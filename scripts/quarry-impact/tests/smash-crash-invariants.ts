import {restoreRaceNumbersBytes} from './race-numbers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/smash-crash/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSmashCrashPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SmashCrash baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSmashCrashBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceNumbersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSmashCrashPrevious(file);
}
export function verifySmashCrashRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7c81b13d3192ae5c60e7e79d9be3ef20c832dc44');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceNumbersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSmashCrashBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceNumbersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SmashCrash release');
 assert.equal(manifest.previousFixtureCount,7503);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7503);
}
