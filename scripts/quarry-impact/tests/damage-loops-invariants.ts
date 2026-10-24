import {restoreSoundLevelsBytes} from './sound-levels-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/damage-loops/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDamageLoopsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DamageLoops baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDamageLoopsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSoundLevelsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDamageLoopsPrevious(file);
}
export function verifyDamageLoopsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'06a95205126d3814bc27901b096d9125e875322f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSoundLevelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDamageLoopsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSoundLevelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DamageLoops release');
 assert.equal(manifest.previousFixtureCount,7260);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7260);
}
