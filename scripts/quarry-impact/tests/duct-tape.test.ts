import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {TAPE,bumperCorner,fitTape,strips,tapeFor} from '../src/duct-tape';
const panel=(name:string,size:[number,number,number],at:[number,number,number],segments=8)=>{const g=new T.BoxGeometry(...size,segments,segments,segments).translate(...at);g.setAttribute('wreckPosition',g.attributes.position.clone());const m=new T.Mesh(g,new T.MeshStandardMaterial());m.name=name;return m;};
test('about TAPE.share of the old rivals have a bumper corner taped, front or back, now and then both corners',()=>{
  const all=Array.from({length:400},(_,id)=>tapeFor(id,1)),hit=all.filter(t=>t!==null);
  assert.ok(Math.abs(hit.length/all.length-TAPE.share)<.08,`share ${hit.length/all.length}`);
  assert.ok(hit.some(t=>t!.end===1)&&hit.some(t=>t!.end===-1)&&hit.some(t=>t!.corners.length===2)&&hit.every(t=>t!.corners.every(c=>c===1||c===-1)));
  assert.ok(Array.from({length:100},(_,id)=>tapeFor(id,TAPE.age-.01)).every(t=>t===null),'not on younger cars');assert.equal(tapeFor(2,NaN),null);
});
test('each car’s strips lie one above another, a little askew, each its own length',()=>{
  const s=strips(9);assert.equal(s.length,TAPE.strips);
  for(let k=1;k<s.length;k++)assert.ok(s[k].x>s[k-1].x,'stacked');
  for(const v of s)assert.ok(Math.abs(v.y)<=.25&&v.z<=TAPE.reach&&v.z>=TAPE.reach*.7);
  assert.deepEqual(strips(9).map(v=>v.toArray()),s.map(v=>v.toArray()));
});
test('the tape sits at the bumper’s end, in from the side, just above its top edge, on the body behind a bar bumper',()=>{
  const root=new T.Group(),bar=panel('panel_bumper_rear',[1.6,.1,.08],[0,-.35,-2.45]),body=panel('panel_RearQuarterR',[1.7,.6,.4],[0,-.05,-2.1]),front=panel('panel_bumper_front',[1.6,.1,.08],[0,-.35,2.4]);
  root.add(bar,body,front);root.updateMatrixWorld(true);
  const c=bumperCorner(root,[bar,body,front],-1,1)!;
  assert.ok(Math.abs(c.x-(.8-TAPE.inset))<1e-6&&Math.abs(c.y-(-.3+TAPE.lift))<1e-6,'in from the side, over the top edge');
  assert.ok(Math.abs(c.z-(-2.3))<1e-6,'on the body, not out on the bar');
  assert.ok(bumperCorner(root,[body],-1,1)===null,'no bumper, no corner');
});
test('the tape is laid over the panels about the corner (just the triangles it can cover), not the far end',()=>{
  const root=new T.Group(),bar=panel('panel_bumper_rear',[1.6,.1,.08],[0,-.35,-2.45]),body=panel('panel_RearQuarterR',[1.7,.6,.4],[0,-.05,-2.1]),front=panel('panel_bumper_front',[1.6,.1,.08],[0,-.35,2.4]);
  root.add(bar,body,front);root.updateMatrixWorld(true);
  const n=fitTape(root,[bar,body,front],new T.Vector3(.7,-.26,-2.3),5),tape=(p:T.Mesh)=>p.children.find(c=>c.name==='duct_tape') as T.Mesh|undefined;
  assert.equal(n,2);assert.ok(!!tape(bar)&&!!tape(body)&&!tape(front));assert.ok(tape(body)!.geometry.getAttribute('position')===body.geometry.getAttribute('position')&&tape(body)!.geometry.index!.count<body.geometry.index!.count,'its own few triangles, from the panel’s buffers');
});
test('main tapes old rivals’ bumper corners, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const tape=tapeFor(car.id,startingRust(car.id));if(tape){let n=0;const at:number[][]=[];for(const side of tape.corners){const corner=bumperCorner(car.root,car.panels,tape.end,side);if(corner){n+=fitTape(car.root,car.panels,corner,car.id*2+side);'));
  assert.ok(main.includes('tape: (id = 0) =>'));
});
