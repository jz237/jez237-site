import {restoreVictimsLineBytes} from './victims-line-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wreck-by-you/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWreckByYouPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WreckByYou baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWreckByYouBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreVictimsLineBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWreckByYouPrevious(file);
}
export function verifyWreckByYouRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f3422e3347011589ac2f296644bd13f10b044f37');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreVictimsLineBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWreckByYouBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreVictimsLineBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WreckByYou release');
 assert.equal(manifest.previousFixtureCount,6788);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6788);
}
