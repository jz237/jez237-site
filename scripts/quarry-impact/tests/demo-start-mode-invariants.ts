import {restoreReplayThermalBytes} from './replay-thermal-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demo-start-mode/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDemoStartModePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DemoStartMode baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDemoStartModeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayThermalBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDemoStartModePrevious(file);
}
export function verifyDemoStartModeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e844a76576e8582511aa2d266bc0f3092c80d9d8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayThermalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDemoStartModeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayThermalBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DemoStartMode release');
 assert.equal(manifest.previousFixtureCount,3311);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3311);
}
