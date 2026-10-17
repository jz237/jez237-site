import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {ROOKVALE,ROOKVALE_LANES} from '../src/rookvale-course';import {addRookvaleGroundDetail,rookvaleGroundDistance} from '../src/rookvale-ground';import {courseSurfaceMask,COURSE_MASK_SIZE} from '../src/course-materials';
test('Rookvale photo masks cover perimeter and all cross-yard lanes with the actual surface classification',()=>{
 const mask=courseSurfaceMask({...ROOKVALE,distance:rookvaleGroundDistance}),[w,h]=COURSE_MASK_SIZE;
 const pixel=(x:number,z:number)=>{const col=Math.floor((x/ROOKVALE.terrain.spanX+.5)*w),row=Math.floor((.5-z/ROOKVALE.terrain.spanZ)*h);return mask.slice((row*w+col)*4,(row*w+col)*4+4);};
 for(const lane of ROOKVALE_LANES)for(const t of [.15,.35,.5,.65,.85]){const [a,b]=lane.points,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,p=pixel(x,z);assert.equal(p[0],255,'yard lane uses asphalt photograph');assert.equal(p[1],255,'yard lane receives road detail');}
 assert.equal(pixel(0,108)[0],0,'north perimeter remains gravel');assert.equal(pixel(0,108)[1],255);assert.equal(pixel(0,-108)[0],255);assert.equal(pixel(-200,150)[1],0,'unused yard stays soil');
 for(const lane of ROOKVALE_LANES){const [a,b]=lane.points;assert.ok(rookvaleGroundDistance((a.x+b.x)/2,(a.z+b.z)/2)<=12-lane.width/2+.00001);}
});
test('Rookvale detail owns and releases maps and restores material hooks',()=>{
 const material=new T.MeshStandardMaterial(),compile=material.onBeforeCompile,key=material.customProgramCacheKey;const detail=addRookvaleGroundDetail(material);assert.ok(material.normalMap);let disposed=0;detail.textures.forEach(t=>t.addEventListener('dispose',()=>disposed++));assert.ok(detail.textures.length>=7);detail.dispose();detail.dispose();assert.equal(disposed,detail.textures.length);assert.equal(material.normalMap,null);assert.equal(material.onBeforeCompile,compile);assert.equal(material.customProgramCacheKey,key);material.dispose();
});
