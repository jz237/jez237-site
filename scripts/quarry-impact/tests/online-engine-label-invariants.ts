import {restoreOnlineOpponentsBytes} from './online-opponents-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-engine-label/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineEngineLabelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineEngineLabel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineEngineLabelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineOpponentsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineEngineLabelPrevious(file);
}
export function verifyOnlineEngineLabelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3813d16feca61d92fcf802c5c370ce73acdf6ed0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineOpponentsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineEngineLabelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineOpponentsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineEngineLabel release');
 assert.equal(manifest.previousFixtureCount,4058);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4058);
}
