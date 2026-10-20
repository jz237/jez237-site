import {restoreFeedWheelsBytes} from './feed-wheels-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/prop-ccd/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPropCcdPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PropCcd baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePropCcdBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFeedWheelsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPropCcdPrevious(file);
}
export function verifyPropCcdRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9b4d257bafaa990d5ec669ea64c655ee2cfb7779');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFeedWheelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePropCcdBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFeedWheelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PropCcd release');
 assert.equal(manifest.previousFixtureCount,5128);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5128);
}
