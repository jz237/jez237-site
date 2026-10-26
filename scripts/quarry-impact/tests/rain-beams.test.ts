import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,RAIN_BEAMS,LAMP_BREAK}=await import('../src/car-lights');
const lamp=(x:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name:'Headlight'}));m.position.set(x,.6,2);return m;};
test('in the rain each side\'s headlamps throw a beam through the falling rain; a smashed side throws none',()=>{
  const root=new T.Group(),left=lamp(-.55),right=lamp(.55);root.add(left,right);
  const lights=attachCarLights(root,2.2),beams=root.children.filter(o=>o.name==='car_light_beam') as T.Mesh[];
  assert.equal(beams.length,2);assert.ok(beams.every(b=>!b.visible),'off by default');
  assert.ok(Math.abs(beams[0].position.x+.55)<1e-6&&Math.abs(beams[1].position.x-.55)<1e-6&&beams.every(b=>Math.abs(b.position.z-2)<1e-6),'from each side\'s lamps');
  const strength=()=>((beams[0].material as T.ShaderMaterial).uniforms.strength.value as number);
  lights.set(true,false,.45,RAIN_BEAMS.strength);assert.ok(beams.every(b=>b.visible)&&strength()===RAIN_BEAMS.strength,'shining in the rain');
  lights.set(true,false,1,0);assert.ok(beams.every(b=>!b.visible),'none at dusk or in the dry');
  lights.set(false,false,1,RAIN_BEAMS.strength);assert.ok(beams.every(b=>!b.visible),'lamps off, no beams');
  left.userData.damage=LAMP_BREAK+1;lights.set(true,false,.45,RAIN_BEAMS.strength);assert.ok(!beams[0].visible&&beams[1].visible,'the smashed side goes dark');
  lights.aim(.3,.6);assert.ok(Math.abs(beams[1].rotation.y-.3)<1e-9&&Math.abs(beams[1].scale.z-.6)<1e-9&&Math.abs(beams[1].rotation.x-RAIN_BEAMS.dip)<1e-9,'swung and shortened with a crushed front');
  lights.set(true,false,.45,NaN);assert.ok(!beams[1].visible,'an unreadable strength shows none');
  lights.dispose();assert.equal(root.children.filter(o=>o.name==='car_light_beam').length,0,'gone with the lights');
});
test('main gives the beams their strength in an offline rain event',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes(",dusk?1:RAIN_LIGHTS.pool,wet&&c.extendedDamage?RAIN_BEAMS.strength:dusk&&c.extendedDamage?DUST_BEAMS.strength*dustAir:0);}"));
});
