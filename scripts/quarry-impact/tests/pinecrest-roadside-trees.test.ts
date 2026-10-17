import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createPinecrestRoadsideTrees} from '../src/pinecrest-roadside-trees';import {PINECREST} from '../src/pinecrest-course';
test('roadside conifers stay rooted at original sites with bounded branch crowns',()=>{
 const trees=createPinecrestRoadsideTrees(),places=trees.root.userData.treePlaces;assert.ok(places.length>50);
 try{const matrix=new T.Matrix4(),v=new T.Vector3();let triangles=0,draws=0;
 trees.root.traverse(o=>{if(!(o instanceof T.InstancedMesh))return;draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*o.count;assert.ok(o.instanceMatrix.array.every(Number.isFinite));
 for(let i=0;i<o.count;i++){const place=places[o.name.endsWith('trunks')?i:Math.floor(i/42)];o.getMatrixAt(i,matrix);const positions=o.geometry.attributes.position;
 for(let j=0;j<positions.count;j++){v.fromBufferAttribute(positions,j).applyMatrix4(matrix);assert.ok(Math.hypot(v.x-place.x,v.z-place.z)<4,'crown stays within previous tree radius');assert.ok(v.y>=place.y-.001,'no root below ground');}
 }});assert.equal(draws,3);assert.ok(triangles<250000);for(const p of places){assert.equal(p.y,PINECREST.height(p.x,p.z));assert.ok(!(p.z<0&&Math.abs(p.x)<85),'garage frontage remains open');}
 }finally{trees.dispose();trees.dispose();assert.equal(trees.root.children.length,0);}
});
