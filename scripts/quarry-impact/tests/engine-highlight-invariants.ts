import {restoreEngineOutReportBytes} from './engine-out-report-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/engine-highlight/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEngineHighlightPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EngineHighlight baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEngineHighlightBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEngineOutReportBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEngineHighlightPrevious(file);
}
export function verifyEngineHighlightRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a89a04cb1a243bc16fb4786596036b3755c356c1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEngineOutReportBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEngineHighlightBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEngineOutReportBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EngineHighlight release');
 assert.equal(manifest.previousFixtureCount,6754);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6754);
}
