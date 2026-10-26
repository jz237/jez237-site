import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DANGLE,Danglers,dangleFor,danglerGeometry,mirrorPoint,swingDangler} from '../src/danglers';
test('most cars have something hanging from the mirror, each its own, in its own colour',()=>{
  const all=Array.from({length:300},(_,id)=>dangleFor(id)),share=(k:string)=>all.filter(d=>d.kind===k).length/all.length;
  assert.ok(Math.abs(share('dice')-DANGLE.dice)<.08&&Math.abs(share('tree')-DANGLE.tree)<.08,'dice mostly, then trees');
  assert.ok(all.every(d=>d.kind==='none'||(d.kind==='dice'?DANGLE.diceColours:DANGLE.treeColours).includes(d.colour as never)));
  assert.deepEqual(dangleFor(4),dangleFor(4));assert.ok(['dice','tree','none'].includes(dangleFor(NaN).kind));
});
test('it swings back under acceleration, forward under braking, out in a corner, and settles',()=>{
  const run=(accel:{x:number;z:number},seconds:number)=>{const s={pitch:0,pitchV:0,roll:0,rollV:0};for(let i=0;i<seconds*60;i++)swingDangler(s,accel,1/60);return s;};
  assert.ok(run({x:0,z:6},.15).pitch>.1,'back as it pulls away');assert.ok(run({x:0,z:-8},.15).pitch< -.1,'forward on the brakes');
  assert.ok(run({x:5,z:0},.15).roll< -.1,'out of a turn to the left');
  const settled=run({x:0,z:4},20);assert.ok(Math.abs(settled.pitch-Math.atan2(4,9.81))<.01&&Math.abs(settled.pitchV)<.01,'hangs at the angle of the pull');
  const wild=run({x:0,z:900},1);assert.ok(Math.abs(wild.pitch)<=DANGLE.max,'never past its stop');
  const s={pitch:.3,pitchV:0,roll:0,rollV:0};swingDangler(s,{x:NaN,z:NaN},NaN);assert.equal(s.pitch,.3,'no time, no swing');
});
test('the ornament is one coloured mesh hanging from its point: a cord, then the dice or the tree',()=>{
  for(const kind of ['dice','tree'] as const){const g=danglerGeometry(kind,0xf06aa8);g.computeBoundingBox();const b=g.boundingBox!;
    assert.ok(b.max.y<=1e-6&&b.min.y< -DANGLE.cord,'hanging down from the top');assert.ok(g.attributes.color&&g.attributes.normal,'vertex coloured, lit');}
  const root=new T.Group(),d=new Danglers(root,'dice',0xf2f2f2,new T.Vector3(0,.9,.4));assert.ok(root.children.includes(d.group)&&d.group.position.z===.4);
  d.update(new T.Vector3(0,0,0),1/60);d.update(new T.Vector3(0,0,.1),1/60);assert.ok(d.state.pitch>0&&d.swing.rotation.x>0,'pulled back, turned so');
  d.dispose();assert.ok(!root.children.includes(d.group));
});
test('it hangs under the roof, on the centre line, just behind the windscreen',()=>{
  const root=new T.Group(),roof=new T.Mesh(new T.BoxGeometry(1.4,.02,1.6).translate(0,1.25,0),new T.MeshBasicMaterial()),screen=new T.Mesh(new T.PlaneGeometry(1.4,.6).rotateY(Math.PI).translate(0,1,.9),new T.MeshBasicMaterial({side:T.DoubleSide}));
  root.add(roof,screen);const at=mirrorPoint(root,new T.Vector3(-.4,.95,-.2),[roof,screen]);
  assert.equal(at.x,0,'the middle');assert.ok(Math.abs(at.y-(1.24-DANGLE.above))<.01,'under the roof');assert.ok(Math.abs(at.z-(.9-DANGLE.back))<.01,'behind the windscreen');
  const open=mirrorPoint(new T.Group(),new T.Vector3(-.4,.95,-.2),[]);assert.ok(Math.abs(open.y-(.95+.25-DANGLE.above))<1e-9&&Math.abs(open.z-(-.2+.55))<1e-9,'a fair guess with nothing found');
});
test('main hangs one in offline cars with a driver (not the buggies), swings it every frame, clears it with the car',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&driver&&d.kind!=='none'&&type!=='buggy'&&type!=='trail'){car.root.updateMatrixWorld(true);danglers.set(car,new Danglers(car.root,d.kind,d.colour,mirrorPoint(car.root,car.root.worldToLocal(driver.getWorldPosition(new T.Vector3())),[...car.panels,...car.glass])));}"));
  assert.ok(main.includes('danglers.get(c)?.update(c.velocity,dt);')&&main.includes('danglers.get(c)?.dispose();danglers.delete(c);c.dispose();}')&&main.includes('dangler: (id = 0) =>'));
});
