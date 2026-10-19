import {restoreTrophyDecalsBytes} from './trophy-decals-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hollins-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHollinsCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HollinsCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHollinsCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTrophyDecalsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHollinsCarPrevious(file);
}
export function verifyHollinsCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6a69ed251c66380d08db4c469827902cf3451684');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTrophyDecalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHollinsCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTrophyDecalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HollinsCar release');
 assert.equal(manifest.previousFixtureCount,4921);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4921);
}
