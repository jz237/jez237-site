import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/keyboard-default/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readKeyboardDefaultPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No KeyboardDefault baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreKeyboardDefaultBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readKeyboardDefaultPrevious(file);
}
export function verifyKeyboardDefaultRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'59e382d3d177478da8eff8ca4d40e4258a2a2c50');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreKeyboardDefaultBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' is outside the KeyboardDefault release');
 assert.equal(manifest.previousFixtureCount,1515);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1515);
}
