/** One-time released geometry capture. Requires explicit deployment evidence;
 * subsequent tests use the new tracked fixture, never private output files.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {cliffGeometry,terrainGeometry,quarryColliderLayout,rockPlacements,screePlacements,nearTrees,saplingPlacements,quarryHeadwallGeometry} from '../src/quarry-layout';
import {trackPoint} from '../src/rules';
import {createSurfaceSampler} from '../src/quarry-surface-sampler';
import {exactMinimumClearance} from '../tests/mesh-clearance';
import {captureNorthForest} from './north-forest-edge-audit';

const evidence=process.argv[2];assert.ok(evidence,'Pass the explicit already-verified deployment evidence for this initial capture');
const fixture='tests/fixtures/quarry-east-bay-baseline.json',output='source/models/quarry-east-bay-base.json';
assert.equal(fs.existsSync(fixture)||fs.existsSync(output),false,'Never overwrite frozen east-bay provenance');
const hash=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const arrayHash=(a:ArrayBufferView)=>hash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const jsonHash=(v:unknown)=>hash(JSON.stringify(v));
const deployed=JSON.parse(fs.readFileSync(evidence,'utf8'));assert.equal(deployed.version,'d50acf91-7242-4b8a-a40f-0e9674eb3b0c');assert.equal(Object.keys(deployed.sourceHashes).length,19);
for(const [file,sha]of Object.entries(deployed.sourceHashes))assert.equal(hash(fs.readFileSync(file)),sha,'Released Worker input changed before capture: '+file);
const startCell=25,endCellExclusive=55,sections=[25,35,45,55],g=cliffGeometry(),terrain=terrainGeometry(),ground=createSurfaceSampler(terrain),layout=quarryColliderLayout();assert.equal(layout.length,2283);
const terrainFile='source/models/quarry-roadside-base.json',frozenTerrain=JSON.parse(fs.readFileSync(terrainFile,'utf8')).terrain;
assert.equal(arrayHash(terrain.positions),arrayHash(new Float32Array(frozenTerrain.positions)),'Frozen terrain position bytes');
const oldTerrain=JSON.parse(fs.readFileSync('tests/fixtures/quarry-headwall-baseline.json','utf8'));assert.equal(arrayHash(terrain.indices),oldTerrain.terrainIndices,'Unchanged terrain triangulation');
console.log('Released inputs and terrain verified');
const originalIndices:number[]=[],retainedIndices:number[]=[],upper:number[]=[];
for(let i=0;i<g.indices.length;i+=3){const tri=Array.from(g.indices.slice(i,i+3)),cell=Math.floor((Math.min(...tri)%722)/2);if(cell>=startCell&&cell<endCellExclusive){originalIndices.push(...tri);if(Math.floor(tri[0]/722)>=6)upper.push(...tri);}else retainedIndices.push(...tri);}
assert.equal(originalIndices.length/3,1800);
const retained=new T.BufferGeometry();retained.setAttribute('position',new T.BufferAttribute(g.positions,3));retained.setIndex(retainedIndices);retained.computeVertexNormals();const normals=retained.attributes.normal;
const priorBase=JSON.parse(fs.readFileSync('source/models/quarry-headwall-base.json','utf8'));
const uOffset=priorBase.wrap.uRepeat;
const rows=Array.from({length:31},(_,row)=>Array.from({length:31},(_,col)=>{
  const cell=startCell+col,v=row===0?cell*2:(row-1)*722+cell*2+1;
  return {p:Array.from(g.positions.slice(v*3,v*3+3)),uv:[Math.fround(g.uv[v*2]+uOffset),g.uv[v*2+1]],color:Array.from(g.colors.slice(v*3,v*3+3))};
}));
const normalBands=Array.from({length:30},(_,band)=>({left:priorBase.normalBands[band].right,right:[0,1].map(end=>{const i=band*722+endCellExclusive*2+end;return [normals.getX(i),normals.getY(i),normals.getZ(i)];})}));
const headwall=quarryHeadwallGeometry(),angle=startCell*Math.PI/180;
const onSeam=(p:number[])=>Math.abs(p[0]/1.08*Math.cos(angle)-p[2]*Math.sin(angle))<2e-5;
const key=(p:number[])=>p.map(Math.fround).join(',');
const boundaryEdges=new Map<string,{a:number[];b:number[];count:number}>();
for(let i=0;i<headwall.indices.length;i+=3)for(let e=0;e<3;e++){
  const a=Array.from(headwall.positions.slice(headwall.indices[i+e]*3,headwall.indices[i+e]*3+3)),b=Array.from(headwall.positions.slice(headwall.indices[i+(e+1)%3]*3,headwall.indices[i+(e+1)%3]*3+3));
  if(!onSeam(a)||!onSeam(b))continue;const k=[key(a),key(b)].sort().join('|'),edge=boundaryEdges.get(k)??{a,b,count:0};edge.count++;boundaryEdges.set(k,edge);
}
const actualHeadwallEdges=[...boundaryEdges.values()].filter(e=>e.count===1).map(({a,b})=>[a,b]);
const edgePoints=new Map<string,number[]>();for(const edge of actualHeadwallEdges)for(const p of edge)edgePoints.set(key(p),p);
const collisionEdgeVertices=[...edgePoints.values()].sort((a,b)=>Math.hypot(a[0]/1.08,a[2])-Math.hypot(b[0]/1.08,b[2])||a[1]-b[1]);
console.log('Legacy sector and actual headwall seam extracted');
const headwallBytes=fs.readFileSync('public/models/quarry-headwall.glb'),gltf=await new GLTFLoader().parseAsync(new Uint8Array(headwallBytes).buffer,'');gltf.scene.updateMatrixWorld(true);
const edgeRender:{near:any[];far:any[]}={near:[],far:[]};
gltf.scene.traverse(o=>{
  if(!(o instanceof T.Mesh)||!/^HeadwallRock_2_(near|far)$/.test(o.name))return;
  const level=o.name.endsWith('_near')?'near':'far',position=o.geometry.attributes.position,normal=o.geometry.attributes.normal,uv=o.geometry.attributes.uv,color=o.geometry.attributes.color,normalMatrix=new T.Matrix3().getNormalMatrix(o.matrixWorld),point=new T.Vector3(),n=new T.Vector3();
  for(let i=0;i<position.count;i++){
    point.fromBufferAttribute(position,i).applyMatrix4(o.matrixWorld);const p=point.toArray();if(!onSeam(p))continue;
    n.fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize();
    edgeRender[level].push({p,uv:[uv.getX(i),1-uv.getY(i)],gltfUV:[uv.getX(i),uv.getY(i)],normal:n.toArray(),color:color?[color.getX(i),color.getY(i),color.getZ(i)]:null});
  }
});
for(const level of ['near','far'] as const){const renderKeys=new Set(edgeRender[level].map(s=>key(s.p)));for(const p of collisionEdgeVertices)assert.ok(renderKeys.has(key(p)),'Actual headwall collider and rendered edge differ');}
const toeClearance=Array.from({length:30},(_,cell)=>{
  const a=rows[0][cell].p,b=rows[0][cell+1].p,values=Array.from({length:17},(_,i)=>{const t=i/16,p=a.map((n,j)=>n+(b[j]-n)*t);return p[1]-ground.height(p[0],p[2])!;});
  return {cell:cell+25,minimum:Math.min(...values),maximum:Math.max(...values)};
});
const localPositions=rows.flatMap(row=>row.flatMap(sample=>sample.p)),localIndices:number[]=[];
for(let row=0;row<30;row++)for(let col=0;col<30;col++){const a=row*31+col,b=a+31;localIndices.push(a,b,a+1,a+1,b,b+1);}
const scatter={rocks:[0,1,2].map(variant=>({variant,placements:rockPlacements(variant)})),scree:screePlacements(),nearTrees:[0,1,2].map(i=>({kind:'fir-'+i,placements:nearTrees('fir-'+i)})),saplings:[0,1,2].map(variant=>({variant,placements:saplingPlacements(variant)}))};
console.log('Headwall render seam verified; measuring backing clearance');
const clearance=exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrain);
console.log('Capturing unchanged actual forest renderer');
const forest=await captureNorthForest();
const base={version:1,startCell,endCellExclusive,cellRanges:[[25,55]],sections,rows,normalBands,preservedApron:{startCell,endCellExclusive,throughRow:6},uvOffsetU:uOffset,
  originalSurface:{positions:localPositions,indices:localIndices},terrainSource:'quarry-roadside-base.json',terrainSourceSHA256:hash(fs.readFileSync(terrainFile)),
  headwallJoin:{angleDegrees:25,source:'../../public/models/quarry-headwall.glb',sourceSHA256:hash(headwallBytes),collisionSource:'../../src/quarry-headwall-collision.json',collisionSHA256:hash(fs.readFileSync('src/quarry-headwall-collision.json')),collisionEdgeVertices,collisionBoundaryEdges:actualHeadwallEdges,render:edgeRender,uvConvention:'Runtime TextureLoader convention; glTF V is restored1-v. New U offset equals a full310-tile ring repeat to match accepted25-degree headwall.'},
  toeClearance,scatter,track:Array.from({length:480},(_,i)=>trackPoint(i/480))};
const files=[...Object.keys(deployed.sourceHashes),'src/world.ts','src/scenery-surfaces.ts','src/scenery-vegetation.ts','src/scenery-headwall.ts','src/vehicle.ts','src/car-materials.ts','src/assets.ts','src/static-shadows.ts','public/models/quarry-headwall.glb','public/models/quarry-cut.glb','public/models/quarry-extension.glb','public/models/quarry-roadside.glb','public/models/quarry-road-approach.glb','public/models/coupe.glb','public/models/sedan.glb','public/models/hatch.glb','public/models/quarry-north-fir-0.glb','public/models/quarry-north-fir-1.glb','public/models/quarry-north-fir-2.glb'];
fs.writeFileSync(output,JSON.stringify(base));
const baseline={capturedAt:new Date().toISOString(),releasedSource:'f2cbc2944830b4c1b4283fda6be240c0bedb863a',deployedVersion:deployed.version,workerInputs:deployed.sourceHashes,baseSHA256:hash(fs.readFileSync(output)),files:Object.fromEntries([...new Set(files)].map(file=>[file,hash(fs.readFileSync(file==='src/world.ts'?'../releases/jez237-quarry-impact/scripts/quarry-impact/'+file:file))])),releasedFileOverrides:{'src/world.ts':'../releases/jez237-quarry-impact/scripts/quarry-impact/src/world.ts'},
  cliff:{positions:arrayHash(g.positions),indices:arrayHash(g.indices),uv:arrayHash(g.uv),colors:arrayHash(g.colors),triangles:g.indices.length/3,retainedIndicesAfterReplacement:retainedIndices},terrain:{positions:arrayHash(terrain.positions),indices:arrayHash(terrain.indices)},
  colliders:layout.map(s=>({id:s.id,p:s.p,sha256:jsonHash(s)})),scatter,forest:{cards:forest.cards.length,cardsSHA256:jsonHash(forest.cards),meshesSHA256:jsonHash(forest.meshes),lodsSHA256:jsonHash(forest.lods),random:forest.random},upperLegacyClearance:clearance,toeClearance};
fs.writeFileSync(fixture,JSON.stringify(baseline,null,2)+'\n');
console.log(JSON.stringify({output,fixture,baseSHA256:baseline.baseSHA256,fixtureSHA256:hash(fs.readFileSync(fixture)),rows:31,columns:31,replacedTriangles:1800,colliders:layout.length,workerInputs:Object.keys(deployed.sourceHashes).length,headwallSeamPoints:collisionEdgeVertices.length,headwallSeamEdges:actualHeadwallEdges.length,headwallRenderSamples:{near:edgeRender.near.length,far:edgeRender.far.length},upperLegacyClearance:clearance,toeClearanceRange:[Math.min(...toeClearance.map(p=>p.minimum)),Math.max(...toeClearance.map(p=>p.maximum))]},null,2));
retained.dispose();gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
