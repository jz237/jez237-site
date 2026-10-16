import {restoreChaseUIBytes} from './chase-ui-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-network/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseNetworkPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseNetwork baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseNetworkBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseUIBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseNetworkPrevious(file);
}
export function verifyChaseNetworkRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'244a8e8e111fdc6324939760beabf5d2bedde6dc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseUIBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseNetworkBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseUIBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseNetwork release');
 assert.equal(manifest.previousFixtureCount,3135);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3135);
}
