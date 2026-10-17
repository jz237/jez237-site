import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {groundedRockMatrix} from '../scenery-grounding.js';
import {getCourse} from '../courses.js';
import {planVenueDressing} from '../venue-dressing.js';

const geometry=new T.IcosahedronGeometry(1,1),positions=geometry.attributes.position;
for(let i=0;i<positions.count;i++){
 const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i),k=.85+.13*Math.sin(x*6+z*3)*Math.cos(y*7);
 positions.setXYZ(i,x*k,y*k*.75,z*k);
}
function check(floor,point,scale){
 const matrix=groundedRockMatrix(geometry,floor,point,scale),p=new T.Vector3(),q=new T.Quaternion(),size=new T.Vector3(),v=new T.Vector3();matrix.decompose(p,q,size);
 assert.equal(p.x,point.x);assert.equal(p.z,point.z);assert.ok(matrix.elements.every(Number.isFinite));
 assert.ok(Math.abs(q.length()-1)<1e-12);
 for(let i=0;i<positions.count;i++)if(positions.getY(i)<=0){
  v.fromBufferAttribute(positions,i).applyMatrix4(matrix);
  assert.ok(v.y<=floor(v.x,v.z)-.11999,'underside remains embedded in the actual bank');
 }
 return {p,q};
}
test('decorative rocks follow steep and curved slopes without exposed undersides',()=>{
 for(const floor of [()=>5,(x,z)=>5+.85*x-.35*z,(x,z)=>5+.4*x+.1*z+.03*x*x])for(const angle of [0,.7,2.4]){
  check(floor,{x:3,z:-2,angle},[3.4,3.1,2.7]);
 }
 const flat=check(()=>5,{x:3,z:-2,angle:.7},[3.4,3.1,2.7]);assert.equal(flat.p.y,4.88);
});
test('all Glacier decorative rock undersides meet the rendered bank and leave source hazards untouched',()=>{
 const c=getCourse('glacier'),plan=planVenueDressing(c),before=JSON.stringify(c.rocks);
 assert.ok(plan.rocks.length>10);
 for(const p of plan.rocks)check(c.renderGround,p,[p.scale,p.scale*.9,p.scale*.8]);
 assert.equal(JSON.stringify(c.rocks),before);
});
