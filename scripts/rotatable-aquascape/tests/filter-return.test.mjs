import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {FilterReturnWater} from '../../living-aquascape/lib/aquarium/FilterReturnWater.ts';

test('outlet stream stays below the mouth, moves, and reuses bounded instance pools',()=>{
 const stream=new FilterReturnWater(),children=[...stream.children],m=new T.Matrix4();
 const initial=children[0].instanceMatrix.array.slice();
 for(let time=0;time<2;time+=.1){stream.update(time);assert.deepEqual(stream.children,children);
  for(const mesh of children)for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,m);assert.ok(m.elements.every(Number.isFinite));assert.ok(m.elements[13]<=3.701&&m.elements[13]>=2.58);assert.ok(m.elements[12]>2.1&&m.elements[12]<3.7);}}
 assert.notDeepEqual(children[0].instanceMatrix.array,initial);
 const held=children[0].instanceMatrix.array.slice();stream.update(1.9);assert.deepEqual(children[0].instanceMatrix.array,held);
 for(const mesh of children){mesh.geometry.dispose();mesh.material.dispose();}
});
