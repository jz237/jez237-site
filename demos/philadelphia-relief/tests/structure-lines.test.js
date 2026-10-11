import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createStructures } from '../src/structures.js';

test('bridge cable ribbons retain consistent triangle winding from either bank and overhead',()=>{
  const structures=createStructures(THREE,{manifest:{zones:[]},quality:'balanced',
    projection:{lonToX:x=>x,latToZ:z=>z,xToLon:x=>x,zToLat:z=>z},sampleElevation:()=>0,
    bridgesDoc:{bridges:[{id:'test',name:'Test suspension bridge',type:'suspension',
      centerline:[[0,0],[1062,0]],main_span_m:533,tower_height_m:116,
      clearance_m:41,deck_width_m:38.7,opened:1926}]}});
  try{
    const geometry=structures.group.getObjectByName('structures-bridge-lines').geometry;
    const a=geometry.attributes;
    const area=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
    let checked=0;
    for(const eye of [[1200,550,1000],[-200,350,-900],[500,1500,10]]){
      const camera=new THREE.PerspectiveCamera(45,1.6,.5,20000);
      camera.position.set(...eye);camera.lookAt(500,50,0);camera.updateMatrixWorld();
      const point=(index,other=false)=>new THREE.Vector3(
        (other?a.aOther:a.position).getX(index),
        (other?a.aOtherElev:a.aElev).getX(index)+(other?a.aOtherStruct:a.aStruct).getX(index)+.5,
        (other?a.aOther:a.position).getZ(index)).project(camera);
      for(let i=0;i<a.position.count;i+=4){
        const start=point(i),end=point(i,true);
        if(Math.hypot(end.x-start.x,end.y-start.y)<1e-6)continue;
        // Project the real endpoint data and expand a thin ribbon in screen
        // space. Both triangles must face the same way, including vertical
        // hangers; crossed endpoint offsets produce a bow-tie instead.
        const corners=Array.from({length:4},(_,k)=>{
          const v=i+k,p=point(v),q=point(v,true);
          const dir=new THREE.Vector2(q.x-p.x,q.y-p.y).normalize()
            .multiplyScalar(a.aDirection?.getX(v)??1);
          const side=a.aSide.getX(v)*.001;
          return {x:p.x-dir.y*side,y:p.y+dir.x*side};
        });
        const windingA=area(corners[0],corners[1],corners[2]);
        const windingB=area(corners[2],corners[1],corners[3]);
        assert.ok(windingA*windingB>0,`crossed cable ribbon ${i/4} from ${eye}`);
        checked++;
      }
    }
    assert.ok(checked>100,'exercise main cables, hangers and multiple viewpoints');
  }finally{structures.dispose();}
});
