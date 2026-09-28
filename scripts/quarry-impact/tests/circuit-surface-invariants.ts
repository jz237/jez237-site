import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { quarryColliderLayout } from '../src/quarry-layout';

export const circuitBefore=JSON.parse(readFileSync(new URL('./fixtures/circuit-surface-baseline.json',import.meta.url),'utf8'));
export const circuitBase=JSON.parse(readFileSync(new URL('../source/circuit-surface-base.json',import.meta.url),'utf8'));
export const circuitHash=(v:Uint8Array|string)=>createHash('sha256').update(v).digest('hex');
export const circuitArrayHash=(v:ArrayBufferView)=>circuitHash(new Uint8Array(v.buffer,v.byteOffset,v.byteLength));
const descriptor=(values:Float32Array,itemSize:number)=>({count:values.length/itemSize,itemSize,normalized:false,sha256:circuitArrayHash(values)});

/** Exact source inverse for the older East Bay source gate. These five
 * enumerated edits are the complete surface-factory integration; every other
 * source byte must still recover the immutable published checksum. */
export function restoreCircuitSurfaceSource(bytes:Buffer){
  let source=bytes.toString('utf8');const nl=source.includes('\r\n')?'\r\n':'\n';
  const replace=(from:string[],to:string[])=>{
    const token=from.join(nl);assert.equal(source.split(token).length,2,'unique approved circuit integration');source=source.replace(token,to.join(nl));
  };
  replace(["import { attachCircuitCoordinates, isCircuitAsphaltCell } from './scenery-circuit-layout';",''],['']);
  replace(['export function roadsideDetails(parent: T.Group, circuitMaterial?: T.MeshStandardMaterial) {'],['export function roadsideDetails(parent: T.Group) {']);
  replace(['    const shoulders = circuitMaterial ?? quarryAggregate();'],['    const shoulders = quarryAggregate();']);
  replace(['        attachCircuitCoordinates(g, .1);','        const edgeBlend = new Float32Array(p.count);','        for (let i = 0; i < p.count; i++) edgeBlend[i] = i % 2 === 0 ? 1 : 0;',"        g.setAttribute('circuitEdge', new T.BufferAttribute(edgeBlend, 1));",''],['']);
  replace(['            // Paved sections now use finite, authored tire passes. Keep the','            // previous markings on gravel and preserve all ribbon geometry.','            fade[i] = isCircuitAsphaltCell(cell) ? 0 : t * t * (3 - 2 * t);'],['            fade[i] = t * t * (3 - 2 * t);']);
  const original=Buffer.from(source,'utf8');
  assert.equal(circuitHash(original),circuitBefore.protectedFiles['src/scenery-surfaces.ts'],'all unrelated surface source bytes remain exact');
  return original;
}

/** Narrow inverse for historical appearance gates. All original objects and
 * attributes remain exact; only these two material consumers and the four
 * former asphalt wear weights may evolve. Frozen fixtures are never rewritten. */
