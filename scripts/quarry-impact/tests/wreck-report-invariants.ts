import {restoreDiagramPartsBytes} from './diagram-parts-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wreck-report/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWreckReportPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WreckReport baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWreckReportBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDiagramPartsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWreckReportPrevious(file);
}
export function verifyWreckReportRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d8db2b0e38f1c8e7b3234a421113ae19910350bd');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDiagramPartsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWreckReportBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDiagramPartsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WreckReport release');
 assert.equal(manifest.previousFixtureCount,5178);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5178);
}
