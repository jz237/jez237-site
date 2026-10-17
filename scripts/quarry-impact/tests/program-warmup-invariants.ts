import {restoreKingswellBandstandsBytes} from './kingswell-bandstands-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/program-warmup/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readProgramWarmupPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ProgramWarmup baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreProgramWarmupBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreKingswellBandstandsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readProgramWarmupPrevious(file);
}
export function verifyProgramWarmupRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c8eb3a57d7ed0eb72444838ff1c581e42243ee85');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreKingswellBandstandsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreProgramWarmupBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreKingswellBandstandsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ProgramWarmup release');
 assert.equal(manifest.previousFixtureCount,3915);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3915);
}
