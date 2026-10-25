import {restoreWindowNetBytes} from './window-net-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driver-figure/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDriverFigurePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DriverFigure baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDriverFigureBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWindowNetBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDriverFigurePrevious(file);
}
export function verifyDriverFigureRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'85959b4f2dbbd47efcbc0519829062e11c01eda3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWindowNetBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDriverFigureBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWindowNetBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DriverFigure release');
 assert.equal(manifest.previousFixtureCount,7537);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7537);
}
