import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {buildMartenAsset} from '../src/marten-asset';
import {martenFrontHeaderSurface,martenRoofSurface,martenWindscreenBow} from '../src/marten-greenhouse';
import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';

const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
const mesh=(root:T.Group,name:string)=>root.getObjectByName(name) as T.Mesh;
const distance=(point:T.Vector3,m:T.Mesh)=>{
 const p=m.geometry.attributes.position,q=new T.Vector3(),tri=new T.Triangle();let best=Infinity;
 for(let i=0;i<p.count;i+=3){tri.a.fromBufferAttribute(p,i);tri.b.fromBufferAttribute(p,i+1);tri.c.fromBufferAttribute(p,i+2);tri.closestPointToPoint(point,q);best=Math.min(best,q.distanceTo(point));}
 return best;
};

test('the formed Marten greenhouse stays closed, outward and within the existing vehicle budget',()=>{
 const root=buildMartenAsset();let vertices=0;
 root.traverse(o=>{if(o instanceof T.Mesh)vertices+=o.geometry.attributes.position.count;});
 // Reviewed wheel pressings and sill clearance use a 89,000 vertex cap;
 // the prior 65k cap remains frozen in the classic-wheel layer.
 assert.ok(vertices<89000,`Authored vertices ${vertices}`);
 for(const name of ['panel_ApillarMartenL','panel_ApillarMartenR','panel_BpillarMartenL','panel_BpillarMartenR','panel_FrontMartenFrame','panel_RoofMarten','panel_FrontHeaderMarten']){
  const m=mesh(root,name),p=m.geometry.attributes.position,n=m.geometry.attributes.normal,edges=new Map<string,number>();let volume=0;
  for(const a of Object.values(m.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),name);
  for(let i=0;i<p.count;i+=3){
   const points=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j)),face=points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0]));
   assert.ok(face.lengthSq()>1e-18,name+' has no degenerate triangles');volume+=points[0].dot(points[1].clone().cross(points[2]))/6;
   for(let j=0;j<3;j++){assert.ok(face.dot(new T.Vector3().fromBufferAttribute(n,i+j))>=0,name+' retains outward shading');const edge=[key(points[j]),key(points[(j+1)%3])].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  }
  assert.ok(volume>1e-5,name+' has outward winding');assert.ok([...edges.values()].every(n=>n===2),name+' is closed');
 }
});

test('the curved windshield, cowl and crowned roof share their formed metal boundaries',()=>{
 const root=buildMartenAsset(),header=mesh(root,'panel_FrontHeaderMarten'),roof=mesh(root,'panel_RoofMarten'),frame=mesh(root,'panel_FrontMartenFrame'),hood=mesh(root,'panel_hoodMarten'),glass=mesh(root,'glass_FrontMarten');
 assert.ok(martenRoofSurface(.5,1).y-martenRoofSurface(0,1).y>.019,'The leading roof edge is crowned');
 for(let i=0;i<=48;i++){
  const u=i/48,a=martenFrontHeaderSurface(u,1),b=martenRoofSurface(u,1);assert.ok(a.distanceTo(b)<1e-8,'Roof and header use the same boundary');
  assert.ok(distance(a,roof)<.0016,'Sampled roof follows its edge');assert.ok(distance(b,header)<.0016,'Sampled header follows the roof');
  const x=T.MathUtils.lerp(-.58,.58,u),point=v(x,1.443,.14+martenWindscreenBow(x,1.443));assert.ok(distance(point,frame)<.0016,'Windshield top pressing follows the wrap');assert.ok(distance(point,header)<.0016,'Header rests on the screen surround');
 }
 for(const x of [-.55,-.30,0,.30,.55])assert.ok(distance(v(x,1.045,.62+martenWindscreenBow(x)),hood)<.0015,'Bonnet cowl follows the bottom screen edge');
 const p=glass.geometry.attributes.position,centre=Array.from({length:p.count},(_,i)=>v(p.getX(i),p.getY(i),p.getZ(i))).find(p=>Math.abs(p.x)<1e-6&&Math.abs(p.y-1.23)<.02)!;
 assert.ok(centre,'Windshield centre is sampled');const planeZ=.62-.48*(centre.y-1.025)/.418;assert.ok(centre.z-planeZ>.025,'The pane has a visible compound bow, not just a planar surround');
});

test('formed fixed pillars stay with the body while each door carries its own glass and frame',()=>{
 const root=buildMartenAsset();prepareWreckGeometry(root);
 const fixed=['panel_ApillarMartenL','panel_ApillarMartenR','panel_BpillarMartenL','panel_BpillarMartenR','panel_RoofMarten','panel_FrontHeaderMarten','glass_FrontMarten'].map(n=>mesh(root,n)),rest=fixed.map(m=>m.matrix.toArray());
 const attachments=new WreckAttachments(root,['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!),.80,.32);
 for(const side of ['left','right']){const door=attachments.assemblies.find(a=>a.name==='door-'+side)!;assert.ok(door);const suffix=side==='left'?'L':'R';for(const name of ['panel_BodyDoor'+suffix+'MartenFrame','panel_BodyDoor'+suffix+'MartenSeal','panel_BodyDoor'+suffix+'MartenTrim','glass_BodyDoor'+suffix+'Marten'])assert.ok(door.members.some(m=>m.mesh.name===name),name+' moves with the door');assert.ok(door.members.every(m=>!fixed.includes(m.mesh)));}
 attachments.hit(v(-.75,.93,.10),v(1,0,0),60);attachments.poseAt(1,0);const door=attachments.assemblies.find(a=>a.name==='door-left')!;assert.ok(door.loose>0);
 const delta=door.members[0].mesh.matrix.clone().multiply(door.members[0].matrix.clone().invert());for(const m of door.members){const other=m.mesh.matrix.clone().multiply(m.matrix.clone().invert());assert.ok(other.elements.every((x,i)=>Math.abs(x-delta.elements[i])<1e-6),m.mesh.name+' keeps the same hinge transform');}
 assert.deepEqual(fixed.map(m=>m.matrix.toArray()),rest);attachments.reset();for(const a of attachments.assemblies)for(const m of a.members)assert.deepEqual(m.mesh.matrix.toArray(),m.matrix.toArray());
});

test('the bowed glass and formed header deform and repair exactly with the shared damage field',()=>{
 const root=buildMartenAsset();prepareWreckGeometry(root);
 for(const name of ['glass_FrontMarten','panel_FrontMartenFrame','panel_FrontHeaderMarten','panel_ApillarMartenL','panel_RoofMarten']){
  const m=mesh(root,name),before=Array.from(m.geometry.attributes.position.array),normals=Array.from(m.geometry.attributes.normal.array);
  assert.ok(dentGeometry(m,v(-.35,1.40,.25),v(.15,-.4,-.90).normalize(),22)>0,name+' receives the roof-corner impact');assert.notDeepEqual(Array.from(m.geometry.attributes.position.array),before);
  for(const a of Object.values(m.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),name+' has finite damaged geometry');repairWreckGeometry(m);assert.deepEqual(Array.from(m.geometry.attributes.position.array),before);assert.deepEqual(Array.from(m.geometry.attributes.normal.array),normals);
 }
});
