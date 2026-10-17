import {restoreWrenfordWindpumpBytes} from './wrenford-windpump-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/automatic-direction-change/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAutomaticDirectionChangePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AutomaticDirectionChange baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAutomaticDirectionChangeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWrenfordWindpumpBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAutomaticDirectionChangePrevious(file);
}
export function verifyAutomaticDirectionChangeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d2508b7772d096027b5ccff31177ff2aaa6a57cf');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWrenfordWindpumpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAutomaticDirectionChangeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWrenfordWindpumpBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AutomaticDirectionChange release');
 assert.equal(manifest.previousFixtureCount,3834);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3834);
}
