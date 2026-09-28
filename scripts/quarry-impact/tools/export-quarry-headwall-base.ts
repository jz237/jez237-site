/** One-time, pre-edit geometry capture. Never replace the historical fixture. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import * as T from 'three';
import { cliffGeometry, quarryColliderLayout, terrainGeometry } from '../src/quarry-layout';
import { exactMinimumClearance } from '../tests/mesh-clearance';

const startCell=350,endCellExclusive=385,sections=[350,362,374,385];
const fixture='tests/fixtures/quarry-headwall-baseline.json',output='source/models/quarry-headwall-base.json';
if(fs.existsSync(fixture)||fs.existsSync(output))throw new Error('Headwall baseline already exists; do not overwrite captured provenance.');
const g=cliffGeometry(),terrain=terrainGeometry(),rows:{p:number[];uv:number[];color:number[]}[][]=[];
const finalIndices:number[]=[],upper:number[]=[];
for(let band=0;band<30;band++)for(let cell=0;cell<360;cell++){
  const b=band*722+cell*2,triangles=[b,b+1,b+2,b+2,b+1,b+3];
  if(cell>=350||cell<25){if(band>=6)upper.push(...triangles);continue;}
  if(cell>=118&&cell<172)continue;
  finalIndices.push(...triangles);
}
const mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.BufferAttribute(g.positions,3));mesh.setIndex(finalIndices);mesh.computeVertexNormals();
const normals=mesh.getAttribute('normal'),uRepeat=g.uv[720*2]-g.uv[0];
const normalBands=Array.from({length:30},(_,band)=>Object.fromEntries([['left',350],['right',25]].map(([side,column])=>[side,[0,1].map(end=>{const v=band*722+Number(column)*2+end;return [normals.getX(v),normals.getY(v),normals.getZ(v)];})])));
for(let row=0;row<=30;row++){
  const samples=[];
  for(let cell=startCell;cell<=endCellExclusive;cell++){
    const column=cell%360,v=row===0?column*2:(row-1)*722+column*2+1;
    samples.push({p:Array.from(g.positions.slice(v*3,v*3+3)),uv:[g.uv[v*2]+Math.floor(cell/360)*uRepeat,g.uv[v*2+1]],color:Array.from(g.colors.slice(v*3,v*3+3))});
  }
  rows.push(samples);
}
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const hashArray=(array:Float32Array|Uint32Array)=>hash(new Uint8Array(array.buffer,array.byteOffset,array.byteLength));
const paths=['src/quarry-layout.ts','src/quarry-cut-collision.json','public/models/quarry-cut.glb','src/quarry-roadside-data.json','public/models/quarry-roadside.glb','src/quarry-extension-collision.json','public/models/quarry-extension.glb','src/quarry-backdrop-trees.json','src/quarry-surface-sampler.ts','public/models/coupe.glb','public/models/sedan.glb','public/models/hatch.glb'];
const colliders=quarryColliderLayout(),clearance=exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrain);
const canonicalSeamMaximum=Math.max(...Array.from({length:30},(_,band)=>Math.hypot(...[0,1,2].map(axis=>g.positions[(band*722+720)*3+axis]-g.positions[band*722*3+axis]))));
fs.writeFileSync(output,JSON.stringify({version:1,startCell,endCellExclusive,cellRanges:[[350,360],[0,25]],sections,rows,normalBands,preservedApron:{startCell,endCellExclusive,throughRow:6},terrainSource:'quarry-roadside-base.json',wrap:{uRepeat,canonicalColumnAt360:0,maximumOriginalSeamRoundingMeters:canonicalSeamMaximum}}));
fs.writeFileSync(fixture,JSON.stringify({capturedAt:new Date().toISOString(),files:Object.fromEntries(paths.map(path=>[path,hash(fs.readFileSync(path))])),cliffPositions:hashArray(g.positions),cliffIndices:hashArray(g.indices),terrainPositions:hashArray(terrain.positions),terrainIndices:hashArray(terrain.indices),canonicalSeamMaximum,upperLegacyClearance:clearance,colliders:colliders.map(s=>({id:s.id,p:s.p,hash:hash(Buffer.from(JSON.stringify(s)))}))},null,2)+'\n');
console.log(JSON.stringify({rows:rows.length,columns:rows[0].length,uRepeat,canonicalSeamMaximum,colliders:colliders.length,baseHash:hash(fs.readFileSync(output)),upperLegacyClearance:clearance,profiles:[350,0,10,20,25].map(angle=>({angle,rows:rows.map(row=>({r:Math.hypot(row[(angle+360-startCell)%360].p[0]/1.08,row[(angle+360-startCell)%360].p[2]),y:row[(angle+360-startCell)%360].p[1]}))}))},null,2));mesh.dispose();
