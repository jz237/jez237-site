// Independent numeric reconstruction of the source's pre-steering corrections.
// Positions and thresholds are in original native units. The caller owns all
// history and selectors. These leaves do not move a craft or choose a route.
const F=Math.fround;
// [open minX,maxX,minZ,maxZ, directionX,directionZ, optional lap<, optional y<]
// Keep source order: later overlapping regions replace the earlier direction.
const NORMAL=[
 [
  [350,400,-1920,-750,0,1],
  [3286,3341,3138,3300,0,1],
  [3193,3336,2996,3138,.7071,.7071],
  [3059,3193,2996,3065,-1,0],
  [2952,3059,3015,3188,-.420461,.90731],
  [2952,3063,3188,3366,.32419,.94599],
  [3482,3575,4224,4795,.075,.99717647],
  [3385,3532,3929,4224,.31236,.9499635],
  [3242,3435,3722,3929,.6733756,.7393],
  [2987,3176,3799,4538,0,-1],
  [2987,3265,4538,5081,0,1],
  [3126,3242,3722,3799,1,0],
  [214,350,5350,5450,-.8688642,.49505],
  [96,214,5399,5453,-1,0],
  [-14,96,5352,5453,-.90723383,-.4206266],
  [-153,-14,5254,5352,-.6722967,-.74028176]
 ],
 [],
 [
  [-1775,-1575,-4800,-4110,0,-1],
  [-1875,-1775,-4800,-4750,-1,0],
  [2200,3379,3912,4120,1,0]
 ],
 [
  [-4245,-2945,-2600,-2240,-1,0],
  [-2995,-2795,-4270,-2540,0,-1],
  [800,875,385,936,1,0,2],
  [855,905,1085,1300,.7071,-.7071],
  [874,925,935,1085,0,-1],
  [855,905,-100,236,.7071,.7071],
  [874,925,236,386,0,1]
 ],
 [
  [3507,3750,-3000,-2018,.19284838,-.9812286],
  [3578,3750,-3486,-3000,-.24394682,-.9697886]
 ],
 [
  [-1150,-950,-4850,-4750,-.1,0],
  [-1150,-1000,-4750,-4650,-.7071,.7071],
  [-1150,-950,-4350,-4250,-.1,0],
  [-1150,-1000,-4450,-4250,-.7071,-.7071],
  [150,500,-1450,-1300,.9912279,-.13216372],
  [4100,4500,-3950,-3850,-1,0],
  [3400,3800,-2450,-2350,1,0],
  [4100,4500,-950,-850,-1,0],
  [-2860,-1850,4000,6050,0,1],
  [-2940,-2860,6000,6050,-1,0]
 ],
 [
  [150,250,-2570,-1246,0,1],
  [-700,500,-1050,-1000,-1,0],
  [300,600,600,700,-1,0],
  [-600,-300,600,700,1,0],
  [350,1300,4400,4450,1,0],
  [1950,2650,0,650,-.7071,-.7071],
  [1950,2000,-200,0,0,-1],
  [1500,2100,-8500,-7500,0,-1,null,80],
  [850,950,-9000,-8200,0,1,null,80],
  [4746,5220,-7850,-7500,-1,0],
  [1846,2320,-7850,-7500,-1,0]
 ],
 [
  [-2346,1757,-1151,469,-.93386465,-.3576266],
  [-2534,-2346,-1220,-1101,-.8449545,-.5348382],
  [450,500,-5150,-4300,0,1],
  [370,500,-4300,-4200,-.624695,.7808688],
  [300,500,-5450,-5150,0,-1],
  [-2600,-2400,1340,1460,1,0],
  [-2000,-1800,1340,1460,-1,0],
  [-2200,-2000,1940,2060,1,0],
  [-1600,-1400,1940,2060,-1,0],
  [-828,-616,3496,3546,-1,0],
  [-616,-231,3496,3881,.7071,.7071],
  [1450,2350,4800,5100,-1,0],
  [-500,1500,4850,5100,-1,0,2],
  [-580,-500,4850,4950,0,-1],
  [-980,-480,4500,4850,-1,0],
  [2350,2400,2000,4950,0,1]
 ],
 []
];
const REVERSE=[
 [],[],
 [
  [1900,3425,3620,3822,1,0],
  [3375,3425,3822,3913,0,1],
  [-3762,-3687,-2183,-2133,1,0],
  [-2075,-1875,-4800,-2800,0,-1]
 ],
 [
  [-2995,-2795,1200,2820,0,1],
  [-2795,-2695,2720,2820,1,0],
  [-4245,-2945,-2640,-2240,-1,0]
 ],
 [],
 [
  [-3950,-2940,4000,6050,0,1],
  [-2940,-2860,6000,6050,1,0],
  [-2400,-1800,5800,6050,-1,0],
  [-1100,1250,1400,1550,-1,0],
  [-150,751,-1856,-1700,-1,0]
 ],
 [
  [550,600,-9000,-8200,0,1],
  [1350,1400,-8400,-7500,0,-1],
  [2150,2550,1996,2046,1,0]
 ],
 [
  [-2600,-2400,1340,1460,1,0],
  [-2000,-1800,1340,1460,-1,0],
  [-2200,-2000,1940,2060,1,0],
  [-1600,-1400,1940,2060,-1,0],
  [-564,-290,3813,4500,1,0],
  [1500,2350,4900,5100,-1,0],
  [-500,1500,4900,5100,-1,0,2],
  [-580,-500,5050,5150,0,1],
  [-980,-580,4800,5200,-1,0],
  [75,125,-5150,-4300,0,1],
  [75,200,-4300,-4200,.624695,.7808688],
  [75,275,-5450,-5150,0,-1],
  [708,971,-5542,-5329,-.77710003,-.629368]
 ],
 [
  [-3015,-2531,5028,5944,0,1],
  [2826,3108,-3364,-2973,.58496,-.811],
  [3044,3108,-3650,-3364,0,-1],
  [-12,1500,-5510,-4409,-.808389,.58864844],
  [-3477,-2600,-4140,-3924,-1,0],
  [-3636,-2960,-4504,-4224,1,0],
  [-3936,-3636,-4504,-4254,-1,0],
  [0,1000,2700,2750,1,0]
 ]
];

