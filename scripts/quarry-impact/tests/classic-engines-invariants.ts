import {restoreDestructionPointsBytes} from './destruction-points-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/classic-engines/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClassicEnginesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ClassicEngines baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreClassicEnginesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDestructionPointsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readClassicEnginesPrevious(file);
}
export function verifyClassicEnginesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2b7cf6fcc8dac8d4dcb01e6ac06809b781d0d061');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDestructionPointsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClassicEnginesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDestructionPointsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ClassicEngines release');
 assert.equal(manifest.previousFixtureCount,6712);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6712);
}
