import test from 'node:test';import assert from 'node:assert/strict';import {stampedPanel} from '../src/classic-panel';
test('stamped body panels are closed, finite and crowned without changing the mounting edge',()=>{
 const g=stampedPanel(1.85,1.68,.045,.026,-.028),p=g.attributes.position,n=g.attributes.normal,indices=g.index!.array,edges=new Map<string,number>();
 for(let i=0;i<indices.length;i+=3)for(let k=0;k<3;k++){const a=indices[i+k],b=indices[i+(k+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(':');edges.set(key,(edges.get(key)??0)+1);}
 assert.ok([...edges.values()].every(count=>count===2),'Every edge belongs to two faces');assert.ok(Array.from(p.array).every(Number.isFinite));assert.ok(Array.from(n.array).every(Number.isFinite));g.computeBoundingBox();assert.ok(Math.abs(g.boundingBox!.min.x+.925)<1e-6&&Math.abs(g.boundingBox!.max.z-.84)<1e-6);
 const at=(x:number,z:number)=>{for(let i=0;i<p.count/2;i++)if(Math.abs(p.getX(i)-x)<1e-5&&Math.abs(p.getZ(i)-z)<1e-5)return i;throw Error('sample missing');};const center=at(0,0),edge=at(.925,0);assert.ok(p.getY(center)-p.getY(edge)>.025);assert.ok(n.getY(center)>.99);g.dispose();
});
