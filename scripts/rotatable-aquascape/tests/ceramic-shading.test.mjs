import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {ceramicExposure} from '../../living-aquascape/lib/aquarium/CeramicShading.ts';
import {porousCeramic} from '../../living-aquascape/lib/aquarium/FilterMaterials.ts';

test('ceramic visibility darkens the recessed bore without darkening the exposed rim equally',()=>{
 const g=porousCeramic(),p=g.getAttribute('position'),ao=g.getAttribute('ceramicCavity');let bore=0,rim=0,nb=0,nr=0;
 for(let i=0;i<p.count;i++){const visibility=ao.getX(i);assert.ok(Number.isFinite(visibility)&&visibility>=.15&&visibility<=1);const r=Math.hypot(p.getX(i),p.getZ(i)),y=Math.abs(p.getY(i));if(r<.074&&y<.015){bore+=visibility;nb++;}if(r>.075&&r<.09&&y>.093){rim+=visibility;nr++;}}
 assert.ok(nb&&nr);assert.ok(bore/nb<rim/nr*.5);g.dispose();
});
test('nearby media occludes its facing side; isolated media remains fully exposed',()=>{
 const center=new T.Vector3(),rotation=new T.Quaternion();assert.deepEqual(ceramicExposure(center,rotation,[]).toArray(),[1,0,0,0]);
 const adjacent=new T.Vector3(.24,0,0),local=ceramicExposure(center,rotation,[adjacent]);assert.ok(local.x<1&&local.y<0);assert.ok(Math.abs(local.z)<1e-6&&Math.abs(local.w)<1e-6);
 const turned=ceramicExposure(center,new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),Math.PI),[adjacent]);assert.ok(turned.y>0);assert.ok(Math.abs(turned.x-local.x)<1e-6);
});
