import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/controller-playability/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readControllerPlayabilityPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No controller-playability baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreControllerPlayabilityBytes(file:string,bytes:Buffer){
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readControllerPlayabilityPrevious(file);
}
export function verifyControllerPlayabilityRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0cc6524d7ce9678e697020ffb8d4423e1342b17c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreControllerPlayabilityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during controller playability');
 const fixturePaths=Object.keys(manifest.protected).filter(path=>path.startsWith('tests/fixtures/'));
 assert.equal(manifest.previousFixtureCount,730);assert.equal(fixturePaths.length,730,'Every predecessor fixture remains protected');
 assert.equal(hash(readControllerPlayabilityPrevious('src/main.ts')),'885634a7b49e51ca65499b51955f085f574da5915d0433fcd31d452e6aca3436','Retain the actual published main source');
}
