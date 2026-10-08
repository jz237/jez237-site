import {restoreSharedGhostBytes,verifySharedGhostRevision} from './shared-ghost-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chassis-tuning/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChassisTuningPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChassisTuning baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChassisTuningBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSharedGhostBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChassisTuningPrevious(file);
}
export function verifyChassisTuningRevision(){
 verifySharedGhostRevision();
 const manifest=revision();assert.equal(manifest.baseline,'e07a89e4c9409c9b84cd3ba1bd6e2e11bf31be86');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSharedGhostBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChassisTuningBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSharedGhostBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChassisTuning release');
 assert.equal(manifest.previousFixtureCount,1378);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1378);
}
