import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/elmsworth-spectators/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readElmsworthSpectatorsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ElmsworthSpectators baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreElmsworthSpectatorsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreKingswellClubhouseBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readElmsworthSpectatorsPrevious(file);
}
export function verifyElmsworthSpectatorsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1b430fbdfdb453fdfdeaf883787783ef64468b8a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreKingswellClubhouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreElmsworthSpectatorsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreKingswellClubhouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ElmsworthSpectators release');
 assert.equal(manifest.previousFixtureCount,2298);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2298);
}

import {restoreKingswellClubhouseBytes} from './kingswell-clubhouse-invariants';
