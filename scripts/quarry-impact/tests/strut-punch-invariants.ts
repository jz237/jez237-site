import {restoreSparkLightBytes} from './spark-light-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/strut-punch/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStrutPunchPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StrutPunch baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStrutPunchBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSparkLightBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStrutPunchPrevious(file);
}
export function verifyStrutPunchRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c4aa98f4a7c6492810e3ca2c09bbd51ea3fd3532');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSparkLightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStrutPunchBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSparkLightBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StrutPunch release');
 assert.equal(manifest.previousFixtureCount,8661);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8661);
}
