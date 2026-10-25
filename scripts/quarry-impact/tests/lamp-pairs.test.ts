import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
// A stand-in canvas so the light pool texture can be drawn without a browser.
const ctx={translate(){},scale(){},setTransform(){},fillRect(){},fillStyle:'',globalCompositeOperation:'',createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};
(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {attachCarLights,RAIN_BEAMS,LAMP_BAR,LAMP_BREAK}=await import('../src/car-lights');
const lens=(name:string,width:number,z:number)=>{const m=new T.Mesh(new T.BoxGeometry(width,.1,.05),new T.MeshStandardMaterial({name}));m.position.set(0,.6,z);return m;};
const beamsOf=(root:T.Object3D)=>root.children.filter(o=>o.name==='car_light_beam') as T.Mesh[];
test('one headlamp lens across the whole front shines from both ends: a pair of beams, a pair of road streaks',()=>{
  const root=new T.Group(),bar=lens('Headlight',1.4,2),tail=lens('Brakelight',1.2,-2);root.add(bar,tail);root.updateMatrixWorld(true);
  const lights=attachCarLights(root,2.2),beams=beamsOf(root),edge=.7-LAMP_BAR.inset;
  assert.equal(beams.length,2,'a beam per side');
  assert.ok(Math.abs(beams[0].position.x+edge)<1e-6&&Math.abs(beams[1].position.x-edge)<1e-6,'from each end of the lens, not the middle');
  lights.set(true,false,.45,RAIN_BEAMS.strength);const out:{x:number;z:number;tail:boolean}[]=[];lights.glows(out as any,root);
  const heads=out.filter(g=>!g.tail),tails=out.filter(g=>g.tail);
  assert.equal(heads.length,2,'two headlamp streaks');assert.ok(heads.some(g=>g.x<-.3)&&heads.some(g=>g.x>.3),'one each side');
  assert.equal(tails.length,2,'two tail lamp streaks');assert.ok(tails.every(g=>Math.abs(Math.abs(g.x)-(.6-LAMP_BAR.inset))<1e-6),'from the tail lens\'s ends');
  bar.userData.damage=LAMP_BREAK+1;lights.set(true,false,.45,RAIN_BEAMS.strength);
  assert.ok(beams.every(b=>!b.visible),'one smashed lens darkens both its ends');out.length=0;lights.glows(out as any,root);assert.equal(out.filter(g=>!g.tail).length,0);
  lights.dispose();
});
test('a small lamp in the middle stays one lamp, and separate lamps keep their own middles',()=>{
  const root=new T.Group();root.add(lens('Headlight',2*LAMP_BAR.span-.1,2));root.updateMatrixWorld(true);
  const lights=attachCarLights(root,2.2),beams=beamsOf(root);
  assert.equal(beams.length,1,'a centre lamp is one beam');assert.ok(Math.abs(beams[0].position.x)<1e-6);lights.dispose();
  const pair=new T.Group(),l=lens('Headlight',.3,2),r=lens('Headlight',.3,2);l.position.x=-.55;r.position.x=.55;pair.add(l,r);pair.updateMatrixWorld(true);
  const both=attachCarLights(pair,2.2),bs=beamsOf(pair);
  assert.ok(bs.length===2&&Math.abs(bs[0].position.x+.55)<1e-6&&Math.abs(bs[1].position.x-.55)<1e-6,'separate lamps unchanged');both.dispose();
});
