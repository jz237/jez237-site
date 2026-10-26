import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {WIPERS,wiperArms} from '../src/windscreen-wipers';
import {ARCS,defaultSweeps,dustFilm,fitWiperArcs,sweeps} from '../src/wiper-arcs';
const screen=()=>{const g=new T.PlaneGeometry(1.3,.6).rotateX(-1.0).translate(0,1,.9);g.setAttribute('wreckPosition',g.attributes.position.clone());const m=new T.Mesh(g,new T.MeshStandardMaterial());m.name='glass_Windshield';return m;};
test('an old banger’s screen is dusty, thicker the older; a younger one clean',()=>{
  assert.equal(dustFilm(ARCS.age-.01),0);assert.equal(dustFilm(ARCS.age),ARCS.film[0]);assert.ok(Math.abs(dustFilm(1)-ARCS.film[1])<1e-12);assert.ok(dustFilm(.8)>dustFilm(.5));assert.equal(dustFilm(NaN),0);
});
test('a separate wiper arm sweeps a fan from its pivot along its parked line, its own length; a rear wiper does not count',()=>{
  const root=new T.Group(),bar=(name:string,x:number,z:number)=>{const g=new T.BoxGeometry(.5,.015,.015).translate(.25,0,0);const m=new T.Mesh(g,new T.MeshStandardMaterial());m.name=name;m.position.set(x,1.2,z);m.rotation.z=.12;root.add(m);return m;};
  bar('panel_WiperL',-.5,.8);bar('panel_WiperR',.05,.8);bar('panel_TailgateWiper',-.2,-2);root.position.set(4,0,-3);root.updateMatrixWorld(true);
  const arms=wiperArms(root),fans=sweeps(arms,root);
  assert.equal(arms.length,3);assert.equal(fans.length,2,'front arms only');
  for(const f of fans){assert.ok(Math.abs(f.length-.5)<.01&&f.along.x>.95&&f.along.y>0&&Math.abs(f.axis.length()-1)<1e-9&&f.sweep===WIPERS.sweep);assert.ok(new T.Vector3().crossVectors(f.axis,f.along).y>0,'its stroke turns it up the glass');}
  assert.ok(Math.abs(fans[0].pivot.x+.5)<.02&&Math.abs(fans[0].pivot.z-.8)<.02,'in the car’s frame');
});
test('wipers fused into one mesh get a pair of fans on the screen’s bottom edge, shorter than the screen is tall',()=>{
  const root=new T.Group(),pane=screen();root.add(pane);root.updateMatrixWorld(true);
  const fans=defaultSweeps(pane,root),box=new T.Box3().setFromObject(pane),up=Math.hypot(box.max.y-box.min.y,box.max.z-box.min.z),w=box.max.x-box.min.x;
  assert.equal(fans.length,2);
  for(const [k,f] of fans.entries()){
    assert.ok(Math.abs(f.pivot.x-ARCS.pivots[k]*w)<1e-6&&Math.abs(f.pivot.y-(box.min.y+.03))<1e-6&&Math.abs(f.pivot.z-(box.max.z-.03))<1e-6,'on the bottom edge');
    assert.ok(f.length<=ARCS.tall*up+1e-9&&f.length<=ARCS.reach*w+1e-9&&f.sweep===ARCS.sweep);
    assert.ok(f.axis.z>0&&new T.Vector3().crossVectors(f.axis,f.along).y>0,'turning up the glass');
  }
});
test('the dust film lies on the windscreen (sharing its geometry) with its fans, or nothing on a clean car',()=>{
  const root=new T.Group(),pane=screen();root.add(pane);root.updateMatrixWorld(true);
  const film=fitWiperArcs(pane,root,defaultSweeps(pane,root),.5);
  assert.ok(film!==null&&film.geometry===pane.geometry&&pane.children.includes(film!));
  const u=(film!.material as T.ShaderMaterial).uniforms;assert.equal(u.count.value,2);assert.equal(u.film.value,.5);assert.deepEqual(u.sweeps.value,[ARCS.sweep,ARCS.sweep]);
  assert.equal(fitWiperArcs(screen(),root,[],0),null,'clean car');
});
test('main dusts offline rivals’ windscreens (never the player’s) with their own wipers’ fans or the fused pair’s, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const film=dustFilm(startingRust(car.id)),screen=windscreen(car.glass,car.root);if(film>0&&screen){const own=sweeps(wiperArms(car.model),car.root),fans=own.length?own:defaultSweeps(screen,car.root);if(fans.length&&fitWiperArcs(screen,car.root,fans,film))dustyScreens.set(car,{film,fans:fans.length,own:own.length>0});}}'));
  assert.ok(main.includes('wiperArcs: (id = 0) =>'));
});
