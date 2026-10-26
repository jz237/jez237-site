import {restoreRottenHangersBytes} from './rotten-hangers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-pull/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakePullPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakePull baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakePullBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRottenHangersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakePullPrevious(file);
}
export function verifyBrakePullRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'dec06437b1224c3e7b3eb6601690e3a801c866ef');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRottenHangersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakePullBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRottenHangersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakePull release');
 assert.equal(manifest.previousFixtureCount,9016);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9016);
}
