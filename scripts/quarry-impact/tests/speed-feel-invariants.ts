import {restoreDebrisFlingBytes} from './debris-fling-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/speed-feel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSpeedFeelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SpeedFeel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSpeedFeelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDebrisFlingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSpeedFeelPrevious(file);
}
export function verifySpeedFeelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3bd7e795d4d6f97603bf4deb225c11ad35537325');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDebrisFlingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSpeedFeelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDebrisFlingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SpeedFeel release');
 assert.equal(manifest.previousFixtureCount,6295);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6295);
}
