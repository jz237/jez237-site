import {restoreLightingMoodsBytes} from './lighting-moods-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/saber-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSaberCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SaberCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSaberCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLightingMoodsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSaberCarPrevious(file);
}
export function verifySaberCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'653861fa07d7a3463dad37fbc73007dd2a15aee8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLightingMoodsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSaberCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLightingMoodsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SaberCar release');
 assert.equal(manifest.previousFixtureCount,4307);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4307);
}
