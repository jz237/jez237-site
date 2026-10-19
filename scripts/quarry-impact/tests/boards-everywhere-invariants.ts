import {restorePipitCarBytes} from './pipit-car-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/boards-everywhere/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBoardsEverywherePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BoardsEverywhere baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBoardsEverywhereBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePipitCarBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBoardsEverywherePrevious(file);
}
export function verifyBoardsEverywhereRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1f51196a52fb7f3af0f7c7fb65b26287f64b7091');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePipitCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBoardsEverywhereBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePipitCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BoardsEverywhere release');
 assert.equal(manifest.previousFixtureCount,4520);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4520);
}
