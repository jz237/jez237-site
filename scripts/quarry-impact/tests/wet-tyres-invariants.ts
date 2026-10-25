import {restoreGlassRainBytes} from './glass-rain-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wet-tyres/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWetTyresPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WetTyres baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWetTyresBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGlassRainBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWetTyresPrevious(file);
}
export function verifyWetTyresRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'71d49501ab558f91fb3904a83278fc307202dc1b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGlassRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWetTyresBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGlassRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WetTyres release');
 assert.equal(manifest.previousFixtureCount,7975);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7975);
}
