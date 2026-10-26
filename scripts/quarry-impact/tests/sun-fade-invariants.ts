import {restoreRottenShellsBytes} from './rotten-shells-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sun-fade/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSunFadePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SunFade baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSunFadeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRottenShellsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSunFadePrevious(file);
}
export function verifySunFadeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f6b491485f52ed756ff95e59683d0b9f66a43bb9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRottenShellsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSunFadeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRottenShellsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SunFade release');
 assert.equal(manifest.previousFixtureCount,8828);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8828);
}
