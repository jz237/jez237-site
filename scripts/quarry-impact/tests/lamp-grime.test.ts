import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights}=await import('../src/car-lights');
const {LAMP_GRIME}=await import('../src/wake-dust');
const lens=(name:string,x:number,z:number,hook:(s:unknown)=>void)=>{const material=new T.MeshStandardMaterial({name});material.onBeforeCompile=hook;material.customProgramCacheKey=()=>'lamp-test-'+name;const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),material);m.position.set(x,.6,z);return m;};
test('a lamp\'s own copy of its material keeps the shader work done on the original',()=>{
  const hook=()=>{},root=new T.Group(),lamps=[lens('Headlight',.55,2,hook),lens('Brakelight',.55,-2,hook),lens('Indicator',.8,2,hook)];for(const l of lamps)root.add(l);root.updateMatrixWorld(true);
  const originals=lamps.map(l=>l.material as T.Material);attachCarLights(root,2.2,{fitReverse:true});
  for(const [i,l] of lamps.entries()){const m=l.material as T.Material;assert.ok(m!==originals[i],'its own copy');assert.equal(m.onBeforeCompile,hook,'the shader hook kept');assert.equal(m.customProgramCacheKey(),'lamp-test-'+originals[i].name,'and its program key');}
});
test('grime dims a lamp: by the dust film and the dirt on it, within a limit',()=>{
  assert.ok(LAMP_GRIME.dust>0&&LAMP_GRIME.dirt>0&&LAMP_GRIME.most<1,'dimmer, never dark');
  const surface=readFileSync(new URL('../src/vehicle-surface.ts',import.meta.url),'utf8');
  assert.ok(surface.includes("totalEmissiveRadiance*=1.-clamp(wakeDust*${LAMP_GRIME.dust}+carDirt*${LAMP_GRIME.dirt},0.,${LAMP_GRIME.most});"),'through the emissive');
  assert.ok(surface.includes("'-persistent-wet-silt-wake-v4-'"),'programs rebuilt');
});
