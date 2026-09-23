import assert from 'node:assert/strict';import * as T from 'three';import {flankShelf} from '../ReefFlankShelves.ts';
for(const normal of [new T.Vector3(0,0,1),new T.Vector3(.6,.3,.8).normalize(),new T.Vector3(-.4,-.4,.8).normalize()]){
 const point=new T.Vector3(1,2,.3),{geometry:g,obstacle,root}=flankShelf(point,normal,.3,23,.09),p=g.getAttribute('position');
 assert.ok(Math.abs(root.distanceTo(point)-.016)<1e-10);assert.ok(root.clone().sub(point).dot(normal)<0,'attachment sits inside supporting surface');
 for(const a of Object.values(g.attributes))assert.ok(a.array.every(Number.isFinite));
 const edges=new Map(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();let volume=0;
 for(let i=0;i<g.index.count;i+=3){const ids=[0,1,2].map(k=>g.index.getX(i+k));a.fromBufferAttribute(p,ids[0]);b.fromBufferAttribute(p,ids[1]);c.fromBufferAttribute(p,ids[2]);volume+=a.dot(b.clone().cross(c))/6;assert.ok(b.clone().sub(a).cross(c.clone().sub(a)).length()>1e-12,'all triangles have area');
  for(let j=0;j<3;j++){const v=ids[j],w=ids[(j+1)%3],key=[v,w].sort((a,b)=>a-b).join(':');const e=edges.get(key)||{count:0,direction:0};e.count++;e.direction+=v<w?1:-1;edges.set(key,e);}
 }
 assert.ok(volume>0,'closed skeleton winds outward');assert.ok([...edges.values()].every(e=>e.count===2&&e.direction===0),'every edge is closed with consistent winding');
 for(let i=0;i<p.count;i++)assert.ok(new T.Vector3().fromBufferAttribute(p,i).distanceTo(obstacle.center)<obstacle.radius,'fish bounds enclose every vertex');
 const bytes=Object.values(g.attributes).reduce((s,a)=>s+a.array.byteLength,0)+g.index.array.byteLength;assert.ok(bytes<240000&&g.index.count/3<8000,'small shelves retain a bounded merged allocation');console.log({triangles:g.index.count/3,bytes,volume});g.dispose();
}
