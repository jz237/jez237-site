import {restoreBumpStopsBytes} from './bump-stops-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wheel-blur/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWheelBlurPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WheelBlur baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWheelBlurBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBumpStopsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWheelBlurPrevious(file);
}
export function verifyWheelBlurRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'56744328878d06b29c82ab85f41aa21d23508f5b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBumpStopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWheelBlurBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBumpStopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WheelBlur release');
 assert.equal(manifest.previousFixtureCount,8886);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8886);
}
