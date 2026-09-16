import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {createAngel,advanceAngel,angelBody,angelForward} from '../lib/AngelfishMotion.ts';
import {fishTouch,fishBody,bodiesOverlap} from '../lib/GrazerCollision.ts';
import {AngelfishModel} from '../lib/AngelfishModel.ts';
const open={food:[],other:[],daylight:1,clear:p=>Math.abs(p.x)<4&&p.y>1.3&&p.y<4.4&&Math.abs(p.z)<1.8};

test('angelfish explore depth and height with independent speeds and upright turns',()=>{
 const fish=[createAngel(0),createAngel(1)],range=fish.map(()=>({min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity],minSpeed:9,maxSpeed:0,hover:0}));
 for(let i=0;i<7200;i++)for(const s of fish){const yaw=s.yaw,pitch=s.pitch;advanceAngel(s,1/60,open);assert.ok(Math.abs(s.yaw-yaw)<.038);assert.ok(Math.abs(s.pitch-pitch)<.009);assert.ok(Math.abs(s.pitch)<=.260001);assert.ok(s.position.toArray().every(Number.isFinite));const r=range[s.id];s.position.toArray().forEach((x,j)=>{r.min[j]=Math.min(r.min[j],x);r.max[j]=Math.max(r.max[j],x)});r.minSpeed=Math.min(r.minSpeed,s.speed);r.maxSpeed=Math.max(r.maxSpeed,s.speed);r.hover+=s.hover>0?1:0;}
 for(const r of range){assert.ok(r.max[0]-r.min[0]>3);assert.ok(r.max[1]-r.min[1]>.5);assert.ok(r.max[2]-r.min[2]>1.6);assert.ok(r.maxSpeed-r.minSpeed>.25);assert.ok(r.hover>0);}
 assert.notDeepEqual(fish[0].position.toArray(),fish[1].position.toArray());
});

for(const dt of [1/60,.05])test(`angelfish pursue actual food, brake and bite at the mouth at dt=${dt}`,()=>{
 const s=createAngel(0);s.position.set(-1.5,3.2,1.4);s.goal.set(2,3.2,1.4);s.yaw=0;s.timer=10;
 const food={id:73,position:new T.Vector3(.5,3.2,1.4)};let eaten=false,peak=0;
 for(let i=0;i<20/dt;i++){advanceAngel(s,dt,{...open,food:[food]});peak=Math.max(peak,s.speed);if(s.consumed!==null){assert.equal(s.consumed,73);assert.ok(s.position.clone().addScaledVector(angelForward(s.yaw,s.pitch),.78*s.size).distanceTo(food.position)<.16);assert.ok(s.speed<.7);eaten=true;break;}}
 assert.ok(peak>.7);assert.ok(eaten);assert.ok(s.bite>0);const p=s.position.clone();advanceAngel(s,0,open);assert.deepEqual(s.position,p);
});

test('a fish cannot bite food behind its head or keep pursuing a removed flake',()=>{
 const s=createAngel(0);s.position.set(0,3,1);s.yaw=0;
 advanceAngel(s,1/60,{...open,food:[{id:8,position:new T.Vector3(-.48,3,1)}]});assert.equal(s.consumed,null);assert.equal(s.target,8);
 advanceAngel(s,1/60,open);assert.equal(s.target,null);
});

test('swept motion and tall fin envelopes stop before solid objects',()=>{
 const s=createAngel(0);s.position.set(-1,3,1.2);s.goal.set(3,3,1.2);s.yaw=0;s.speed=1.5;s.startle=1;
 const rock={center:new T.Vector3(0,3,1.2),radius:.12};
 const clear=(p,yaw,pitch,size)=>!bodiesOverlap(angelBody(p,yaw,pitch,size),[rock]);
 for(let i=0;i<200;i++){advanceAngel(s,.05,{...open,clear});assert.equal(clear(s.position,s.yaw,s.pitch,s.size),true);}
 const envelope=angelBody(new T.Vector3(),0,0,.64),fish={id:100,position:new T.Vector3(1,3,0),previous:new T.Vector3(-1,3,0),forward:new T.Vector3(1,0,0),size:.64,envelope};
 const grazer=[{center:new T.Vector3(0,3.7,0),radius:.08}];assert.ok(fishTouch(fish,grazer),'dorsal fin is not treated as a tetra-sized body');
 const shifted=fishBody(fish,new T.Vector3(2,3,0));assert.ok(Math.abs(shifted[0].center.x-envelope[0].center.x-2)<1e-8);
});