function scalar(v,name){
 if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${name} must be finite native float32`);
 return F(v);
}
function integer(v,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} is outside its native integer range`);
 return v||0;
}
function xz(v,name){
 if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`${name} requires x and z`);
 return {x:scalar(v.x,`${name}.x`),z:scalar(v.z,`${name}.z`)};
}
function frozen(v){return Object.freeze(v);}
function direction(v){return frozen(v);}
function finiteResult(...values){if(!values.every(Number.isFinite))throw new RangeError('Native AI correction arithmetic overflow');}
function normalizeReciprocal(v){
 const squared=F(F(v.z*v.z)+F(v.x*v.x));finiteResult(squared);
 if(squared===0)return v;
 const gain=F(1/F(Math.sqrt(squared))),x=F(v.x*gain),z=F(v.z*gain);finiteResult(gain,x,z);return {x,z};
}

/** Timed venue-region escape. A matching region increments the retained signed
 * counter; any gap resets it. Only new count>40 replaces direction. Point and
 * distance stay owned by the previous aim producer, with no renormalization.
 * sourceLap is the original numeric2938 field, not a browser lap label.
 */
export function prepareNativeAICourseEscape({courseIndex,reverse,positionNative,sourceLap,
 courseEscapeFrames,targetDirectionXZ}={}){
 integer(courseIndex,'courseIndex',0,8);integer(sourceLap,'sourceLap');integer(courseEscapeFrames,'courseEscapeFrames');
 if(typeof reverse!=='boolean')throw new TypeError('reverse must select the native source branch explicitly');
 const p=xz(positionNative,'positionNative'),y=scalar(positionNative.y,'positionNative.y');
 let selected=null;
 const incoming=xz(targetDirectionXZ,'targetDirectionXZ');
 for(const r of(reverse?REVERSE:NORMAL)[courseIndex]){
  if(p.x>r[0]&&p.x<r[1]&&p.z>r[2]&&p.z<r[3]&&(r[6]==null||sourceLap<r[6])&&(r[7]==null||y<r[7]))
   selected={x:F(r[4]),z:F(r[5])};
 }
 const count=selected?(courseEscapeFrames+1)|0:0,applied=count>40;
 return frozen({courseEscapeFrames:count,courseEscapeActive:selected!==null,courseEscapeApplied:applied,
  targetDirectionXZ:direction(applied?selected:incoming)});
}

/** Sustained dry floor contact escapes only outside native course4/6/8. The
 * original normal is normalized with a rounded reciprocal, after count>30.
 */
export function prepareNativeAIFloorEscape({courseIndex,dryFloorFrames,floorImpactNative,wetCount,
 impactNormalXZ,targetDirectionXZ}={}){
 integer(courseIndex,'courseIndex',0,8);integer(dryFloorFrames,'dryFloorFrames');integer(wetCount,'wetCount',0,8);
 const impact=scalar(floorImpactNative,'floorImpactNative'),normal=xz(impactNormalXZ,'impactNormalXZ');
 const incoming=xz(targetDirectionXZ,'targetDirectionXZ');
 const count=courseIndex===4||courseIndex===6||courseIndex===8||impact===0||wetCount!==0?0:(dryFloorFrames+1)|0;
 const applied=count>30&&(normal.x!==0||normal.z!==0);
 return frozen({dryFloorFrames:count,floorEscapeApplied:applied,
  targetDirectionXZ:direction(applied?normalizeReciprocal(normal):incoming)});
}

