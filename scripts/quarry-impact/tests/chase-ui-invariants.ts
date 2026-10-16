import {restoreChaseAIBytes} from './chase-ai-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-ui/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseUIPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseUI baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseUIBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseAIBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseUIPrevious(file);
}
export function verifyChaseUIRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'640136747d6c7a3516a54ca26b568840725084ec');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseAIBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseUIBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseAIBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseUI release');
 assert.equal(manifest.previousFixtureCount,3149);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3149);
}
