import {restoreBumpStartBytes} from './bump-start-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/mirror-clip/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMirrorClipPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No MirrorClip baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMirrorClipBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBumpStartBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMirrorClipPrevious(file);
}
export function verifyMirrorClipRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'126b82b1a71a63627a9414526e910dd2a9ba4c0b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBumpStartBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMirrorClipBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBumpStartBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the MirrorClip release');
 assert.equal(manifest.previousFixtureCount,7123);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7123);
}
