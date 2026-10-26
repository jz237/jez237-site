import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,TAIL_GLOW_BEAM,RAIN_BEAMS,LAMP_BREAK}=await import('../src/car-lights');
const lens=(name:string,x:number,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name}));m.position.set(x,.6,z);return m;};
const car=()=>{const root=new T.Group(),body=new T.Group();root.add(body);for(const x of [-.55,.55])body.add(lens('Headlight',x,2),lens('Brakelight',x,-2));root.updateMatrixWorld(true);return {root,body};};
const glows=(root:T.Object3D)=>root.children.filter(o=>o.name==='car_tail_glow') as T.Mesh[];
const strength=(m:T.Mesh)=>(m.material as T.ShaderMaterial).uniforms.strength.value as number;
test('the rain or dust behind each side\'s tail lamps glows red, faint with the lamps on and bright on the brakes',()=>{
  const {root}=car(),lights=attachCarLights(root,2.2,{fitReverse:true}),g=glows(root);
  assert.equal(g.length,2,'one per side');assert.ok(g.every(m=>m.position.z< -1.9&&Math.abs(m.rotation.y-Math.PI)<1e-9),'from the tail lamps, pointing back');
  assert.ok(g.every(m=>!m.visible),'none until asked');
  lights.set(true,false,1,RAIN_BEAMS.strength);assert.ok(g.every(m=>m.visible)&&Math.abs(strength(g[0])-RAIN_BEAMS.strength*TAIL_GLOW_BEAM.running)<1e-9,'faint with the lamps on');
  lights.set(true,true,1,RAIN_BEAMS.strength);assert.ok(Math.abs(strength(g[0])-RAIN_BEAMS.strength*TAIL_GLOW_BEAM.braking)<1e-9,'bright on the brakes');
  lights.set(false,true,1,RAIN_BEAMS.strength);assert.ok(g.every(m=>m.visible),'braking in daylight rain still lights the spray');
  lights.set(true,false,1,0);assert.ok(g.every(m=>!m.visible),'nothing in the air, nothing to see');
  lights.dispose();assert.equal(glows(root).length,0,'gone with the lights');
});
test('a side with its tail lamps smashed throws no glow',()=>{
  const {root,body}=car(),lights=attachCarLights(root,2.2,{fitReverse:true}),g=glows(root);
  (body.children.find(o=>((o as T.Mesh).material as T.Material).name==='Brakelight'&&o.position.x<0) as T.Mesh).userData.damage=LAMP_BREAK+1;
  lights.set(true,true,1,RAIN_BEAMS.strength);const left=g.find(m=>m.position.x<0)!,right=g.find(m=>m.position.x>0)!;
  assert.ok(!left.visible&&right.visible,'only the working side');
});
