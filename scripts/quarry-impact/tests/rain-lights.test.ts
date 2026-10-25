import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const fades:number[][]=[],ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:(...a:number[])=>{fades.push(a);return {addColorStop(){}};}};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,RAIN_LIGHTS}=await import('../src/car-lights');
const lamp=(material:string,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name:material}));m.position.set(.5,.6,z);return m;};
test('in the rain the lamps run as at dusk, with a fainter pool of light on the road',()=>{
  const root=new T.Group(),head=lamp('Headlight',2),tail=lamp('Brakelight',-2);root.add(head,tail);
  const lights=attachCarLights(root,2.2),pool=root.getObjectByName('car_light_pool') as T.Mesh|undefined;
  const glow=(m:T.Mesh)=>(m.material as T.MeshStandardMaterial).emissiveIntensity,opacity=()=>(pool!.material as T.MeshBasicMaterial).opacity;
  assert.ok(pool!==undefined&&pool.visible===false,'a pool, off by default');
  assert.ok(ctx.globalCompositeOperation==='destination-in'&&fades.length===1&&fades[0][1]===0&&fades[0][3]>0,'faded in from the car end');
  lights.set(true,false,RAIN_LIGHTS.pool);
  assert.ok(pool!.visible&&Math.abs(opacity()-.38*RAIN_LIGHTS.pool)<1e-9,'faint pool in the rain');assert.equal(glow(head),2.4);assert.ok(glow(tail)>1);
  lights.set(true,false,1);assert.ok(Math.abs(opacity()-.38)<1e-9,'full pool at dusk');assert.equal(glow(head),2.4);
  lights.set(true,false,NaN);assert.ok(Math.abs(opacity()-.38)<1e-9,'an unreadable strength is full');
  lights.set(true,false,-2);assert.equal(opacity(),0);lights.set(true,false,2);assert.ok(Math.abs(opacity()-.38)<1e-9);
  lights.set(false);assert.ok(!pool!.visible&&opacity()===0&&glow(head)===0&&glow(tail)===0,'all off');
  lights.dispose();
});
test('the pool of light lies on the road under the car, not at body height, wherever it is aimed',()=>{
  const root=new T.Group(),tyre=new T.Mesh(new T.CylinderGeometry(.34,.34,.2,8),new T.MeshStandardMaterial({name:'Tire'}));tyre.position.set(.8,-.7,1.3);tyre.rotation.z=Math.PI/2;root.add(tyre,lamp('Headlight',2));
  root.position.set(5,2.04,-3);root.rotation.y=.7;const lights=attachCarLights(root,2.2),pool=root.getObjectByName('car_light_pool') as T.Mesh;
  assert.ok(Math.abs(pool.position.y-(-.7-.34+.06))<1e-6,'just above the tyre bottoms');
  lights.aim(.3,.6);assert.ok(Math.abs(pool.position.y-(-.7-.34+.06))<1e-6,'and stays there when aimed');lights.dispose();
});
test('main lights the lamps in the rain for offline cars only, at the rain pool strength',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("{const dusk=eventLighting==='dusk',wet=eventLighting==='rain';for(const c of cars){const l=carLights.get(c);if((dusk||wet)&&l&&c.extendedDamage){"));
  assert.ok(main.includes("carLights.get(c)?.set((dusk||wet&&c.extendedDamage)&&c.health>0&&!c.electricalCut&&!c.batteryOut&&")&&main.includes(",dusk?1:RAIN_LIGHTS.pool);}"));
});
