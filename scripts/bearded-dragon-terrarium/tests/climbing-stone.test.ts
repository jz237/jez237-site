import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {climbingStoneGeometry} from '../lib/ClimbingStone';
import {Surface} from '../lib/Surface';

test('the climbing stone is closed and offers a continuous, upright contact surface',()=>{
  const geometry=climbingStoneGeometry(),index=geometry.index!,p=geometry.attributes.position,edges=new Map<string,number>();
  let volume=0;
  for(let i=0;i<index.count;i+=3){
    const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];
    for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3],key=`${Math.min(a,b)}:${Math.max(a,b)}`;edges.set(key,(edges.get(key)??0)+1);}
    const [a,b,c]=ids.map(id=>new THREE.Vector3().fromBufferAttribute(p,id));volume+=a.dot(b.cross(c))/6;
  }
  assert.ok([...edges.values()].every(n=>n===2),'every mesh edge belongs to two faces');
  assert.ok(volume>0,'faces enclose a positive outward-oriented volume');
  const surface=new Surface(new THREE.Mesh(),[{mesh:new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})),kind:1}]);
  let previous=Infinity;
  for(let i=0;i<=64;i++){
    const u=i/64,x=-.40+.475*u,z=.055+.175*u,s=surface.cast(x,z,.5,{y:0,normal:new THREE.Vector3()});
    assert.ok(s.normal.y>.78,'the walking lane never becomes a wall');
    if(i)assert.ok(Math.abs(previous-s.y)<.006,'no abrupt ledge between neighbouring contacts');
    previous=s.y;
  }
});
