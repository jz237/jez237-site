import {restoreShadowQualityTransitionBytes} from './shadow-quality-transition-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wrenford-windpump/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWrenfordWindpumpPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WrenfordWindpump baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWrenfordWindpumpBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreShadowQualityTransitionBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWrenfordWindpumpPrevious(file);
}
export function verifyWrenfordWindpumpRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e31336a4e9eaa294f659d0de5bee6d716ffd9dcc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreShadowQualityTransitionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWrenfordWindpumpBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreShadowQualityTransitionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WrenfordWindpump release');
 assert.equal(manifest.previousFixtureCount,3843);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3843);
}
