import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {attachCarLights,LAMP_BREAK} from '../src/car-lights';
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
