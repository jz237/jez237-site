import {restoreRattleClipsBytes} from './rattle-clips-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sound-levels/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSoundLevelsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SoundLevels baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSoundLevelsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRattleClipsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSoundLevelsPrevious(file);
}
export function verifySoundLevelsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'417f12871c2240bf40b561bf448d6f7e1e0c97aa');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRattleClipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSoundLevelsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRattleClipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SoundLevels release');
 assert.equal(manifest.previousFixtureCount,7277);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7277);
}
