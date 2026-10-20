import {restoreArenaPropsBytes} from './arena-props-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hubcaps/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHubcapsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Hubcaps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHubcapsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreArenaPropsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHubcapsPrevious(file);
}
export function verifyHubcapsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'781313f53cd015696feeaf6ff2f4ea15bea33bcc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreArenaPropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHubcapsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreArenaPropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Hubcaps release');
 assert.equal(manifest.previousFixtureCount,5110);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5110);
}
