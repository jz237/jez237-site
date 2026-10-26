import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,FOG,LAMP_BREAK}=await import('../src/car-lights');
const lens=(name:string,x:number,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name}));m.position.set(x,.6,z);return m;};
// A car with its tail lamps on the back at z −2 and a rear bumper standing proud of them below (back face at z −2.1),
// left on no layer as the draw batches leave the panels.
const car=(bumper=true)=>{const root=new T.Group(),body=new T.Group();root.add(body);
  for(const x of [-.55,.55])body.add(lens('Headlight',x,2),lens('Brakelight',x,-2));
  let panel:T.Mesh|null=null;if(bumper){panel=new T.Mesh(new T.BoxGeometry(1.7,.25,.2),new T.MeshStandardMaterial({name:'paint'}));panel.name='panel_bumper_rear';panel.position.set(0,.43,-2);panel.layers.mask=0;body.add(panel);}
  root.position.set(3,0,-7);root.rotation.y=.7;root.updateMatrixWorld(true);return {root,body,panel};};
const glow=(m:T.Mesh|null)=>m?(m.material as T.MeshStandardMaterial).emissiveIntensity:-1;
test('a red fog lens is fitted in the rear bumper below the tail lamp on the driver\'s side',()=>{
  const {root}=car(),lights=attachCarLights(root,2.2,{fitReverse:true,driverSide:-.8}),fog=lights.fogLamp!;
  assert.ok(fog&&fog.name==='fog_lens_fitted'&&fog.parent===root,'fitted');
  assert.ok(Math.abs(fog.position.x-(-.55))<1e-6&&Math.abs(fog.position.y-(.6-FOG.drop))<1e-6,'below the tail lamp on that side');
  assert.ok(Math.abs(fog.position.z-(-2.1-FOG.proud))<1e-4,'on the bumper skin, not buried in it');
  const left=attachCarLights(car().root,2.2,{fitReverse:true,driverSide:.7}).fogLamp!;assert.ok(left.position.x>0,'a left-hand drive car has it on the left');
  const bare=attachCarLights(car(false).root,2.2,{fitReverse:true,driverSide:-.8}).fogLamp!;assert.ok(Math.abs(bare.position.z-(-2.025-FOG.proud))<1e-4,'no bumper: on the tail lamp\'s face');
  const online=attachCarLights(car().root,2.2);assert.equal(online.fogLamp,null,'none unless fitted (online, menu)');online.fog(true);assert.equal(online.fogLit,false);
});
test('it lights in the rain, throws a red glow behind, and is out with its tail lamp or its bumper',()=>{
  const {root,body,panel}=car(),lights=attachCarLights(root,2.2,{fitReverse:true,driverSide:-.8}),fog=lights.fogLamp!;
  assert.equal(glow(fog),0,'dark until asked');lights.fog(true);assert.ok(lights.fogLit&&glow(fog)===FOG.glow,'lit');
  const out:{tail:boolean;brake?:boolean}[]=[];lights.glows(out as any,root);assert.ok(out.length===1&&out[0].tail&&out[0].brake,'a red glow with the lamps otherwise off');
  lights.fog(false);assert.ok(!lights.fogLit&&glow(fog)===0,'off out of the rain');
  const tail=body.children.find(o=>((o as T.Mesh).material as T.Material)?.name==='Brakelight'&&o.position.x<0) as T.Mesh;
  tail.userData.damage=LAMP_BREAK+1;lights.fog(true);assert.ok(!lights.fogLit&&glow(fog)===0&&fog.visible,'smashed with its tail lamp, still there');
  tail.userData.damage=0;lights.fog(true);assert.ok(lights.fogLit,'back with it');
  panel!.visible=false;lights.fog(true);assert.ok(!lights.fogLit&&!fog.visible,'gone with a bumper knocked off');
  panel!.visible=true;tail.visible=false;lights.fog(true);assert.ok(!lights.fogLit&&!fog.visible,'gone with its tail lamp');
  lights.dispose();assert.ok(!root.children.some(o=>o.name==='fog_lens_fitted'),'removed with the lights');
});
test('main fits the fog lamp on the driver\'s side offline and lights it in the rain in play',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("carLights.set(car,attachCarLights(car.root,DEFINITIONS[type].halfLength,{fitReverse:!attract&&!online?.active,driverSide:car.root.getObjectByName('driver')?.position.x}));"),'the driver\'s side');
  assert.ok(main.includes("{const raining=eventLighting==='rain';for(const c of cars)carLights.get(c)?.fog(raining&&!!c.extendedDamage&&c.health>0&&!c.electricalCut&&!c.batteryOut);}"),'in the rain, with power');
});
