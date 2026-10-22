import {restoreLidSwingBytes} from './lid-swing-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diff-break/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiffBreakPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiffBreak baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiffBreakBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLidSwingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiffBreakPrevious(file);
}
export function verifyDiffBreakRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6bbe0d396a600a56b3e94ba743a4d9f7d204fb29');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLidSwingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiffBreakBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLidSwingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiffBreak release');
 assert.equal(manifest.previousFixtureCount,5733);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5733);
}
