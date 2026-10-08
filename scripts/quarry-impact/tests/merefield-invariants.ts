import {restoreMillhavenBytes} from './millhaven-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/merefield/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMerefieldPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Merefield baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMerefieldBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMillhavenBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMerefieldPrevious(file);
}
export function verifyMerefieldRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b5c6969d6d822b936c15f688f4af8cca459f988b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMillhavenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMerefieldBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMillhavenBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Merefield release');
 assert.equal(manifest.previousFixtureCount,1560);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1560);
}
