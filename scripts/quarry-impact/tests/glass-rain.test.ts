import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CAR_WET,GLASS_RAIN,finishGlass} from '../src/car-materials';
import {WIPED,WiperRig,wipeStep,windscreen,wiperArms} from '../src/windscreen-wipers';
test('rain beads every window, laid on the plane each pane faces, fewer where the wipers keep it clear',()=>{
  const m=new T.MeshPhysicalMaterial(),state=finishGlass(m,new T.BoxGeometry(1,.5,.02));assert.equal(state.wiped.value,0);
  const shader={uniforms:{} as Record<string,unknown>,vertexShader:'#include <common>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>\n#include <roughnessmap_fragment>'};
  m.onBeforeCompile(shader as any,{} as any);
  assert.ok(shader.uniforms.carWet===CAR_WET&&shader.uniforms.glassWiped===state.wiped,'shared wetness, each pane its own wiping');
  assert.ok(shader.vertexShader.includes('vGlassNormal=normal;')&&shader.fragmentShader.includes('vec3 rainFace=abs(vGlassNormal);'),'beads stay round on every window');
  assert.ok(shader.fragmentShader.includes(`float glassBead=carWet*step(${GLASS_RAIN.keep}+${1-GLASS_RAIN.keep}*glassWiped*${GLASS_RAIN.wipe},rainKeep)`)&&shader.fragmentShader.includes('*(1.-smoothstep(.35,.9,length(fwidth(rainAt))));'),'fewer when wiped, faded before they shimmer');
  assert.ok(shader.fragmentShader.indexOf('float murk=')<shader.fragmentShader.indexOf('float glassBead='),'on the outside of the smoke');
  m.dispose();
});
test('working wipers clear a windscreen within a second or so; stopped, the rain beads it over again in ten or so',()=>{
  let w=0;for(let i=0;i<60;i++)w=wipeStep(w,true,1/60);assert.ok(w>.8,'cleared');
  let b=1;for(let i=0;i<600;i++)b=wipeStep(b,false,1/60);assert.ok(Math.abs(b-Math.exp(-WIPED.fill*10))<.02,'beaded over');
  assert.equal(wipeStep(.4,true,0),.4);assert.equal(wipeStep(NaN,false,1),0);assert.equal(wipeStep(0,true,10),1);
});
test('the windscreen is the most forward pane across the middle; the rig knows when its wipers are moving',()=>{
  const root=new T.Group(),pane=(x:number,z:number)=>{const g=new T.Mesh(new T.BoxGeometry(.4,.3,.02));g.position.set(x,1,z);root.add(g);return g;};
  const front=pane(0,1.1),sides=[pane(-.75,0),pane(.75,.2)],rear=pane(0,-1.4);root.position.set(4,0,-2);root.rotation.y=1.1;
  assert.ok(windscreen([...sides,rear,front],root)===front,'the front pane');assert.ok(windscreen([...sides,rear],root)===undefined,'none without one');
  const model=new T.Group();for(const [name,x,qz] of [['panel_TestWiper-1',-.2,-.522],['panel_TestWiper1',.2,.522]] as const){const w=new T.Mesh(new T.CylinderGeometry(.006,.006,.226,6));w.name=name;w.position.set(x,.93,.285);w.quaternion.set(-.078,0,qz,.849).normalize();model.add(w);}
  const rig=new WiperRig(wiperArms(model),2);rig.update(1/60,true,true,0,0);assert.equal(rig.moving,true,'raining and powered');
  rig.update(1/60,true,false,0,0);assert.equal(rig.moving,false,'dead electrics');
  rig.update(1/60,false,true,0,0);assert.equal(rig.moving,true,'finishing the stroke');for(let i=0;i<200;i++)rig.update(1/60,false,true,0,0);assert.equal(rig.moving,false,'parked when dry');
  rig.update(1/60,true,true,1,0);rig.update(1/60,true,true,1,0);assert.equal(rig.moving,false,'every arm bent');
  const none=new WiperRig([],0);none.update(1,true,true,0,0);assert.equal(none.moving,false);
});
test('main clears the windscreen of a car whose wiper arms are working',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(!wiperScreens.has(c))wiperScreens.set(c,rig.arms.length?((windscreen(c.glass,c.root)?.material as T.Material|undefined)?.userData.glassState as GlassState|undefined):undefined);"));
  assert.ok(main.includes("const screen=wiperScreens.get(c);if(screen)screen.wiped.value=wipeStep(screen.wiped.value,rig.moving,dt);}}"));
});
