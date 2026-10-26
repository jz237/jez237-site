import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {HAZE,attachCarLights} from '../src/car-lights';
/** A car-like root with a pair of headlamps and a tail lamp. */
function car(){
  const root=new T.Group();for(const x of [-.6,.6]){const lamp=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Headlight',color:0xe0e0e0,roughness:.1}));lamp.position.set(x,.7,2);root.add(lamp);}
  const tail=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Brakelight',color:0x991111}));tail.position.set(.6,.7,-2);root.add(tail);
  return{root,lights:attachCarLights(root,2.2)};
}
test('an old car’s headlamp lenses go cloudy and yellow, and its own only',()=>{
  const old=car(),fresh=car();old.lights.yellow(1);
  const lens=old.lights.lamp('head',0)!.material as T.MeshStandardMaterial,clean=fresh.lights.lamp('head',0)!.material as T.MeshStandardMaterial;
  const yellow=new T.Color(0xe0e0e0).lerp(new T.Color(HAZE.lens),HAZE.cloud);assert.ok(lens.color.equals(yellow),'toward the yellowed lens');
  assert.ok(lens.roughness>=HAZE.rough,'hazy');assert.ok(clean.color.equals(new T.Color(0xe0e0e0))&&clean.roughness===.1,'another car’s untouched');
  const tail=old.lights.lamp('tail',0)!.material as T.MeshStandardMaterial;assert.equal(tail.color.getHex(),0x991111,'the tail lamps keep their red');
  const none=car();none.lights.yellow(0);assert.ok((none.lights.lamp('head',0)!.material as T.MeshStandardMaterial).color.equals(new T.Color(0xe0e0e0)),'a new car none');
  none.lights.yellow(NaN);assert.ok((none.lights.lamp('head',0)!.material as T.MeshStandardMaterial).color.equals(new T.Color(0xe0e0e0)));
});
test('its lamps shine dimmer and warmer, even when the switch is already on',()=>{
  const old=car(),fresh=car();for(const c of [old,fresh])c.lights.set(true);old.lights.yellow(1);old.lights.set(true);
  const o=old.lights.lamp('head',0)!.material as T.MeshStandardMaterial,f=fresh.lights.lamp('head',0)!.material as T.MeshStandardMaterial;
  assert.ok(Math.abs(o.emissiveIntensity-f.emissiveIntensity*(1-HAZE.dim))<1e-9,'dimmer');assert.ok(o.emissive.b<f.emissive.b&&o.emissive.r>=f.emissive.b,'warmer');
  old.lights.set(false);assert.equal(o.emissiveIntensity,0,'off is off');
});
test('main yellows the offline rivals’ lamps by their age, the player’s never',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0)carLights.get(car)?.yellow(startingRust(car.id));'));
  const lights=readFileSync(new URL('../src/car-lights.ts',import.meta.url),'utf8');
  assert.ok(lights.includes('poolMaterial.opacity=on?.38*intact*strength*(1-HAZE.dim*haze):0;')&&lights.includes('beamMaterial.uniforms.color.value.lerp(warm,h*HAZE.tint);'),'the pool and rain beams too');
});
