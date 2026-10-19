import {restoreRainWeatherBytes} from './rain-weather-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/feature-badges/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFeatureBadgesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FeatureBadges baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFeatureBadgesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRainWeatherBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFeatureBadgesPrevious(file);
}
export function verifyFeatureBadgesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'23b7861ad263f49defbc2ba29d02a2d6ea7b26e3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRainWeatherBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFeatureBadgesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRainWeatherBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FeatureBadges release');
 assert.equal(manifest.previousFixtureCount,4867);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4867);
}
