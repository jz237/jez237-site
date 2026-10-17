import {restoreGarageEnginesBytes} from './garage-engines-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-class-engines/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineClassEnginesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineClassEngines baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineClassEnginesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGarageEnginesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineClassEnginesPrevious(file);
}
export function verifyOnlineClassEnginesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d2431fb52598a125df00aba6f5d8ae03408bafc2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGarageEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineClassEnginesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGarageEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineClassEngines release');
 assert.equal(manifest.previousFixtureCount,3998);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3998);
}
