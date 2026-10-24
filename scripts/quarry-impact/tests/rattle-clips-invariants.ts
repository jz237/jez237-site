import {restoreDiagramRodFireBytes} from './diagram-rod-fire-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rattle-clips/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRattleClipsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RattleClips baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRattleClipsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDiagramRodFireBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRattleClipsPrevious(file);
}
export function verifyRattleClipsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'db10c003f6fdfc9573ad2760265db67c35cfc760');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDiagramRodFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRattleClipsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDiagramRodFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RattleClips release');
 assert.equal(manifest.previousFixtureCount,7298);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7298);
}
