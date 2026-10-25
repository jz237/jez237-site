import {restoreTowStrapsBytes} from './tow-straps-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/gravel-roost/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGravelRoostPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GravelRoost baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGravelRoostBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTowStrapsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGravelRoostPrevious(file);
}
export function verifyGravelRoostRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f9889760a626ce8baff12257cccb079965bf0912');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTowStrapsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGravelRoostBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTowStrapsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GravelRoost release');
 assert.equal(manifest.previousFixtureCount,8500);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8500);
}