export function restoreCircuitObjects(objects:any[]){
  const restored=structuredClone(objects),old=circuitBefore.objects;
  assert.equal(restored.length,old.length);
  const laneSHA=circuitArrayHash(new Float32Array(circuitBase.lane.positions));
  const shoulderSHA=circuitArrayHash(new Float32Array(circuitBase.shoulders.flatMap((s:any)=>s.positions)));
  const oldShoulder=old.filter((o:any)=>o.geometry.attributes.position.sha256===shoulderSHA);
  assert.equal(oldShoulder.length,1);
  const coordinateArrays=(data:any[])=>{
    const metres:number[]=[],edge:number[]=[];
    for(const part of data)for(let i=0;i<722;i++){
      const row=Math.floor(i/2),frame=part.lookAheadCells===.1?circuitBase.rows[row].ribbonFrame:circuitBase.rows[row];
      const x=part.positions[i*3]-frame.center.x,z=part.positions[i*3+2]-frame.center.z;
      metres.push(frame.s,x*frame.lateral.x+z*frame.lateral.z);edge.push(part.side?(i%2===0?1:0):1);
    }
    return {metres:descriptor(new Float32Array(metres),2),edge:descriptor(new Float32Array(edge),1)};
  };
  const laneCoordinates=coordinateArrays([circuitBase.lane]),shoulderCoordinates=coordinateArrays(circuitBase.shoulders);
  let lanes=0,shoulders=0,marks=0;
  for(let i=0;i<restored.length;i++){
    const entry=restored[i],original=old[i],sha=entry.geometry.attributes.position.sha256;
    assert.equal(sha,original.geometry.attributes.position.sha256,'object order and every physical vertex remain fixed');
    if(sha===laneSHA||sha===shoulderSHA){
      const coordinates=sha===laneSHA?laneCoordinates:shoulderCoordinates;
      assert.deepEqual(entry.geometry.attributes.circuitMetres,coordinates.metres);
      assert.deepEqual(entry.geometry.attributes.circuitEdge,coordinates.edge);
      delete entry.geometry.attributes.circuitMetres;delete entry.geometry.attributes.circuitEdge;
      const next=entry.materials[0],aggregate=oldShoulder[0].materials[0];
      assert.match(next.shader.programKey,/^authored-asphalt-circuit-v\d+$/);
      assert.equal(next.name,'authored-asphalt-circuit');
      for(const [key,value]of Object.entries(aggregate.shader.uniforms))assert.deepEqual(next.shader.uniforms[key],value,`base aggregate uniform ${key}`);
      assert.deepEqual({...next,name:aggregate.name,shader:aggregate.shader},aggregate,'new material preserves all aggregate base parameters and registered maps');
      entry.materials[0]=structuredClone(original.materials[0]);
      if(sha===laneSHA)lanes++;else shoulders++;
    }
    if(entry.materials[0].shader.programKey==='road-marks-transition-v1'){
      assert.equal(entry.geometry.attributes.position.count,722);
      const before=new Float32Array(722),after=new Float32Array(722);
      for(let vertex=0;vertex<722;vertex++){
        const cell=Math.floor(vertex/2),distance=Math.max(123-cell,cell-182,0),t=Math.min(1,distance/4);
        before[vertex]=t*t*(3-2*t);
        const c=circuitBase.cells[cell%360];after[vertex]=c.asphalt&&!c.authoredGravel?0:before[vertex];
      }
      assert.deepEqual(original.geometry.attributes.wearAlpha,descriptor(before,1));
      assert.deepEqual(entry.geometry.attributes.wearAlpha,descriptor(after,1),'only former asphalt marks can be hidden');
      entry.geometry.attributes.wearAlpha=structuredClone(original.geometry.attributes.wearAlpha);marks++;
    }
  }
  assert.deepEqual({lanes,shoulders,marks},{lanes:1,shoulders:1,marks:4});
  assert.deepEqual(restored,old,'all other transforms, geometry, material outputs, instance colors, draw groups and shadows stay exact');
  return restored;
}

export async function assertCircuitPhysicsUnchanged(){
  const adapter=new URL('../multiplayer/.generated/rapier-worker.mjs',import.meta.url);
  if(!existsSync(adapter))await import(new URL('../multiplayer/prepare-rapier.mjs',import.meta.url).href);
  assert.equal(circuitBefore.workerInputs.length,20);
  const inputs=circuitBefore.workerInputs.map(({file,expected}:{file:string;expected:string})=>{
    const current=circuitHash(readFileSync(new URL('../'+file,import.meta.url)));
    assert.equal(current,expected,`${file}: all deployed Worker inputs remain byte-identical`);
    return {file,expected,current};
  });
  const colliders=quarryColliderLayout().map(s=>({id:s.id,sha256:circuitHash(JSON.stringify(s))}));
  assert.equal(colliders.length,2287);assert.deepEqual(colliders,circuitBefore.colliders);
  return {deployedVersion:circuitBefore.deployedVersion,inputs,colliders};
}