test('Blender model contains detailed geometry, both fin pairs and embedded scale maps',()=>{
 const b=fs.readFileSync(new URL('../public/models/angelfish/silver-angelfish.glb',import.meta.url));assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(4),2);
 const gltf=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());const names=gltf.nodes.map(n=>n.name).join(' ');
 for(const name of ['Body','Median','PectoralLeft','PectoralRight','Streamers'])assert.ok(names.includes(name));
 const tris=gltf.meshes.flatMap(m=>m.primitives).reduce((n,p)=>n+gltf.accessors[p.indices].count/3,0);assert.ok(tris>30000&&tris<50000);
 assert.equal(gltf.images.length,3);assert.ok(gltf.images.every(i=>i.bufferView!==undefined));assert.ok(gltf.materials.some(m=>m.alphaMode==='BLEND'));assert.ok(gltf.materials.some(m=>m.normalTexture));assert.ok(b.length<6_000_000);
 const spheres=angelBody(new T.Vector3(),0,0,1),start=28+b.readUInt32LE(12);
 for(const node of gltf.nodes){const primitive=gltf.meshes[node.mesh].primitives[0],a=gltf.accessors[primitive.attributes.POSITION],v=gltf.bufferViews[a.bufferView];
  for(let i=0;i<a.count;i++){const at=start+(v.byteOffset??0)+(a.byteOffset??0)+i*(v.byteStride??12),p=new T.Vector3(b.readFloatLE(at),b.readFloatLE(at+4),b.readFloatLE(at+8));assert.ok(spheres.some(s=>p.distanceToSquared(s.center)<s.radius*s.radius),node.name+' has a vertex outside the collision envelope');}
 }
});

test('two angelfish share geometry and textures but animate and pause independently on the GPU',()=>{
 const source=new T.Group(),map=new T.Texture(),geometry=new T.SphereGeometry(.2,8,6),mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({map}));mesh.name='Median__membrane';source.add(mesh);
 const a=new AngelfishModel(source,0),b=new AngelfishModel(source,2);const x=a.group.children[0],y=b.group.children[0];assert.equal(x.geometry,y.geometry);assert.equal(x.material.map,y.material.map);assert.notEqual(x.material,y.material);
 const shader=m=>{const s={uniforms:{},vertexShader:'#include <common>\n#include <beginnormal_vertex>\n#include <begin_vertex>'};m.onBeforeCompile(s);return s};
 const visible=shader(x.material),shadow=shader(x.customDepthMaterial),other=shader(y.material);assert.equal(visible.uniforms.angelPhase,shadow.uniforms.angelPhase);assert.notEqual(visible.uniforms.angelPhase,other.uniforms.angelPhase);
 const vertices=geometry.attributes.position.array.slice(),version=geometry.attributes.position.version;
 a.update(.5,.6);b.update(.5,.2);assert.notEqual(visible.uniforms.angelPhase.value,other.uniforms.angelPhase.value);const held=visible.uniforms.angelPhase.value;a.update(0,.9);assert.equal(visible.uniforms.angelPhase.value,held);assert.deepEqual(geometry.attributes.position.array,vertices);assert.equal(geometry.attributes.position.version,version);
 let geometryDisposed=false,textureDisposed=false;geometry.addEventListener('dispose',()=>geometryDisposed=true);map.addEventListener('dispose',()=>textureDisposed=true);a.dispose();assert.equal(geometryDisposed,false);assert.equal(textureDisposed,false);
});


test('pelvic collision volumes follow forward reach while the body stays steady',()=>{
 const original=angelBody(new T.Vector3(),0,0,1,0,0),reached=angelBody(new T.Vector3(),0,0,1,1,0);
 const moved=original.map((s,i)=>reached[i].center.x-s.center.x);
 assert.ok(Math.max(...moved)>.5,'free pelvic tips extend visibly forward');
 assert.ok(moved.filter(d=>Math.abs(d)<1e-8).length>original.length*.7,'torso and other fins keep their pose');
});

test('forward swimming folds tall fins and quickens tail strokes, then relaxes smoothly at rest',()=>{
 const source=new T.Group(),mesh=new T.Mesh(new T.PlaneGeometry(),new T.MeshStandardMaterial());mesh.name='Median';source.add(mesh);
 const moving=new AngelfishModel(source,0),resting=new AngelfishModel(source,0);
 const uniforms=model=>{const shader={uniforms:{},vertexShader:'#include <common>\n#include <begin_vertex>'};model.group.children[0].material.onBeforeCompile(shader);return shader.uniforms;};
 const m=uniforms(moving),r=uniforms(resting);let min=1,max=0,last=0;
 for(let i=0;i<600;i++){
  moving.update(1/60,.2,false,0,.32);resting.update(1/60,.2,true,0,0);
  assert.ok(Math.abs(m.angelFold.value-last)<.014,'fin pose eases without a snap');last=m.angelFold.value;
  if(i>120){min=Math.min(min,last);max=Math.max(max,last);}
 }
 assert.ok(max>.22&&min<.15,'visible fold/reopen cycle while traveling');
 assert.equal(r.angelFold.value,0,'hovering does not retract tall fins');
 assert.ok(m.angelPhase.value>r.angelPhase.value*2,'traveling tail beats clearly faster');
 const held=Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v.value]));moving.update(0,1,false,1,1);
 assert.deepEqual(Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v.value])),held,'pause freezes all fin channels');
 for(let i=0;i<120;i++)moving.update(1/60,.1,true,0,0);
 assert.ok(m.angelFold.value<.001&&m.angelStroke.value<.001,'fins fan open and tail settles after stopping');
});

