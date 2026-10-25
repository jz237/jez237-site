import {restoreWipersBytes} from './wipers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/engine-shake/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEngineShakePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EngineShake baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEngineShakeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWipersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEngineShakePrevious(file);
}
export function verifyEngineShakeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'992a97461cf8dab95c489f0673dcd39a0e610604');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWipersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEngineShakeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWipersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EngineShake release');
 assert.equal(manifest.previousFixtureCount,7895);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7895);
}
