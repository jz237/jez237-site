import {restoreDemoDirectionBytes} from './demo-direction-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-buttresses/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableButtressesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableButtresses baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableButtressesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDemoDirectionBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableButtressesPrevious(file);
}
export function verifySableButtressesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fdbe0722cee29532dd758704a0ce4e8ecd120a9c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDemoDirectionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableButtressesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDemoDirectionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableButtresses release');
 assert.equal(manifest.previousFixtureCount,3505);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3505);
}
