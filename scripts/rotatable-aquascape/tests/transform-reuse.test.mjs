import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {reuseUnchangedTransforms} from '../lib/TransformReuse.ts';

test('authored mesh transforms reuse local matrices while fish parents and layer lessons still move',()=>{
 const build=()=>{const root=new T.Scene(),parent=new T.Group(),child=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial());root.add(parent);parent.add(child);child.position.set(1,2,3);return {root,parent,child};};
 const a=build(),b=build();let compositions=0;
 const original=a.child.updateMatrix;a.child.updateMatrix=function(){compositions++;original.call(this);};
 reuseUnchangedTransforms(a.root);
 assert.equal(a.parent.matrixAutoUpdate,true);assert.equal(a.child.matrixAutoUpdate,false);
 const check=()=>{a.root.updateMatrixWorld();b.root.updateMatrixWorld();for(const key of ['root','parent','child'])assert.deepEqual(a[key].matrixWorld.elements,b[key].matrixWorld.elements);};
 check();const first=compositions;check();assert.equal(compositions,first);
 for(let frame=0;frame<100;frame++){
  for(const c of [a,b]){c.parent.position.x=Math.sin(frame*.3);c.parent.rotation.y=frame*.1;if(frame===50)c.root.add(c.child);}
  if(frame===50){a.child.matrixWorldNeedsUpdate=true;b.child.matrixWorldNeedsUpdate=true;}
  check();
 }
 for(const c of [a,b]){c.child.position.y+=2;c.child.updateMatrix();}
 check();
 const food=new T.Mesh();a.root.add(food);assert.equal(food.matrixAutoUpdate,true);
 food.position.set(4,5,6);a.root.updateMatrixWorld();assert.deepEqual(food.matrixWorld.elements.slice(12,15),[4,5,6]);
});
