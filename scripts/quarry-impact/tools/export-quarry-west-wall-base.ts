/** One-time accepted Dew9/201b4465 capture; subsequent tests use tracked
 * fixtures only. Never overwrite the immutable pre-west-wall provenance. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import * as T from 'three';
import {cliffGeometry,terrainGeometry,quarryColliderLayout,rockPlacements,screePlacements,nearTrees,saplingPlacements} from '../src/quarry-layout';
import {trackPoint} from '../src/rules';
import {createSurfaceSampler} from '../src/quarry-surface-sampler';
import {exactMinimumClearance} from '../tests/mesh-clearance';
import {captureArenaFloor} from './arena-floor-audit';
import {captureNorthForest} from './north-forest-edge-audit';

const evidence=process.argv[2];assert.ok(evidence,'Pass explicit already-verified Worker readiness evidence for this first capture');
const fixture='tests/fixtures/quarry-west-wall-baseline.json',output='source/models/quarry-west-wall-base.json',scatterFile='tests/fixtures/quarry-west-wall-legacy-scatter.json.gz';
for(const file of [fixture,output,scatterFile])assert.equal(fs.existsSync(file),false,'Never overwrite western wall provenance: '+file);
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
const arrayHash=(a:ArrayBufferView)=>hash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const jsonHash=(v:unknown)=>hash(JSON.stringify(v));
const deployed=JSON.parse(fs.readFileSync(evidence,'utf8'));assert.equal(Object.keys(deployed.sourceHashes).length,22);
for(const [file,sha]of Object.entries(deployed.sourceHashes))assert.equal(hash(fs.readFileSync(file)),sha,'Accepted Worker input changed before capture: '+file);
const app='dist/assets/index-Dew9mhki.js',appSHA='b51476a668aafc2e0d3ed072a7528261647393a2bab0f21f7921e09bb8446d60';
assert.equal(hash(fs.readFileSync(app)),appSHA,'This capture identifies the accepted Dew9 build, not current remote HTTP state');
const startCell=275,endCellExclusive=325,sections=[275,292,309,325],columns=endCellExclusive-startCell+1;
const g=cliffGeometry(),terrain=terrainGeometry(),ground=createSurfaceSampler(terrain),layout=quarryColliderLayout();assert.equal(layout.length,2287);
const terrainFile='source/models/quarry-roadside-base.json',frozenTerrain=JSON.parse(fs.readFileSync(terrainFile,'utf8')).terrain;
assert.equal(arrayHash(terrain.positions),arrayHash(new Float32Array(frozenTerrain.positions)));
const terrainReference=JSON.parse(fs.readFileSync('tests/fixtures/quarry-east-bay-baseline.json','utf8'));
assert.equal(arrayHash(terrain.indices),terrainReference.terrain.indices);
const originalIndices:number[]=[],retainedIndices:number[]=[],upper:number[]=[],apron:number[]=[];
for(let i=0;i<g.indices.length;i+=3){
  const tri=Array.from(g.indices.slice(i,i+3)),cell=Math.floor((Math.min(...tri)%722)/2),band=Math.floor(Math.min(...tri)/722);
  if(cell>=startCell&&cell<endCellExclusive){originalIndices.push(...tri);(band<6?apron:upper).push(...tri);}else retainedIndices.push(...tri);
}
assert.equal(originalIndices.length/3,3000);assert.equal(apron.length/3,600);
const released=new T.BufferGeometry();released.setAttribute('position',new T.BufferAttribute(g.positions,3));released.setIndex(new T.BufferAttribute(g.indices,1));released.computeVertexNormals();
const retained=new T.BufferGeometry();retained.setAttribute('position',new T.BufferAttribute(g.positions,3));retained.setIndex(retainedIndices);retained.computeVertexNormals();
const normals=released.attributes.normal,edgeNormals=retained.attributes.normal;
const rows=Array.from({length:31},(_,row)=>Array.from({length:columns},(_,col)=>{
  const cell=startCell+col,v=row===0?cell*2:(row-1)*722+cell*2+1;
  return {p:Array.from(g.positions.slice(v*3,v*3+3)),uv:Array.from(g.uv.slice(v*2,v*2+2)),color:Array.from(g.colors.slice(v*3,v*3+3)),normal:[normals.getX(v),normals.getY(v),normals.getZ(v)]};
}));
const apronNormals=Array.from({length:6},(_,band)=>Array.from({length:columns},(_,col)=>[0,1].map(end=>{
  const i=band*722+(startCell+col)*2+end;return [normals.getX(i),normals.getY(i),normals.getZ(i)];
})));
const normalBands=Array.from({length:30},(_,band)=>Object.fromEntries([['left',startCell],['right',endCellExclusive]].map(([side,cell])=>[side,[0,1].map(end=>{
  const i=band*722+Number(cell)*2+end;return [edgeNormals.getX(i),edgeNormals.getY(i),edgeNormals.getZ(i)];
})])));
const localPositions=rows.flatMap(row=>row.flatMap(s=>s.p)),localIndices:number[]=[];
for(let row=0;row<30;row++)for(let col=0;col<columns-1;col++){const a=row*columns+col,b=a+columns;localIndices.push(a,b,a+1,a+1,b,b+1);}
const toeClearance=Array.from({length:columns-1},(_,i)=>{
  const a=rows[0][i].p,b=rows[0][i+1].p,values=Array.from({length:33},(_,j)=>{const t=j/32,p=a.map((v,k)=>v+(b[k]-v)*t);return p[1]-ground.height(p[0],p[2])!;});
  return {cell:startCell+i,minimum:Math.min(...values),maximum:Math.max(...values)};
});
const scatter={rocks:[0,1,2].map(variant=>({variant,placements:rockPlacements(variant)})),scree:screePlacements(),nearTrees:[0,1,2].map(i=>({kind:'fir-'+i,placements:nearTrees('fir-'+i)})),saplings:[0,1,2].map(variant=>({variant,placements:saplingPlacements(variant)}))};
const base={version:1,startCell,endCellExclusive,cellRanges:[[startCell,endCellExclusive]],sections,rows,normalBands,apronNormals,
  preservedApron:{startCell,endCellExclusive,throughRow:6,triangleCount:600,normalConvention:'Released per-band split vertices. The new upper side at row6 must use apronNormals[5][column][1] before a short transition.'},
  originalSurface:{positions:localPositions,indices:localIndices,normals:rows.flatMap(row=>row.flatMap(s=>s.normal))},
  terrainSource:'quarry-roadside-base.json',terrainSourceSHA256:hash(fs.readFileSync(terrainFile)),toeClearance,scatter,track:Array.from({length:1440},(_,i)=>trackPoint(i/1440))};
console.log('Accepted source and exact geometry captured; recording actual scene and forest invariants');
const scene=await captureArenaFloor(),forest=await captureNorthForest();
const selected=layout.filter(s=>/^(scanned-rock-|scree-)/.test(s.id));
const scatterBytes=Buffer.from(JSON.stringify(selected,(_key,v)=>ArrayBuffer.isView(v)?Array.from(v as any):v));
const files=[...Object.keys(deployed.sourceHashes),'src/world.ts','src/main.ts','src/scenery-surfaces.ts','src/scenery-geology-material.ts','src/scenery-north-crest.ts','src/scenery-circuit-layout.ts','src/scenery-circuit-material.ts','src/scenery-vegetation.ts','src/vehicle.ts','src/car-materials.ts','src/assets.ts','src/static-shadows.ts',
  ...fs.readdirSync('public/models').filter(f=>f.endsWith('.glb')).map(f=>'public/models/'+f),'public/assets/circuit-surface.rgba.gz','source/circuit-grip-manifest.json','source/circuit-surface-base.json'];
fs.writeFileSync(output,JSON.stringify(base));fs.writeFileSync(scatterFile,gzipSync(scatterBytes,{level:9}));
const baseline={capturedAt:new Date().toISOString(),releasedSource:'31650597a42d4f52022752ed02acbefd4acbadc9',build:{file:app,sha256:appSHA},deployedVersion:'201b4465-e7e8-4141-8656-9f369e11e794',
  provenance:'Accepted local Dew9 source/build and previously verified 22-input Worker readiness. This is not a fresh remote-site HTTP verification.',
  workerInputs:deployed.sourceHashes,baseSHA256:hash(fs.readFileSync(output)),files:Object.fromEntries([...new Set(files)].map(file=>[file,hash(fs.readFileSync(file))])),
  cliff:{positions:arrayHash(g.positions),indices:arrayHash(g.indices),uv:arrayHash(g.uv),colors:arrayHash(g.colors),normals:arrayHash(normals.array),triangles:g.indices.length/3,originalSectorIndices:originalIndices,retainedIndicesAfterReplacement:retainedIndices},
  terrain:{positions:arrayHash(terrain.positions),indices:arrayHash(terrain.indices)},colliders:layout.map(s=>({id:s.id,p:s.p,sha256:jsonHash(s)})),scatter,
  frozenScatter:{file:scatterFile,sha256:hash(fs.readFileSync(scatterFile)),decodedSHA256:hash(scatterBytes),count:selected.length},
  scene:{objects:scene.objects,random:scene.random,counts:scene.counts},forest:{cards:forest.cards.length,cardsSHA256:jsonHash(forest.cards),meshesSHA256:jsonHash(forest.meshes),lodsSHA256:jsonHash(forest.lods),random:forest.random},
  upperLegacyClearance:exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrain),apronLegacyClearance:exactMinimumClearance({positions:g.positions,indices:new Uint32Array(apron)},terrain),toeClearance};
fs.writeFileSync(fixture,JSON.stringify(baseline,null,2)+'\n');
console.log(JSON.stringify({output,fixture,baseSHA256:baseline.baseSHA256,fixtureSHA256:hash(fs.readFileSync(fixture)),scatterSHA256:baseline.frozenScatter.sha256,rows:31,columns,replacedTriangles:3000,apronTriangles:600,colliders:layout.length,workerInputs:22,sceneObjects:scene.objects.length,forestCards:forest.cards.length,upperClearance:baseline.upperLegacyClearance.minimum,toeClearance:[Math.min(...toeClearance.map(p=>p.minimum)),Math.max(...toeClearance.map(p=>p.maximum))]},null,2));
released.dispose();retained.dispose();
