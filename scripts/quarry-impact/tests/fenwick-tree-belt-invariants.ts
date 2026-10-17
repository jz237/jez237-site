import {restoreRookvaleTerminalBytes} from './rookvale-terminal-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-tree-belt/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickTreeBeltPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickTreeBelt baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickTreeBeltBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleTerminalBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickTreeBeltPrevious(file);
}
export function verifyFenwickTreeBeltRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1385d085589661f7e46ab0eaff66f4b05219647e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleTerminalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickTreeBeltBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleTerminalBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickTreeBelt release');
 assert.equal(manifest.previousFixtureCount,3412);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3412);
}
