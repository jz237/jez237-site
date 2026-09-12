import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const assets=new URL('../assets/',import.meta.url);
for(const name of ['tideline-r01','coastal-rider'])test(name+' distant geometry preserves articulation, shading and model bounds',()=>{
 const full=JSON.parse(readFileSync(new URL(name+'.json',assets))),lod=JSON.parse(readFileSync(new URL(name+'-lod.json',assets))),source=readFileSync(new URL(name+'.bin',assets)),data=readFileSync(new URL(name+'-lod.bin',assets));
 assert.equal(lod.meshes.length,full.meshes.length);assert.deepEqual(lod.bones,full.bones);
 assert.ok(lod.lod.triangles<lod.lod.originalTriangles*.5);
 for(let i=0;i<full.meshes.length;i++){
  const a=full.meshes[i],b=lod.meshes[i];assert.equal(a.material,b.material);assert.equal(a.bone,b.bone);assert.equal(a.group,b.group);
  assert.ok(b.vertices>0&&b.vertices%3===0&&b.offset+b.vertices*24<=data.length);
  const bounds=(part,buffer)=>{const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let j=0;j<part.vertices;j++){const o=part.offset+j*24;for(let k=0;k<3;k++){const v=buffer.readFloatLE(o+k*4);assert.ok(Number.isFinite(v));min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v);}assert.ok(Math.abs(Math.hypot(buffer.readFloatLE(o+12),buffer.readFloatLE(o+16),buffer.readFloatLE(o+20))-1)<.002);}return {min,max};};
  const x=bounds(a,source),y=bounds(b,data);
  for(let k=0;k<3;k++){const tolerance=Math.max(.015,(x.max[k]-x.min[k])*.02);assert.ok(Math.abs(y.min[k]-x.min[k])<tolerance);assert.ok(Math.abs(y.max[k]-x.max[k])<tolerance);}
 }
});

// Runtime model replacement must inherit an already selected quality level.
test('late-attached craft geometry follows quality without crossing the distance threshold',async()=>{
 const T=await import('../vendor/three.module.js'),{craftGeometryLOD,updateCraftLOD}=await import('../mesh-lod.js');
 const boat=new T.Group(),full=new T.BoxGeometry(),coarse=new T.BoxGeometry(1,1,1),mesh=new T.Mesh(full);boat.add(mesh);
 updateCraftLOD(boat,80,'high');assert.equal(mesh.geometry,full);
 craftGeometryLOD(mesh,coarse);updateCraftLOD(boat,80,'high');assert.equal(mesh.geometry,coarse);
 updateCraftLOD(boat,29,'high');assert.equal(mesh.geometry,coarse,'hysteresis retains distant detail');
 updateCraftLOD(boat,20,'high');assert.equal(mesh.geometry,full);
 updateCraftLOD(boat,1,'low');assert.equal(mesh.geometry,coarse);
});
