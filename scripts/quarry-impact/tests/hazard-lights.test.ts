import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,HAZARD,hazardLit,LAMP_BREAK}=await import('../src/car-lights');
const lens=(name:string,x:number,z:number,emissive=0)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name,emissive:new T.Color(0x885500),emissiveIntensity:emissive}));m.position.set(x,.6,z);return m;};
const car=(rearIndicators:boolean)=>{const root=new T.Group(),body=new T.Group();root.add(body);
  for(const x of [-.55,.55])body.add(lens('Headlight',x,2),lens('Brakelight',x,-2));if(rearIndicators)for(const x of [-.75,.75])body.add(lens('Indicator',x,-2,.6));root.updateMatrixWorld(true);return {root,body};};
const glow=(m:T.Mesh)=>(m.material as T.MeshStandardMaterial).emissiveIntensity;
test('the flasher is lit a little over half of each beat, each car to its own',()=>{
  assert.ok(hazardLit(0)&&hazardLit(HAZARD.on-.01)&&!hazardLit(HAZARD.on+.01)&&hazardLit(HAZARD.period+.01),'on, off, on again');
  assert.notEqual(hazardLit(.3,0),hazardLit(.3,.3),'another car, another beat');assert.equal(hazardLit(NaN),false);assert.equal(hazardLit(-.1),hazardLit(HAZARD.period-.1),'before zero, the same beat');
});
test('a wrecked car flashes its own indicators amber, and they keep their own look between flashes',()=>{
  const {root,body}=car(true),lights=attachCarLights(root,2.2,{fitReverse:true}),own=body.children.filter(o=>((o as T.Mesh).material as T.Material).name==='Indicator') as T.Mesh[];
  const fronts=root.children.filter(o=>o.name==='indicator_lens_fitted') as T.Mesh[];
  assert.ok(lights.indicator===4&&fronts.length===2&&fronts.every(f=>f.position.z>2),'its own at the back, fitted at the front where it had none');
  assert.ok(fronts.every(f=>Math.abs(Math.abs(f.position.x)-(.55+HAZARD.outset))<1e-6),'outboard of the headlamps');
  assert.ok(own.every(m=>glow(m)===.6),'its own soft glow untouched');
  lights.hazards(true,0);assert.ok(lights.flashing&&[...own,...fronts].every(m=>glow(m)===HAZARD.glow),'all flash');
  lights.hazards(true,HAZARD.on+.05);assert.ok(own.every(m=>glow(m)===.6)&&fronts.every(m=>glow(m)===0),'between flashes, back to how they were');
  own[0].userData.damage=LAMP_BREAK+1;lights.hazards(true,0);assert.ok(glow(own[0])===0&&glow(own[1])===HAZARD.glow,'a smashed one stays dark');
  lights.hazards(false,0);assert.ok(!lights.flashing&&glow(own[1])===.6&&fronts.every(m=>glow(m)===0),'stopped');lights.dispose();
  assert.equal(root.children.filter(o=>o.name==='indicator_lens_fitted').length,0,'fitted lenses gone with the lights');
});
test('an end with no indicators gets amber lenses that go with their lamps; none online',()=>{
  const {root,body}=car(false),lights=attachCarLights(root,2.2,{fitReverse:true}),fitted=root.children.filter(o=>o.name==='indicator_lens_fitted') as T.Mesh[];
  assert.ok(lights.indicator===4&&fitted.length===4,'front and back');
  const headL=body.children.find(o=>((o as T.Mesh).material as T.Material).name==='Headlight'&&o.position.x<0)!,frontL=fitted.find(f=>f.position.z>0&&f.position.x<0)!;
  headL.visible=false;lights.hazards(true,0);assert.ok(!frontL.visible&&glow(frontL)===0,'knocked off with its headlamp');lights.dispose();
  const online=car(false),none=attachCarLights(online.root,2.2);none.hazards(true,0);assert.ok(none.indicator===0&&!online.root.children.some(o=>o.name==='indicator_lens_fitted'),'online cars untouched');none.dispose();
});
test('main flashes a wrecked offline car\'s hazards while its electrics work',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('  for(const c of cars)carLights.get(c)?.hazards(!!c.extendedDamage&&c.health<=0&&!c.electricalCut&&!c.batteryOut,clock+c.id*.137);'));
});
