import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {PuddleSplashes,SPRAY_LIGHT,sprayLight}=await import('../src/puddle-splashes');
const {attachCarLights}=await import('../src/car-lights');
const {createWetReflections,REFLECT}=await import('../src/wet-reflections');
import type {Vehicle} from '../src/vehicle';
const at=(x:number,y:number,z:number,lamps:Parameters<typeof sprayLight>[4])=>sprayLight([0,0,0],x,y,z,lamps);
test('a tail lamp lights the spray behind it red, brighter braking; nothing in front of it or out of reach',()=>{
  const running={x:0,y:.6,z:-2,tail:true,dx:0,dz:-1},braking={...running,brake:true};
  const behind=at(0,.5,-3,[running]),hard=at(0,.5,-3,[braking]);
  assert.ok(behind[0]>.05&&behind[1]<behind[0]*.2&&behind[2]<behind[0]*.1,'red');
  assert.ok(Math.abs(hard[0]/behind[0]-1/SPRAY_LIGHT.running)<1e-9,'braking lights it fully');
  assert.ok(at(0,.5,-1.2,[braking])[0]===0,'not ahead of the lamp');assert.ok(at(0,.6,-2-SPRAY_LIGHT.tail-.01,[braking])[0]===0,'not past its reach');
  assert.ok(at(0,.5,-2.5,[braking])[0]>hard[0],'brighter close to the lamp');
});
test('a headlamp lights the spray ahead of it warm white in a narrow cone; many lamps cap out',()=>{
  const head={x:0,y:.6,z:0,tail:false,dx:0,dz:1},ahead=at(0,.5,4,[head]);
  assert.ok(ahead[0]>.02&&ahead[1]>ahead[0]*.85&&ahead[2]>ahead[0]*.7,'warm white');
  assert.equal(at(3,.5,1,[head])[0],0,'outside the cone');assert.equal(at(0,.5,-1,[head])[0],0,'not behind');
  const flood=at(0,.6,-2.2,Array.from({length:12},()=>({x:0,y:.6,z:-2,tail:true,brake:true,dx:0,dz:-1})));assert.equal(flood[0],SPRAY_LIGHT.max,'capped');
  assert.ok(at(0,0,0,[{x:0,y:0,z:1,tail:true}])[0]>0,'a lamp with no facing lights all round');
  assert.deepEqual(at(0,0,0,[]),[0,0,0]);assert.deepEqual(at(NaN,0,0,[head]),[0,0,0],'nothing for a bad drop');
});
test('the spray carries the lamp light to the GPU: lit drops glow, unlit spray stays as it was',()=>{
  const car={id:0,health:100,velocity:new T.Vector3(0,0,15),right:new T.Vector3(1,0,0),controller:{wheelContactPoint:(i:number)=>({x:i%2?.8:-.8,y:0,z:i<2?1:-1}),wheelIsInContact:()=>true}} as unknown as Vehicle;
  const fx=new PuddleSplashes(new T.Scene(),()=>.5),glow=()=>fx.spray.geometry.getAttribute('glow').array as Float32Array;
  for(let i=0;i<30;i++)fx.update([car],[],1/60,true,true,1);assert.ok(fx.stats.active>0);assert.equal(fx.litDrops,0);assert.ok(glow().every(v=>v===0),'no lamps, no glow');
  fx.light([{x:0,y:.6,z:-3,tail:false,dx:0,dz:1}]);fx.update([car],[],1/60,true,true,1);
  assert.ok(fx.litDrops>0&&glow().some(v=>v>0),'a following car\'s headlamps light it');
  const shader=fx.spray.material;assert.ok(shader.vertexShader.includes('attribute vec3 glow;')&&shader.fragmentShader.includes('vGlow*(.4+rim*1.6)'));
  fx.light([]);fx.update([car],[],1/60,true,true,1);assert.equal(fx.litDrops,0,'lamps gone, glow gone');
});
test('the lamps report the way they face and whether the tails are braking; braking tails lay a brighter streak',()=>{
  const root=new T.Group(),lens=(name:string,x:number,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name}));m.position.set(x,.6,z);return m;};
  root.add(lens('Headlight',-.55,2),lens('Headlight',.55,2),lens('Brakelight',-.5,-2),lens('Brakelight',.5,-2));root.updateMatrixWorld(true);
  const lights=attachCarLights(root,2.2);root.rotation.y=Math.PI/2;root.updateMatrixWorld(true);
  const out:any[]=[];lights.set(true,true,.45,0);lights.glows(out,root);
  const heads=out.filter(g=>!g.tail),tails=out.filter(g=>g.tail);
  assert.ok(heads.length===2&&heads.every(g=>Math.abs(g.dx-1)<1e-6&&Math.abs(g.dz)<1e-6),'heads face the way the car points');
  assert.ok(tails.length===2&&tails.every(g=>g.brake===true&&Math.abs(g.dx+1)<1e-6),'tails face back, braking');
  out.length=0;lights.set(true,false,.45,0);lights.glows(out,root);assert.ok(out.filter(g=>g.tail).every(g=>g.brake===false));lights.dispose();
  const scene=new T.Scene(),fx=createWetReflections(scene),camera=new T.PerspectiveCamera();camera.position.set(0,2,10);
  fx.update([{x:-1,y:.6,z:0,tail:true},{x:1,y:.6,z:0,tail:true,brake:true}],camera,()=>0);
  const red=(i:number)=>{const c=new T.Color();fx.mesh.getColorAt(i,c);return c.r;};assert.ok(Math.abs(red(1)/red(0)-REFLECT.braking)<1e-6,'braking streak brighter');fx.dispose();
});
test('main lights the spray from the lamps only in an offline rain event',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("  puddleSplashes?.light(eventLighting==='rain'&&!online?.active?glowList:[]);\n  if(!studio)puddleSplashes?.update("));
});
