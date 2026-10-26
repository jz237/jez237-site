import {restoreRevLimiterBytes} from './rev-limiter-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/lamp-grime/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLampGrimePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LampGrime baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLampGrimeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRevLimiterBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLampGrimePrevious(file);
}
export function verifyLampGrimeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'165d05dcacd684a95bff69b5f5e42666cd2e8673');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRevLimiterBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLampGrimeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRevLimiterBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LampGrime release');
 assert.equal(manifest.previousFixtureCount,8764);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8764);
}
