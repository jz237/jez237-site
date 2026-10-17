import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createFenwickWorld} from '../src/fenwick-world';
import {FENWICK_COURSES} from '../src/fenwick-course';
for(const course of FENWICK_COURSES)test(`${course.id}: wheel moves, cabins stay upright and the full sweep stays clear`,()=>{
 const world=createFenwickWorld(course.id),boxes=world.root.getObjectByName('fenwick_fair_boxes') as T.InstancedMesh,tubes=world.root.getObjectByName('fenwick_fair_tubes') as T.InstancedMesh;
 const initialBoxes=boxes.instanceMatrix.array.slice(),initialTubes=tubes.instanceMatrix.array.slice(),matrix=new T.Matrix4(),point=new T.Vector3();
 try{
  world.update(37.5);boxes.getMatrixAt(0,matrix);
  assert.ok(Math.abs(matrix.elements[12])<1e-5);assert.ok(Math.abs(matrix.elements[13]-49.9)<1e-4);
  // First body started at x=23, y=26.9. It translates around the hub without rotating its axes.
  assert.deepEqual(Array.from(matrix.elements.slice(0,12)),Array.from(initialBoxes.slice(0,12)));
  assert.notDeepEqual(tubes.instanceMatrix.array,initialTubes,'spokes/rim rotate');
  for(let step=0;step<=24;step++){
   world.update(step*150/24);
   for(let cabin=0;cabin<24;cabin++){boxes.getMatrixAt(cabin,matrix);assert.deepEqual(Array.from(matrix.elements.slice(0,12)),Array.from(initialBoxes.slice(cabin*16,cabin*16+12)),'all cabin body/roof axes stay upright');}
   for(const mesh of [boxes,tubes]){
    assert.ok(mesh.instanceMatrix.array.every(Number.isFinite));
    for(let i=0;i<mesh.count;i++){
     mesh.getMatrixAt(i,matrix);const positions=mesh.geometry.attributes.position;
     for(let j=0;j<positions.count;j++){
      point.fromBufferAttribute(positions,j).applyMatrix4(matrix);
      assert.ok(Math.abs(point.z)>125&&Math.abs(point.z)<180&&Math.abs(point.x)<220&&point.y>=-.2,'full sweep stays outside the track and above ground');
      assert.ok(point.distanceTo(mesh.boundingSphere!.center)<=mesh.boundingSphere!.radius+1e-4,'animated vertices stay inside culling bounds');
     }
    }
   }
  }
  assert.deepEqual(boxes.instanceMatrix.array,initialBoxes,'full revolution returns exactly to start');
  assert.ok(tubes.instanceMatrix.array.every((v,i)=>Math.abs(v-initialTubes[i])<1e-6),'rim returns to initial pose within float precision');
  world.update(37.5);const quarter=boxes.instanceMatrix.array.slice();world.update(90);world.update(37.5);assert.deepEqual(boxes.instanceMatrix.array,quarter,'backward time seeks are deterministic');
  world.update(NaN);world.update(Infinity);assert.deepEqual(boxes.instanceMatrix.array,quarter);
  assert.deepEqual(Array.from(boxes.instanceMatrix.array.slice(24*16)),Array.from(initialBoxes.slice(24*16)),'stalls and garage details remain still');
  assert.equal(world.root.userData.solidRecords,course.solids);
 }finally{world.dispose();world.dispose();const stopped=boxes.instanceMatrix.array.slice();world.update(11);assert.deepEqual(boxes.instanceMatrix.array,stopped);}
});
