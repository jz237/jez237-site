import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {hollowTube} from '../lib/HollowTube.ts';

const key=p=>p.toArray().map(x=>Math.round(x*1e6)).join(',');
test('curved glass tube has a closed wall shell with consistent winding',()=>{
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(0,1,0),new T.Vector3(.35,1.5,0),new T.Vector3(.8,1.6,.2)]);
 const g=hollowTube(curve,t=>.075+.10*t*t,.011,48,24),p=g.getAttribute('position'),n=g.getAttribute('normal'),index=g.index,edges=new Map();
 for(let i=0;i<p.count;i++){const normal=new T.Vector3().fromBufferAttribute(n,i);assert.ok(Number.isFinite(normal.length()));assert.ok(normal.length()>.99);}
 for(let i=0;i<index.count;i+=3){
  const points=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,index.getX(i+j)));
  assert.ok(points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).length()>1e-9);
  for(let j=0;j<3;j++){
   const a=key(points[j]),b=key(points[(j+1)%3]),id=[a,b].sort().join('|'),edge=edges.get(id)??{count:0,winding:0};
   edge.count++;edge.winding+=a<b?1:-1;edges.set(id,edge);
  }
 }
 for(const edge of edges.values()){assert.equal(edge.count,2);assert.equal(edge.winding,0);}
 g.dispose();
});

test('end rims leave an unobstructed bore instead of capping the water passage',()=>{
 const curve=new T.LineCurve3(new T.Vector3(0,0,0),new T.Vector3(0,2,0));
 const g=hollowTube(curve,()=>.1,.02,12,32),material=new T.MeshBasicMaterial({side:T.DoubleSide}),mesh=new T.Mesh(g,material);
 mesh.updateMatrixWorld(true);
 const through=new T.Raycaster(new T.Vector3(0,-1,0),new T.Vector3(0,1,0));
 assert.equal(through.intersectObject(mesh).length,0,'center must remain open');
 const rim=new T.Raycaster(new T.Vector3(.09,-1,0),new T.Vector3(0,1,0));
 assert.ok(rim.intersectObject(mesh).length>=2,'annular glass rims must exist');
 material.side=T.FrontSide;
 const outside=new T.Raycaster(new T.Vector3(.5,1,0),new T.Vector3(-1,0,0)).intersectObject(mesh);
 const inside=new T.Raycaster(new T.Vector3(0,1,0),new T.Vector3(1,0,0)).intersectObject(mesh);
 assert.ok(Math.abs(outside[0].point.x-.1)<1e-6,'outer wall must face outward');
 assert.ok(Math.abs(inside[0].point.x-.08)<1e-6,'inner wall must face into the bore');
 g.dispose();material.dispose();
});
