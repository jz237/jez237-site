import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {classicWindowFrame} from '../src/classic-window-frame';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
import {verifyEstateCoachworkRevision} from './estate-coachwork-invariants';

test('window surround is a closed steel section with a recessed pane and no uncovered aperture',()=>{
 const parts=classicWindowFrame([new T.Vector3(-.8,0,0),new T.Vector3(.8,0,0),new T.Vector3(.8,.5,0),new T.Vector3(-.8,.5,0)],1);
 const group=new T.Group(),material=new T.MeshBasicMaterial({side:T.FrontSide});
 for(const [name,g]of Object.entries(parts)){const m=new T.Mesh(g,material);m.name=name;group.add(m);}
 group.updateMatrixWorld(true);
 const cast=(x:number,y:number)=>new T.Raycaster(new T.Vector3(x,y,1),new T.Vector3(0,0,-1)).intersectObject(group,true)[0];
 assert.equal(cast(0,.25)?.object.name,'glass');assert.ok(cast(0,.25).point.z<=-.0059);
 assert.equal(cast(0,.012)?.object.name,'frame');assert.equal(cast(0,.030)?.object.name,'seal');
 for(let x=-.77;x<.78;x+=.02)for(let y=.012;y<.49;y+=.013)assert.ok(cast(x,y),`Uncovered opening at ${x}, ${y}`);
 const p=parts.frame.getAttribute('position'),edges=new Map<string,number>();
 const key=(i:number)=>[p.getX(i),p.getY(i),p.getZ(i)].map(n=>n.toFixed(6)).join(',');
 for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const k=[key(i+j),key(i+(j+1)%3)].sort().join('|');edges.set(k,(edges.get(k)??0)+1);}
 assert.ok([...edges.values()].every(n=>n===2),'The frame must have a continuous back skin and aperture return');
 // The pane meets the actual inner seal vertices, including rounded corners.
 const g=parts.glass.getAttribute('position'),s=parts.seal.getAttribute('position');
 const gv=new Set(Array.from({length:g.count},(_,i)=>[g.getX(i),g.getY(i),g.getZ(i)].map(n=>n.toFixed(6)).join(',')));
 const inner=Array.from({length:s.count},(_,i)=>i).filter(i=>Math.abs(s.getZ(i)+.01)<1e-6);
 assert.ok(inner.length>=20);for(const i of inner)assert.ok(gv.has([s.getX(i),s.getY(i),s.getZ(i)].map(n=>n.toFixed(6)).join(',')));
});

test('all four production estate door frames, seals and windows share the correct hinge and repair',async()=>{
 const root=(await loadCarWithoutImages('wagon')).scene;prepareWreckGeometry(root);
 const parts=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.914);
 for(const side of ['L','R'])for(const rear of [false,true]){
  const stem='BodyDoor'+(rear?'Rear':'')+side,name='door-'+(rear?'rear-':'')+(side==='L'?'left':'right');
  const group=parts.assemblies.find(a=>a.name===name)!;assert.ok(group);
  for(const meshName of ['glass_'+stem,...['Frame','Seal','Trim'].map(p=>'panel_'+stem+'Window'+p)])assert.ok(group.members.some(m=>m.mesh.name===meshName),meshName);
  const frame=root.getObjectByName('panel_'+stem+'WindowFrame')as T.Mesh,before=Array.from(frame.geometry.attributes.position.array);
  const point=group.bounds.getCenter(new T.Vector3());point.y=1.2;const direction=new T.Vector3(side==='L'?1:-1,0,0);
  assert.ok(dentGeometry(frame,point,direction,24)>0);assert.notDeepEqual(Array.from(frame.geometry.attributes.position.array),before);
  repairWreckGeometry(frame);assert.deepEqual(Array.from(frame.geometry.attributes.position.array),before);
  parts.hit(point,direction,45);parts.pose(.3,10);assert.ok(group.members.every(p=>!p.mesh.matrix.equals(p.matrix)));parts.reset();assert.ok(group.members.every(p=>p.mesh.matrix.equals(p.matrix)));
 }
});

test('estate finish preserves preceding geometry sources and historical validation',()=>verifyEstateCoachworkRevision());
