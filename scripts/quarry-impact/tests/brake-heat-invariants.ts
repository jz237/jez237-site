import {restoreTyreHeatBytes} from './tyre-heat-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-heat/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakeHeatPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakeHeat baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakeHeatBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTyreHeatBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakeHeatPrevious(file);
}
export function verifyBrakeHeatRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d1f3d75d1ff64999d4bd34019f20b177037dc85e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTyreHeatBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakeHeatBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTyreHeatBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakeHeat release');
 assert.equal(manifest.previousFixtureCount,8431);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8431);
}
