import {restoreSmoothDemoBytes} from './smooth-demo-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/webgl2-notice/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWebgl2NoticePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Webgl2Notice baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWebgl2NoticeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSmoothDemoBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWebgl2NoticePrevious(file);
}
export function verifyWebgl2NoticeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e6b13e4b7105843b33db9e51727a69352b895d5b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSmoothDemoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWebgl2NoticeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSmoothDemoBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Webgl2Notice release');
 assert.equal(manifest.previousFixtureCount,9192);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9192);
}
