import {restoreCompletePlayBytes} from './complete-play-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/coupe-asset-load/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCoupeAssetLoadPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CoupeAssetLoad baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCoupeAssetLoadBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCompletePlayBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCoupeAssetLoadPrevious(file);
}
export function verifyCoupeAssetLoadRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ff243c3876aa7e489af94ef19f1420ba3f247aee');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCompletePlayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCoupeAssetLoadBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCompletePlayBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CoupeAssetLoad release');
 assert.equal(manifest.previousFixtureCount,9357);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9357);
}
