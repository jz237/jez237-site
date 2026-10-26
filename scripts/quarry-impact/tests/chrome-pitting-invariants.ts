import {restoreDanglersBytes} from './danglers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chrome-pitting/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChromePittingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChromePitting baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChromePittingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDanglersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChromePittingPrevious(file);
}
export function verifyChromePittingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e242bbc820a84359a6bc9637191270adf6d0adab');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDanglersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChromePittingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDanglersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChromePitting release');
 assert.equal(manifest.previousFixtureCount,8982);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8982);
}
