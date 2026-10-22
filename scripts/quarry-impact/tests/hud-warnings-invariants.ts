import {restoreHeadlightAimBytes} from './headlight-aim-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hud-warnings/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHudWarningsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HudWarnings baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHudWarningsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHeadlightAimBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHudWarningsPrevious(file);
}
export function verifyHudWarningsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'003e5c380b0e30cbc42c334e191fc7e2ae8a0030');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHeadlightAimBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHudWarningsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHeadlightAimBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HudWarnings release');
 assert.equal(manifest.previousFixtureCount,6024);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6024);
}
