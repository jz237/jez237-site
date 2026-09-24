import assert from 'node:assert/strict';
import * as T from 'three';
import {erodedRock} from '../ReefRock.ts';
import {rockMicroColonies} from '../RockMicroColonies.ts';
let seed=230924;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rock=erodedRock(2,1.4,-1,.8,.7,.6,random),original=rock.getAttribute('position').array.slice();
const result=rockMicroColonies([rock]),g=result.geometry,p=g.getAttribute('position');
assert.ok(result.stats.cups>30&&result.stats.cups<=90);
assert.deepEqual(rock.getAttribute('position').array,original,'colonization must preserve supporting rock');
for(const a of Object.values(g.attributes))assert.ok(a.array.every(Number.isFinite));
const source=rock.getAttribute('position'),idx=rock.index,triangle=new T.Triangle(),closest=new T.Vector3();let maxGap=0;
for(let cup=0;cup<result.attachments.length;cup++){
 const a=result.attachments[cup],axis=new T.Vector3(...a.normal),center=new T.Vector3(...a.center);
 assert.ok(a.radius<a.inradius,'root ring fits within its supporting face');
 for(let k=0;k<8;k++){
  const point=new T.Vector3().fromBufferAttribute(p,cup*33+k);let gap=Infinity;
  for(let j=0;j<idx.count;j+=3){triangle.a.fromBufferAttribute(source,idx.getX(j));triangle.b.fromBufferAttribute(source,idx.getX(j+1));triangle.c.fromBufferAttribute(source,idx.getX(j+2));triangle.closestPointToPoint(point,closest);gap=Math.min(gap,closest.distanceTo(point));}
  maxGap=Math.max(maxGap,gap);assert.ok(gap<.00151,'every root contacts real rock, including cavity shoulders');
 }
 const lip=new T.Vector3().fromBufferAttribute(p,cup*33+16),floor=new T.Vector3().fromBufferAttribute(p,cup*33+32);
 assert.ok(lip.sub(floor).dot(axis)>.002,'cup has a recessed opening');
 assert.ok(floor.sub(center).dot(axis)>0,'floor remains above the support');
}
assert.deepEqual(rockMicroColonies([rock]).geometry.getAttribute('position').array,p.array,'repeat builds preserve placements');
console.log('Attached microcolonies:',{...result.stats,maxGap});