/** Selected primary human avoidance. Source difficulty2 bypasses it; otherwise
 * only a strict direction dot>DOUBLE.995 qualifies. There is no distance gate.
 * Body right is unnormalized. Recomputed point-to-point direction uses division,
 * unlike the reciprocal normalizer above. An explicit origin preserves source
 * target-segment ownership through any intervening direction-only override.
 */
export function prepareNativeAIPlayerAvoidance({difficulty,positionNativeXZ,primaryHumanPositionNativeXZ,
 rightXZ,originNativeXZ,targetNativeXZ,targetDirectionXZ,targetDistanceNative}={}){
 integer(difficulty,'difficulty');
 const p=xz(positionNativeXZ,'positionNativeXZ'),human=xz(primaryHumanPositionNativeXZ,'primaryHumanPositionNativeXZ');
 const right=xz(rightXZ,'rightXZ'),origin=xz(originNativeXZ,'originNativeXZ'),target=xz(targetNativeXZ,'targetNativeXZ');
 const incoming=xz(targetDirectionXZ,'targetDirectionXZ'),distance=scalar(targetDistanceNative,'targetDistanceNative');
 if(distance<0)throw new RangeError('targetDistanceNative must be nonnegative');
 if(difficulty===2)return frozen({avoidanceApplied:false,originNativeXZ:direction(origin),targetNativeXZ:direction(target),
  targetDirectionXZ:direction(incoming),targetDistanceNative:distance});
 const delta={x:F(human.x-p.x),z:F(human.z-p.z)};finiteResult(delta.x,delta.z);
 const toHuman=normalizeReciprocal(delta);
 const dot=F(F(incoming.x*toHuman.x)+F(incoming.z*toHuman.z));finiteResult(dot);
 const applied=dot>.995;
 if(!applied)return frozen({avoidanceApplied:false,originNativeXZ:direction(origin),targetNativeXZ:direction(target),
  targetDirectionXZ:direction(incoming),targetDistanceNative:distance});
 const lateral=F(F(right.x*toHuman.x)+F(right.z*toHuman.z));finiteResult(lateral);
 const side=lateral>0?-1:1;
 const next={x:F(human.x+side*F(right.x*60)),z:F(human.z+side*F(right.z*60))};
 const dx=F(next.x-origin.x),dz=F(next.z-origin.z),squared=F(F(dx*dx)+F(dz*dz));
 finiteResult(next.x,next.z,dx,dz,squared);
 const length=squared===0?0:F(Math.sqrt(squared));
 const result=length===0?{x:dx,z:dz}:{x:F(dx/length),z:F(dz/length)};
 finiteResult(length,result.x,result.z);
 return frozen({avoidanceApplied:true,originNativeXZ:direction(origin),targetNativeXZ:direction(next),
  targetDirectionXZ:direction(result),targetDistanceNative:length});
}

/** Source order before bounded steering: course, dry-floor, selected player.
 * Direction-only escapes retain the segment's original target and length. A
 * later player correction may replace that point and recompute from its origin.
 */
export function prepareNativeAICorrections({targetSegment,courseIndex,reverse,positionNative,sourceLap,
 courseEscapeFrames,dryFloorFrames,floorImpactNative,wetCount,impactNormalXZ,difficulty,
 primaryHumanPositionNativeXZ,rightXZ}={}){
 if(!targetSegment||typeof targetSegment!=='object')throw new TypeError('An explicit source targetSegment is required');
 const course=prepareNativeAICourseEscape({courseIndex,reverse,positionNative,sourceLap,courseEscapeFrames,
  targetDirectionXZ:targetSegment.directionXZ});
 const floor=prepareNativeAIFloorEscape({courseIndex,dryFloorFrames,floorImpactNative,wetCount,impactNormalXZ,
  targetDirectionXZ:course.targetDirectionXZ});
 const player=prepareNativeAIPlayerAvoidance({difficulty,positionNativeXZ:positionNative,primaryHumanPositionNativeXZ,
  rightXZ,originNativeXZ:targetSegment.originNativeXZ,targetNativeXZ:targetSegment.targetNativeXZ,
  targetDirectionXZ:floor.targetDirectionXZ,targetDistanceNative:targetSegment.distanceNative});
 return frozen({courseEscapeFrames:course.courseEscapeFrames,courseEscapeActive:course.courseEscapeActive,
  courseEscapeApplied:course.courseEscapeApplied,dryFloorFrames:floor.dryFloorFrames,
  floorEscapeApplied:floor.floorEscapeApplied,avoidanceApplied:player.avoidanceApplied,
  targetSegment:frozen({originNativeXZ:player.originNativeXZ,targetNativeXZ:player.targetNativeXZ,
   directionXZ:player.targetDirectionXZ,distanceNative:player.targetDistanceNative})});
}
