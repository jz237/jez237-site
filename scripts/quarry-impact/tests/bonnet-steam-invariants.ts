import {restoreRoofRainBytes} from './roof-rain-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bonnet-steam/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBonnetSteamPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BonnetSteam baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBonnetSteamBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRoofRainBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBonnetSteamPrevious(file);
}
export function verifyBonnetSteamRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'caaf6872d7cadd878ac95f750cf07e0ba01c56de');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRoofRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBonnetSteamBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRoofRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BonnetSteam release');
 assert.equal(manifest.previousFixtureCount,8002);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8002);
}
