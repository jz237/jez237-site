/** One-time immutable visual baseline handoff; ordinary tests never recapture it. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { trackPoint, terrainHeight, surfaceAt } from '../src/rules';
import { roadRibbon } from '../src/scenery-surfaces';
import { CIRCUIT_ARC_METRES, CIRCUIT_LENGTH, CIRCUIT_SEGMENTS, circuitFrame } from '../src/scenery-circuit-layout';

const output='source/circuit-surface-base.json';
assert.ok(!fs.existsSync(output),'The pre-edit circuit baseline is immutable');
const before=JSON.parse(fs.readFileSync('tests/fixtures/circuit-surface-baseline.json','utf8'));
const hash=(v:ArrayBufferView)=>createHash('sha256').update(new Uint8Array(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
const positions:number[]=[],uv:number[]=[],indices:number[]=[];
for(let i=0;i<=360;i++){
  const {center,lateral}=circuitFrame(i);
  for(const side of [-1,1]){const x=center.x+lateral.x*side*6,z=center.z+lateral.z*side*6;positions.push(x,terrainHeight(x,z)+.06,z);uv.push(x/2,z/2);}
}
for(let i=0;i<360;i++){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
const lane=new T.BufferGeometry();lane.setAttribute('position',new T.Float32BufferAttribute(positions,3));lane.setAttribute('uv',new T.Float32BufferAttribute(uv,2));lane.setIndex(indices);lane.computeVertexNormals();
const snapshot=(g:T.BufferGeometry)=>({positions:Array.from(g.attributes.position.array),normals:Array.from(g.attributes.normal.array),uv:Array.from(g.attributes.uv.array),indices:Array.from(g.index!.array)});
const matching=(g:T.BufferGeometry)=>before.objects.filter((o:any)=>o.geometry.attributes.position.sha256===hash(g.attributes.position.array));
assert.equal(matching(lane).length,1);const originalLane=matching(lane)[0];
for(const name of ['position','normal','uv'])assert.equal(hash(lane.attributes[name].array),originalLane.geometry.attributes[name].sha256);
assert.equal(hash(lane.index!.array),originalLane.geometry.indices.sha256);
const shoulderGeometries:T.BufferGeometry[]=[];
const shoulders=[-1,1].map(side=>{
  const g=roadRibbon(side*5.78,side*8.6,360,true,true),p=g.attributes.position,u=g.attributes.uv;
  for(let i=0;i<p.count;i++)u.setXY(i,p.getX(i)/2,p.getZ(i)/2);
  shoulderGeometries.push(g.clone().applyMatrix4(new T.Matrix4()));
  const out={side,lookAheadCells:.1,...snapshot(g)};g.dispose();return out;
});
const combined=mergeGeometries(shoulderGeometries)!;
assert.equal(matching(combined).length,1,'actual scene batches both shoulders without moving them');
const originalShoulders=matching(combined)[0];
for(const name of ['position','normal','uv'])assert.equal(hash(combined.attributes[name].array),originalShoulders.geometry.attributes[name].sha256);
assert.equal(hash(combined.index!.array),originalShoulders.geometry.indices.sha256);
combined.dispose();shoulderGeometries.forEach(g=>g.dispose());
const rows=Array.from({length:361},(_,cell)=>({cell,...circuitFrame(cell),ribbonFrame:circuitFrame(cell,.1),centerHeight:terrainHeight(trackPoint(cell/360).x,trackPoint(cell/360).z)}));
const cells=Array.from({length:360},(_,cell)=>({cell,startMetres:CIRCUIT_ARC_METRES[cell],endMetres:CIRCUIT_ARC_METRES[cell+1],asphalt:trackPoint(cell/360).z>=-20,authoredGravel:cell>=123&&cell<182}));
const tractionSamples=rows.flatMap(row=>Array.from({length:41},(_,j)=>{const lateral=j*.5-10,x=row.center.x+row.lateral.x*lateral,z=row.center.z+row.lateral.z*lateral;return {cell:row.cell,lateral,x,z,surface:surfaceAt(x,z)};}));
const result={version:1,capturedAt:new Date().toISOString(),worldSHA256:before.worldSHA256,coordinateSystem:'world X/Y/Z, metres; signed lateral is dot(XZ-center,[tangent.z,-tangent.x])',segments:CIRCUIT_SEGMENTS,lengthMetres:CIRCUIT_LENGTH,mask:{width:2048,height:128,boundsLateral:[-10,10],u:'s / lengthMetres; RepeatWrapping',v:'(signed lateral + 10) / 20; ClampToEdgeWrapping',flipY:false,channels:['asphaltCoverage','repair','rubber','mineralDeposits']},authoredGravel:{startCell:123,endCellExclusive:182},rows,cells,lane:{lookAheadCells:.2,...snapshot(lane),groups:originalLane.geometry.groups},shoulders,tractionSamples};
fs.writeFileSync(output,JSON.stringify(result)+'\n');lane.dispose();
console.log(JSON.stringify({output,lengthMetres:CIRCUIT_LENGTH,asphaltCells:cells.filter(c=>c.asphalt).length,bytes:fs.statSync(output).size,rows:rows.length,tractionSamples:tractionSamples.length}));
