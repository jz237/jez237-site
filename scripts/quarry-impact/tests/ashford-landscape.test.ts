import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createAshfordWorld} from '../src/ashford-world';import {ashfordLandscapeHeight} from '../src/ashford-landscape';import {ASHFORD_SOLIDS} from '../src/ashford-course';
test('Ashford outer landscape covers old edges without covering the circuit and grounds its woodland',()=>{
 const world=createAshfordWorld();try{
  assert.equal(world.root.userData.solidRecords,ASHFORD_SOLIDS);const root=world.root.getObjectByName('ashford_landscape')!,ground=root.getObjectByName('ashford_outer_land') as T.Mesh;assert.ok(root);root.updateMatrixWorld(true);
  const ray=new T.Raycaster();const hit=(x:number,z:number)=>{ray.set(new T.Vector3(x,200,z),new T.Vector3(0,-1,0));return ray.intersectObject(ground,false)[0];};
  assert.equal(hit(0,0),undefined,'no new ground in circuit interior');
  for(const [x,z]of [[171,0],[-171,0],[0,151],[0,-211],[300,315],[-343,287]]){const h=hit(x,z);assert.ok(h,`coverage at ${x},${z}`);assert.ok(Math.abs(h.point.y-ashfordLandscapeHeight(x,z))<.00001);}
  assert.ok(root.userData.treePlaces.length>300);
  for(const p of root.userData.treePlaces){assert.ok(Math.abs(p.x)-p.radius*1.7>=190||Math.abs(p.z)-p.radius*1.7>=180);assert.ok(!(p.z< -140&&p.z> -235&&Math.abs(p.x)<115));}
  for(const p of root.userData.treePlaces.filter((_:unknown,i:number)=>i%31===0)){const h=hit(p.x,p.z);assert.ok(h);assert.ok(Math.abs(h.point.y-p.y)<.00001,'roots match rendered triangles');}
  let draws=0,triangles=0;root.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));if(o instanceof T.InstancedMesh)assert.ok(o.instanceMatrix.array.every(Number.isFinite));}});assert.equal(draws,3);assert.ok(triangles<180000,`triangles ${triangles}`);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
