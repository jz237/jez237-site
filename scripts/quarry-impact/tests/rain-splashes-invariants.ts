import {restoreUmbrellaWindBytes} from './umbrella-wind-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rain-splashes/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRainSplashesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RainSplashes baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRainSplashesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreUmbrellaWindBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRainSplashesPrevious(file);
}
export function verifyRainSplashesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'26f3ef6af6310a4bdb8a4c1d5cd93acfd155db26');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreUmbrellaWindBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRainSplashesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreUmbrellaWindBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RainSplashes release');
 assert.equal(manifest.previousFixtureCount,8108);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8108);
}
