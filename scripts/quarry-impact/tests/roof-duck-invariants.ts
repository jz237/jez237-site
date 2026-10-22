import {restoreDebeadBytes} from './debead-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roof-duck/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRoofDuckPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RoofDuck baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRoofDuckBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDebeadBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRoofDuckPrevious(file);
}
export function verifyRoofDuckRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'310f171d6fdd95f6f26af2257341041204c7f9cb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDebeadBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRoofDuckBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDebeadBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RoofDuck release');
 assert.equal(manifest.previousFixtureCount,5755);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5755);
}
