import {restoreRadiatorSteamBytes} from './radiator-steam-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rim-wobble/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRimWobblePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RimWobble baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRimWobbleBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRadiatorSteamBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRimWobblePrevious(file);
}
export function verifyRimWobbleRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'43db6209cdfca5234fda7a4fbee3be98921484bb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRadiatorSteamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRimWobbleBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRadiatorSteamBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RimWobble release');
 assert.equal(manifest.previousFixtureCount,5344);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5344);
}