test('folded median fins and stronger tail strokes remain inside the collision envelope',()=>{
 const b=fs.readFileSync(new URL('../public/models/angelfish/silver-angelfish.glb',import.meta.url));
 const gltf=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString()),start=28+b.readUInt32LE(12);
 const spheres=angelBody(new T.Vector3(),0,0,1);
 // Check the boundary of the entire allowed fin-motion range, independently
 // of stroke timing: inward fold, slight forward rake, and lateral flex.
 for(const node of gltf.nodes.filter(n=>n.name.startsWith('Median'))){
  const a=gltf.accessors[gltf.meshes[node.mesh].primitives[0].attributes.POSITION],v=gltf.bufferViews[a.bufferView];
  for(let i=0;i<a.count;i+=3){
   const at=start+(v.byteOffset??0)+(a.byteOffset??0)+i*(v.byteStride??12);
   const x=b.readFloatLE(at),y=b.readFloatLE(at+4),z=b.readFloatLE(at+8),edge=T.MathUtils.smoothstep(Math.abs(y),.56,1.4);
   const fan=T.MathUtils.clamp((-.8-x)/.51,0,1)*(1-T.MathUtils.smoothstep(Math.abs(y),.45,.62));
   const rear=1-T.MathUtils.smoothstep(x,-1.3,.28),margin=T.MathUtils.smoothstep(Math.abs(y),.06,.40);
   const sweep=rear*rear*.05+edge*.10+fan*fan*.17+fan*fan*fan*margin*.024;
   for(const fold of [0,.13,.26])for(const lateral of [-sweep,sweep])for(const recoil of [0,-.048*fan*fan]){
    const p=new T.Vector3(x+edge*fold*.3+recoil,y-Math.sign(y)*edge*fold,z+lateral);
    assert.ok(spheres.some(s=>p.distanceToSquared(s.center)<=s.radius*s.radius),'moving fin exceeds contact envelope at '+p.toArray());
   }
  }
 }
});

test('mouth and gill covers breathe while hovering with delayed, independent pulses and a working pause',()=>{
 const a=new AngelfishModel(new T.Group(),0),b=new AngelfishModel(new T.Group(),3.71);
 const uniforms=model=>{const shader={uniforms:{},vertexShader:'#include <common>\n#include <begin_vertex>'};model.group.children[0].material.onBeforeCompile(shader);return shader.uniforms;};
 const x=uniforms(a),y=uniforms(b),mouths=[],gills=[];
 const geometry=a.group.children[0].geometry,positions=geometry.attributes.position.array.slice();
 assert.equal(geometry,b.group.children[0].geometry,'aperture geometry is shared');
 for(let i=0;i<300;i++){a.update(1/60,.1,true);b.update(1/60,.1,true);mouths.push(x.angelMouth.value);gills.push(x.angelGill.value);}
 assert.ok(Math.max(...mouths)>.98&&Math.min(...mouths)<.01);
 assert.ok(Math.max(...gills)>.98&&Math.min(...gills)<.01);
 const mouthPeak=mouths.findIndex(v=>v>.98),gillPeak=gills.findIndex(v=>v>.98);
 assert.ok(gillPeak>mouthPeak+10&&gillPeak<mouthPeak+25,'opercular pulse follows oral expansion');
 assert.ok(Math.abs(x.angelGill.value-y.angelGill.value)>.05,'fish are not synchronized');
 assert.equal(x.angelFold.value,0,'breathing does not require swimming');
 const held=[x.angelGill.value,x.angelMouth.value];a.update(0,1,false,1,1);assert.deepEqual([x.angelGill.value,x.angelMouth.value],held);
 assert.deepEqual(geometry.attributes.position.array,positions,'breathing adds no per-frame vertex upload');
 const bounds=angelBody(new T.Vector3(),0,0,1);
 for(const px of [.779,.791])for(const py of [-.0608,-.029])for(const pz of [-.017,.017]){
  const point=new T.Vector3(px,py,pz);assert.ok(bounds.some(s=>point.distanceToSquared(s.center)<s.radius*s.radius),'open mouth stays within contact bounds');
 }
});

test('feeding angels leave inspection promptly, glide faster, then pause briefly at a real bite',()=>{
 const s=createAngel(0);s.position.set(-1.5,3.2,1.4);s.yaw=0;s.hover=2;
 const food={id:91,position:new T.Vector3(.5,3.2,1.4)};let peak=0,ate=false;
 for(let i=0;i<300;i++){const yaw=s.yaw;advanceAngel(s,1/60,{...open,food:[food]});peak=Math.max(peak,s.speed);assert.ok(Math.abs(s.yaw-yaw)<1.6/60+.00001);if(i===0){assert.equal(s.target,91);assert.equal(s.hover,0);}if(s.consumed===91){ate=true;assert.ok(s.bite>=.4&&s.bite<=.75);break;}}
 assert.ok(peak>1.1,'visible stronger feeding approach');assert.ok(ate,'does not circle the morsel indefinitely');
 const resting=createAngel(1);advanceAngel(resting,.05,{...open,daylight:.2,food:[food]});assert.equal(resting.target,null,'dim-light resting remains unchanged');
});
