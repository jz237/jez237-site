import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {substrateVolume} from '../lib/SubstrateVolume.ts';

test('soil walls and base close the uneven terrain without gaps or inverted seams',()=>{
 const top=new T.PlaneGeometry(10.12,4.6,11,7);top.rotateX(-Math.PI/2);
 const points=top.getAttribute('position');
 for(let i=0;i<points.count;i++)points.setY(i,.3+.12*Math.sin(points.getX(i))+.1*Math.cos(points.getZ(i)));
 const shell=substrateVolume(top,11,7),edges=new Map(),key=p=>p.toArray().map(v=>Math.round(v*1e5)).join(',');
 for(const geometry of [top,shell]){
  const position=geometry.getAttribute('position'),index=geometry.index;
  for(let i=0;i<(index?.count??position.count);i+=3){
   const p=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(position,index?index.getX(i+j):i+j));
   assert.ok(p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])).length()>1e-7);
   for(let j=0;j<3;j++){
    const a=key(p[j]),b=key(p[(j+1)%3]),edge=[a,b].sort().join('|'),value=edges.get(edge)??{count:0,winding:0};
    value.count++;value.winding+=a<b?1:-1;edges.set(edge,value);
   }
  }
 }
 for(const edge of edges.values()){assert.equal(edge.count,2,'each edge must meet exactly one other face');assert.equal(edge.winding,0,'neighboring triangles must have opposite edge winding');}
});

test('soil side and bottom textures retain world scale rather than stretching along the tank',()=>{
 const top=new T.PlaneGeometry(10.12,4.6,11,7);top.rotateX(-Math.PI/2);top.translate(0,.36,0);
 const shell=substrateVolume(top,11,7),p=shell.getAttribute('position'),uv=shell.getAttribute('uv');
 for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){
  const a=i+j,b=i+(j+1)%3;
  const distance=new T.Vector3().fromBufferAttribute(p,a).distanceTo(new T.Vector3().fromBufferAttribute(p,b));
  const textureDistance=new T.Vector2().fromBufferAttribute(uv,a).distanceTo(new T.Vector2().fromBufferAttribute(uv,b))*2.2;
  assert.ok(Math.abs(distance-textureDistance)<1e-5);
 }
});
