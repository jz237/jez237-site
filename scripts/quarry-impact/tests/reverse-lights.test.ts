import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,REVERSE_GLOW,REVERSE_FIT,LAMP_BREAK}=await import('../src/car-lights');
const lens=(name:string,x:number,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name}));m.position.set(x,.6,z);return m;};
const car=(withReverse:boolean)=>{const root=new T.Group(),body=new T.Group();root.add(body);
  for(const x of [-.55,.55])body.add(lens('Headlight',x,2),lens('Brakelight',x,-2));if(withReverse)for(const x of [-.35,.35])body.add(lens('Reverse',x,-2.02));root.updateMatrixWorld(true);return {root,body};};
const glowOf=(m:T.Mesh)=>(m.material as T.MeshStandardMaterial).emissiveIntensity;
test('a car built with reversing lamps lights them white while it backs up, and keeps no fitted ones',()=>{
  const {root,body}=car(true),lights=attachCarLights(root,2.2,{fitReverse:true}),rev=body.children.filter(o=>(o as T.Mesh).material&&((o as T.Mesh).material as T.Material).name==='Reverse') as T.Mesh[];
  assert.equal(lights.reverse,2);assert.equal(root.children.filter(o=>o.name==='reverse_lens_fitted').length,0,'its own lamps');
  lights.reversing(true);assert.ok(lights.backing&&rev.every(m=>glowOf(m)===REVERSE_GLOW),'lit');lights.reversing(false);assert.ok(!lights.backing&&rev.every(m=>glowOf(m)===0),'out going forwards');
  rev[0].userData.damage=LAMP_BREAK+1;lights.reversing(true);assert.ok(glowOf(rev[0])===0&&glowOf(rev[1])===REVERSE_GLOW,'a smashed one stays dark');lights.dispose();
});
test('a car built without them gets a clear lens fitted inboard of each tail lamp, which goes with its tail lamp',()=>{
  const {root,body}=car(false),lights=attachCarLights(root,2.2,{fitReverse:true}),fittedLenses=root.children.filter(o=>o.name==='reverse_lens_fitted') as T.Mesh[];
  assert.ok(lights.reverse===2&&fittedLenses.length===2,'a pair fitted');
  for(const f of fittedLenses){assert.ok(Math.abs(Math.abs(f.position.x)-(.55-REVERSE_FIT.inset))<1e-6&&f.position.z< -2.02,'inboard of the tail lamp, on the back');}
  lights.reversing(true);assert.ok(fittedLenses.every(f=>glowOf(f)===REVERSE_GLOW));
  const tails=body.children.filter(o=>((o as T.Mesh).material as T.Material).name==='Brakelight') as T.Mesh[],left=fittedLenses.find(f=>f.position.x<0)!,right=fittedLenses.find(f=>f.position.x>0)!;
  tails.find(t=>t.position.x<0)!.userData.damage=LAMP_BREAK+1;lights.reversing(true);assert.ok(glowOf(left)===0&&glowOf(right)===REVERSE_GLOW,'smashed with its tail lamp');
  const rightTail=tails.find(t=>t.position.x>0)!;rightTail.visible=false;lights.reversing(true);assert.ok(!right.visible&&glowOf(right)===0,'knocked off with it');
  rightTail.visible=true;const hang=new T.Group();body.add(hang);hang.attach(rightTail);lights.reversing(true);assert.ok(!right.visible,'gone while its tail lamp hangs');
  const out:any[]=[];lights.reversing(false);lights.glows(out,root);assert.equal(out.filter(g=>!g.tail).length,0);
  lights.dispose();assert.equal(root.children.filter(o=>o.name==='reverse_lens_fitted').length,0,'gone with the lights');
  const plain=car(false),none=attachCarLights(plain.root,2.2);assert.ok(none.reverse===0&&plain.root.children.every(o=>o.name!=='reverse_lens_fitted'),'none fitted unless asked (online, menu)');none.dispose();
});
test('backing up, the reversing lamps shine white behind the car onto the wet road and the spray',()=>{
  const {root}=car(true),lights=attachCarLights(root,2.2);lights.reversing(true);const out:any[]=[];lights.glows(out,root);
  const white=out.filter(g=>!g.tail);assert.ok(white.length===2&&white.every(g=>g.dz<-.99),'two, facing back');lights.dispose();
});
test('main lights the reversing lamps as an offline car backs up, and fits lenses only offline',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('  for(const c of cars)carLights.get(c)?.reversing(!!c.extendedDamage&&c.health>0&&!c.electricalCut&&!c.batteryOut&&c.speed< -REVERSE_SPEED);'));
  assert.ok(main.includes('attachCarLights(car.root,DEFINITIONS[type].halfLength,{fitReverse:!attract&&!online?.active})'));
});
