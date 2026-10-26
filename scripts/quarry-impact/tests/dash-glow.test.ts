import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DASH,DashGlow,dashPoint,isCluster,isDial} from '../src/dash-glow';
const mesh=(material:string,at:[number,number,number],emissive=0)=>{const m=new T.Mesh(new T.BoxGeometry(.3,.1,.05).translate(...at),new T.MeshStandardMaterial({name:material,emissiveIntensity:emissive}));return m;};
test('a model’s own instruments: the coupes’ glowing cluster, plain dial faces, never the rest of the dash',()=>{
  for(const n of ['Dashboard','Dashboard.001','Dashboard.002'])assert.ok(isCluster(new T.MeshStandardMaterial({name:n})),n);
  assert.ok(isDial(new T.MeshStandardMaterial({name:'Interior Cornet Dial'}))&&isDial(new T.MeshStandardMaterial({name:'Interior Hollins Dial'})));
  for(const n of ['Interior Pipit Dash','Interior Starfin Dash','paint Body','Dashboard trim'])assert.ok(!isCluster(new T.MeshStandardMaterial({name:n}))&&!isDial(new T.MeshStandardMaterial({name:n})),n);
});
test('added dials sit below the helmet, just short of the dash ahead, and inside the door beside them',()=>{
  const root=new T.Group(),dash=new T.Mesh(new T.BoxGeometry(2,1,.1).translate(0,0,.6));root.add(dash);
  const p=dashPoint(root,new T.Vector3(-.4,.3,0),[dash]);
  assert.ok(Math.abs(p.y-(.3-DASH.drop))<1e-9&&Math.abs(p.z-(.55-DASH.gap))<1e-6&&p.x===-.4,'on the dash face');
  const far=dashPoint(root,new T.Vector3(-.4,.3,0),[]);assert.ok(Math.abs(far.z-DASH.reach)<1e-9,'nothing ahead');
  const door=new T.Mesh(new T.BoxGeometry(.05,1,2).translate(-.5,0,.4));root.add(door);
  const q=dashPoint(root,new T.Vector3(-.4,.3,0),[dash,door]),inset=DASH.size[0]/2+DASH.gap;
  assert.ok(Math.abs((q.x-inset)-(-.475))<1e-6,'moved in until its edge clears the door');
});
test('a model’s glowing cluster lives with the electrics — dark when they die — and no dials are added',()=>{
  const root=new T.Group(),cluster=mesh('Dashboard.001',[0,0,1],3);root.add(cluster);root.updateMatrixWorld(true);
  const g=new DashGlow(root,new T.Vector3(-.4,0,.5),[cluster]),m=cluster.material as T.MeshStandardMaterial;
  assert.ok(g.clusters.length===1&&g.dials===null);
  g.update(false,true,100,0);assert.equal(m.emissiveIntensity,0);assert.ok(!g.lit);
  g.update(true,false,100,0);assert.equal(m.emissiveIntensity,3,'lit by day too');assert.ok(g.lit&&!g.halo.visible,'no glow without the lamps');
  g.update(true,true,100,0);assert.ok(g.halo.visible,'its glow at dusk');
  g.update(false,true,100,0);g.dispose();assert.equal(m.emissiveIntensity,3,'left as it came');assert.ok(!root.children.includes(g.halo)&&!root.children.includes(g.lamp));
});
test('plain dial faces glow amber with the lamps',()=>{
  const root=new T.Group(),dial=mesh('Interior Cornet Dial',[-.4,0,.6]);root.add(dial);root.updateMatrixWorld(true);
  const g=new DashGlow(root,new T.Vector3(-.4,0,.5),[dial]),m=dial.material as T.MeshStandardMaterial;
  assert.equal(m.emissive.getHex(),DASH.amber);assert.equal(m.emissiveIntensity,0);assert.ok(g.faces.length===1&&g.dials===null);
  g.update(true,true,100,0);assert.equal(m.emissiveIntensity,DASH.dial);g.update(true,false,100,0);assert.equal(m.emissiveIntensity,0);g.update(false,true,100,0);assert.equal(m.emissiveIntensity,0);
});
test('a car with no instruments of its own gets dials lit with the lamps, and its glow hides in the car the camera sits in',()=>{
  const root=new T.Group(),g=new DashGlow(root,new T.Vector3(-.4,0,.5),[mesh('paint Body',[0,0,0])]);
  assert.ok(g.dials!==null&&root.children.includes(g.dials!)&&g.dials!.position.z===.5);
  g.update(true,false,100,0);assert.ok(!g.dials!.visible&&!g.halo.visible);
  g.update(true,true,100,0);assert.ok(g.dials!.visible&&g.halo.visible&&g.lit);
  g.seat(true);assert.ok(!g.halo.visible);g.update(true,true,100,0);assert.ok(!g.halo.visible&&g.dials!.visible,'dials still lit for the driver');
  g.seat(false);g.update(true,true,100,0);assert.ok(g.halo.visible);
  g.update(false,true,100,0);assert.ok(!g.dials!.visible&&!g.halo.visible,'dead electrics');
  g.dispose();assert.ok(root.children.length===0);
});
test('a badly hurt car’s warning lamp blinks DASH.blink times a second while the electrics live',()=>{
  const g=new DashGlow(new T.Group(),new T.Vector3(-.4,0,.5),[]),half=1/(DASH.blink*2);
  const at=(t:number,health=DASH.warn-10,live=true)=>{g.update(live,false,health,t);return g.lamp.visible;};
  assert.ok(at(0)&&!at(half*1.1)&&at(half*2.1),'on, off, on');assert.ok(!at(0,DASH.warn+1),'healthy');assert.ok(!at(0,10,false),'dead electrics');assert.doesNotThrow(()=>at(NaN));
});
test('main lights offline cars’ instruments (not the buggies) with the electrics and lamps, hides the glow inside, and cleans up',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&driver&&type!=='buggy'&&type!=='trail'){car.root.updateMatrixWorld(true);const meshes:T.Mesh[]=[];car.root.traverse(o=>{if(o instanceof T.Mesh)meshes.push(o);});dashGlows.set(car,new DashGlow("));
  assert.ok(main.includes('g.update(c.health>0&&!c.electricalCut&&!c.batteryOut&&(!c.beltSnapped||batteryLights(c.battery,clock,c.id))&&!flickerOff(clock-(wiringAt.get(c)??-9),c.id),lamps,c.health,clock);'));
  assert.ok(main.includes("{const lamps=eventLighting==='dusk'||eventLighting==='rain';for(const c of cars){const g=dashGlows.get(c);"),'with the lamps at dusk and in the rain');
  assert.ok(main.includes('for(const c of cars)dashGlows.get(c)?.seat(inside&&c===viewed);'));
  assert.ok(main.includes('dashGlows.get(c)?.dispose();dashGlows.delete(c);')&&main.includes('dash: (id = 0) =>'));
});
