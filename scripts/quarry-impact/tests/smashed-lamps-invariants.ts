import {restoreDamageDiagramBytes} from './damage-diagram-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/smashed-lamps/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSmashedLampsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SmashedLamps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSmashedLampsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDamageDiagramBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSmashedLampsPrevious(file);
}
export function verifySmashedLampsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'75ab3e7468e2104678b71e2ba5db23898c8dce7d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDamageDiagramBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSmashedLampsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDamageDiagramBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SmashedLamps release');
 assert.equal(manifest.previousFixtureCount,5020);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5020);
}
