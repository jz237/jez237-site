import {restorePinecrestMaterialsBytes} from './pinecrest-materials-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/prop-membership/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPropMembershipPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PropMembership baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePropMembershipBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestMaterialsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPropMembershipPrevious(file);
}
export function verifyPropMembershipRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'4ed5b9c5a026e2ef0fbfbae3e58772d581bc9112');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestMaterialsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePropMembershipBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestMaterialsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PropMembership release');
 assert.equal(manifest.previousFixtureCount,3652);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3652);
}
