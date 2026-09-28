import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
export const gripBefore=JSON.parse(readFileSync(new URL('./fixtures/circuit-grip-before.json',import.meta.url),'utf8'));
const hash=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const oldFunction=gripBefore.rulesSource.slice(gripBefore.rulesSource.indexOf('export function surfaceAt('),gripBefore.rulesSource.indexOf('export function advanceCheckpoint('));
export const gripRuleBody=[
  'export function surfaceAt(x: number, z: number) {',
  '  const radius = Math.hypot(x, z);',
  "  if (radius < 44) return 'gravel';",
  '  return circuitSurfaceAt(x, z);',
  '}',
  '',
];

/** Preserve each historical whole-file guard by reversing only the explicitly
 * approved surface classification/cache edits and recovering its original SHA. */
export function historicGripBytes(file:string,bytes:Buffer){
  if(file!=='src/rules.ts'&&file!=='multiplayer/simulation.ts')return bytes;
  const expected=gripBefore.workerInputs.find((r:any)=>r.file===file).expected;
  let source=bytes.toString('utf8');const nl=source.includes('\r\n')?'\r\n':'\n';
  const replace=(from:string,to:string)=>{assert.equal(source.split(from).length,2,'unique approved grip evolution in '+file);source=source.replace(from,to);};
  if(file==='src/rules.ts'){
    replace("import { circuitSurfaceAt } from './circuit-grip';"+nl,'');
    replace(gripRuleBody.join(nl),oldFunction);
  }else replace("(s.surface==='asphalt'?3.2:2.4)","(surfaceAt(s.p.x,s.p.z)==='asphalt'?3.2:2.4)");
  const restored=Buffer.from(source,'utf8');assert.equal(hash(restored),expected,'all other historical control/AI/scoring/source bytes remain exact');return restored;
}

/** Only historical release audits use the old classification. The current
 * surfaceAt is independently tested against the exact visible contour. */
export function historicalSurfaceAt(x:number,z:number){
  if(Math.hypot(x,z)<44)return 'gravel';
  let distance=Infinity;
  for(let i=0;i<24;i++){
    const a=i/24*Math.PI*2,px=108*Math.sin(a)+12*Math.sin(a*3),pz=88*Math.cos(a)+9*Math.sin(a*2);
    distance=Math.min(distance,Math.hypot(x-px,z-pz));
  }
  return distance<11&&z>-20?'asphalt':'gravel';
}
