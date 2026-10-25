import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {attachCarLights,LAMP_BREAK,TAIL_GLOW,BROKEN_LENS} from '../src/car-lights';
import {readFileSync} from 'node:fs';
import {LIGHTING_PRESETS} from '../src/lighting-presets';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
test('every car finds front headlamp and rear tail lamp meshes by material and position, and switches only its own lamps',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();const counts:string[]=[];
 try{
  for(const kind of CAR_KINDS){
   const a=new Vehicle(0,kind,DEFINITIONS[kind].color,scene,world,fx),b=new Vehicle(1,kind,DEFINITIONS[kind].color,scene,world,fx);
   const la=attachCarLights(a.root,DEFINITIONS[kind].halfLength),lb=attachCarLights(b.root,DEFINITIONS[kind].halfLength);
   counts.push(`${kind}:${la.head}/${la.tail}`);assert.ok(la.head>=1,`${kind} headlamps ${la.head}`);assert.ok(la.tail>=1,`${kind} tail lamps ${la.tail}`);
   const emissive=(v:Vehicle)=>{let s=0;v.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&(o.material as T.MeshStandardMaterial).emissiveIntensity!==undefined&&/headlight|lens|brakelight/i.test((o.material as T.Material).name))s+=(o.material as T.MeshStandardMaterial).emissiveIntensity;});return s;};
   const before=emissive(b);la.set(true,true);assert.ok(emissive(a)>0);assert.equal(emissive(b),before,'the other car is unchanged');
   assert.ok(a.root.getObjectByName('car_light_pool')===undefined||a.root.getObjectByName('car_light_pool')!.visible===false,'no DOM: no light pool');
   la.set(false);la.dispose();lb.dispose();a.dispose();b.dispose();
  }
 }finally{world.free();}
 console.log('lamps',counts.join(' '));
});
test('dusk is a darker, warmer mood than midday',()=>{
 const d=LIGHTING_PRESETS.dusk,m=LIGHTING_PRESETS.midday;assert.ok(d.sun<m.sun&&d.ambient<m.ambient&&d.background<m.background);assert.equal(d.overcastSky,false);
});
test('a smashed or knocked-off lamp goes dark while the others stay lit',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();
 try{
  for(const kind of ['sedan','hollins'] as const){
   const car=new Vehicle(0,kind,DEFINITIONS[kind].color,scene,world,fx),lights=attachCarLights(car.root,DEFINITIONS[kind].halfLength);
   const heads:T.Mesh[]=[];car.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&(o.material as T.MeshStandardMaterial).emissiveIntensity===2.4)heads.push(o);});
   lights.set(true);heads.length=0;car.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&(o.material as T.MeshStandardMaterial).emissiveIntensity===2.4)heads.push(o);});
   assert.ok(heads.length===lights.head&&lights.working===lights.head,kind+' all headlamps lit');
   heads[0].userData.damage=LAMP_BREAK+1;lights.set(true);
   assert.ok((heads[0].material as T.MeshStandardMaterial).emissiveIntensity===0,kind+' the dented lamp is dark');
   assert.ok(heads.slice(1).every(m=>(m.material as T.MeshStandardMaterial).emissiveIntensity===2.4),kind+' the rest stay lit');
   assert.ok(lights.working===lights.head-1);
   for(const m of heads)m.visible=false;lights.set(true);assert.ok(lights.working===0,kind+' all knocked off');
   lights.dispose();car.dispose();
  }
 }finally{world.free();}
});
test('brake lights work in daylight too, and a smashed tail lamp stays dark',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();
 try{
  for(const kind of ['coupe','muscle','hollins'] as const){
   const car=new Vehicle(0,kind,DEFINITIONS[kind].color,scene,world,fx),own=new Map<T.Mesh,T.Material>();car.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material))own.set(o,o.material);});
   const lights=attachCarLights(car.root,DEFINITIONS[kind].halfLength);
   // The tail lamps are the rear brake/tail lenses the lights took over (their own material each).
   const tails:T.Mesh[]=[];car.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&o.material!==own.get(o)&&/brakelight|tail lens/i.test((o.material as T.Material).name))tails.push(o);});
   assert.equal(tails.length,lights.tail,kind+' tail lamps');
   const glow=()=>tails.map(m=>(m.material as T.MeshStandardMaterial).emissiveIntensity);
   lights.set(false,false);assert.ok(glow().every(v=>v===0),kind+' daylight, off the brakes: dark');
   lights.set(false,true);assert.ok(glow().some(v=>v===TAIL_GLOW.daylightBraking),kind+' daylight braking: lit');
   lights.set(true,true);assert.ok(glow().some(v=>v===TAIL_GLOW.braking),kind+' dusk braking');
   const lit=tails.find(m=>(m.material as T.MeshStandardMaterial).emissiveIntensity>0)!;lit.userData.damage=LAMP_BREAK+1;lights.set(false,true);
   assert.equal((lit.material as T.MeshStandardMaterial).emissiveIntensity,0,kind+' smashed: dark even braking');
   lights.dispose();car.dispose();
  }
 }finally{world.free();}
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("c.health>0&&!c.electricalCut&&!c.batteryOut&&(c.input?.brake??0)>.2&&Math.abs(c.speed)>1,dusk?1:RAIN_LIGHTS.pool);}"),'braking is passed in every light, not only at dusk, and needs working electrics');
});
test('a smashed lamp\'s lens goes dark and dull the moment it breaks, and only once',()=>{
 const root=new T.Group(),lamp=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Headlight',color:0xe0e0e0,roughness:.1}));lamp.position.set(.6,.7,2);root.add(lamp);
 const lights=attachCarLights(root,2.2),m=lamp.material as T.MeshStandardMaterial,before=m.color.clone();
 lights.set(false);assert.ok(m.color.equals(before),'intact');lamp.userData.damage=LAMP_BREAK+1;lights.set(false);
 assert.ok(Math.abs(m.color.r-before.r*BROKEN_LENS.shade)<1e-6&&m.roughness>=BROKEN_LENS.rough,'dark and dull');
 const dark=m.color.clone();lights.set(true);lights.set(false,true);assert.ok(m.color.equals(dark),'not darker every frame');
 assert.ok(lights.lamp('head',0)===lamp&&lights.lamp('tail',0)===undefined,'lamps can be found for QA');lights.dispose();
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.includes("m = c && carLights.get(c)?.lamp(kind, index); if (!m) return false; m.userData.damage = LAMP_BREAK + 1; return true;"),'__quarry.smashLamp breaks a lamp the way a knock does');
});
