import {restoreGroundRotationBytes} from './ground-rotation-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demo-direction/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDemoDirectionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DemoDirection baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDemoDirectionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGroundRotationBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDemoDirectionPrevious(file);
}
export function verifyDemoDirectionRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e1b1814ae1b813ba2fd325cbeb7977ead8ddd368');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGroundRotationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDemoDirectionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGroundRotationBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DemoDirection release');
 assert.equal(manifest.previousFixtureCount,3513);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3513);
}
