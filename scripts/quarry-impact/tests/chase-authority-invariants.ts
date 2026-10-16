import {restoreChaseNetworkBytes} from './chase-network-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-authority/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseAuthorityPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseAuthority baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseAuthorityBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseNetworkBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseAuthorityPrevious(file);
}
export function verifyChaseAuthorityRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b8d1951b4e8472cd377a52acaa11a28d462e07eb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseNetworkBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseAuthorityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseNetworkBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseAuthority release');
 assert.equal(manifest.previousFixtureCount,3119);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3119);
}
