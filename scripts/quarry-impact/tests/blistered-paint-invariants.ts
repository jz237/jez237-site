import {restoreCvJointsBytes} from './cv-joints-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/blistered-paint/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBlisteredPaintPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BlisteredPaint baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBlisteredPaintBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCvJointsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBlisteredPaintPrevious(file);
}
export function verifyBlisteredPaintRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'20d947d1f4f2b8b1e771cf1322101fa90547e40d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCvJointsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBlisteredPaintBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCvJointsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BlisteredPaint release');
 assert.equal(manifest.previousFixtureCount,9062);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9062);
}
