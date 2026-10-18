import {clippedVolume} from './clipped-volumes.js';
import {surfaceMeshPositions} from './faceted-surfaces.js';
const keys=['x','y','z'],ri=a=>(a-0x1f94)/4;
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function scalar(v){if(!Number.isFinite(v)||Math.abs(v)>1e9)throw new RangeError('Invalid Stunt display scalar');return v;}
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid Stunt display index');return v;}
function vector(v){if(!Array.isArray(v)||v.length!==3)throw new TypeError('Expected Stunt display vector');return v.map(scalar);}
function flag(v){if(typeof v!=='boolean')throw new TypeError('Expected Stunt display flag');return v;}
function matrix(v){
 if(!Array.isArray(v)||v.length!==16)throw new TypeError('Expected Stunt display matrix');
 const m=v.map(scalar);
 if(m[3]!==0||m[7]!==0||m[11]!==0||m[15]!==1)throw new RangeError('Expected affine Stunt display matrix');
 return m;
}
function name(v){if(typeof v!=='string'||!v.length||v.length>160)throw new TypeError('Invalid Stunt volume id');return v;}
// The class3 draw branch in6D494 holds a collected ring through age8, then
// multiplies its object matrix by a uniform scale until age16 hides it.
// The age comes from6A748, never from render time. Three handles live camera
// frustum culling; cameraVisibility is exposed for independent source checks.
export function nativeStuntRingAppearance({renderClass,age,collected,cameraVisibility=0}){
 integer(renderClass,-2147483648,2147483647);integer(age,-2147483648,2147483647);
 integer(collected,-2147483648,2147483647);integer(cameraVisibility,-32768,32767);
 const visible=cameraVisibility>=0&&renderClass===3&&age<16;
 return {visible,scale:visible&&collected!==0&&age>8?1-(age-8)*.125:1};
}
export function captureNativeStuntWorld(value){
 if(value===null)return null;
 if(!value||value.version!==1||!Array.isArray(value.rings)||value.rings.length>64||!Array.isArray(value.volumes)||value.volumes.length>32)
  throw new TypeError('Invalid Stunt world presentation');
 const rings=value.rings.map(r=>({index:integer(r.index,0,63),sourceIndex:integer(r.sourceIndex,0,63),position:vector(r.position),
  heading:scalar(r.heading),visible:flag(r.visible),collected:flag(r.collected),
  ...(r.matrix===undefined?{}:{matrix:matrix(r.matrix)}),
  ...(r.scale===undefined?{}:{scale:scalar(r.scale)})}));
 const volumes=value.volumes.map(v=>({id:name(v.id),sourceIndex:integer(v.sourceIndex,0,63),planeIndex:integer(v.planeIndex,0,31),
  origin:vector(v.origin),axes:Array.isArray(v.axes)&&v.axes.length===3?v.axes.map(vector):(()=>{throw new TypeError('Expected Stunt display axes');})(),spans:vector(v.spans),visible:flag(v.visible)}));
 if(new Set(rings.map(r=>r.index)).size!==rings.length||new Set(rings.map(r=>r.sourceIndex)).size!==rings.length||new Set(volumes.map(v=>v.id)).size!==volumes.length)
  throw new RangeError('Duplicate Stunt presentation identity');
 if(volumes.some(v=>v.spans.some(s=>s<=0)))throw new RangeError('Invalid Stunt display span');
 if(rings.some(r=>r.scale!==undefined&&(r.scale<=0||r.scale>1)))throw new RangeError('Invalid Stunt ring scale');
 return {version:1,rings,volumes};
}
// These independently tessellated wooden surfaces follow the same finite
// planes as contact. The renderer retains its detailed materials and mesh count.
export function nativeStuntVolumePositions(volume){return surfaceMeshPositions(clippedVolume(volume).triangles);}

/** Bind authored high-resolution rings/ramp surfaces to selected source rows.
 * Matching occurs once at initialization; snapshots contain no callable owner,
 * writable source words, timers or rule execution. No display read awards points.
 */
export function createNativeStuntPresentation({course,readState,scale=.025}){
 if(typeof readState!=='function'||!Number.isFinite(scale)||scale<=0)throw new TypeError('Expected selected Stunt display owner');
 const initial=readState(),raw=initial.objectWordsC940,courseIndex=initial.scene.courseIndex,d=new DataView(new ArrayBuffer(4));
 if(initial.scene.mode620!==11||course.sourceWaterCourseIndex!==courseIndex)throw new RangeError('Stunt display requires its selected mode11 course');
 const float=w=>{d.setUint32(0,w);return scalar(d.getFloat32(0));};
 const position=(a,row)=>keys.map((_,j)=>float(a[row*49+j])*scale);
 const rows=Array.from({length:initial.scene.objectCountFa40},(_,i)=>i),rings=[],volumes=[],used=new Set();
 for(const [index,ring]of course.rings.entries()){
  // Alternative paths can share an ordinal (Twilight3/4/5). Match the center
  // as well, while keeping one mesh per source row rather than per score slot.
  const row=rows.find(i=>!used.has(i)&&raw[i*49+19]===8&&raw[i*49+48]===(ring.order??index)&&
   keys.every((k,j)=>Math.abs(position(raw,i)[j]-ring[k])<=1e-5));
  if(row===undefined)throw new RangeError('Authored ring must match selected source ordinal and center');
  used.add(row);rings.push({index,sourceIndex:row});
 }
 if(used.size!==rows.filter(i=>raw[i*49+19]===8).length)throw new RangeError('Every source Stunt ring needs its high-resolution mesh');
 const ramps=rows.filter(i=>raw[i*49+19]===1),matchedRamps=new Set();
 for(const ramp of course.ramps){
  const row=ramps.find(i=>!matchedRamps.has(i)&&keys.every((k,j)=>Math.abs(position(raw,i)[j]-(ramp[k]??0))<1e-5));
  if(row===undefined||!ramp.sourceVolumeProfile)throw new RangeError('Native Stunt ramp needs selected finite source surfaces');
  matchedRamps.add(row);const start=raw[row*49+25]|0,count=raw[row*49+26]|0;
  const surfaces=course.contactVolumes?.volumes.filter(v=>v.rampId===ramp.id)??[];
  if(surfaces.length!==count||start<0||start+count>initial.scene.collisionPlaneCount0578)throw new RangeError('Ramp surfaces must cover its original collision plane range');
  surfaces.forEach((v,i)=>volumes.push({id:v.id,sourceIndex:row,planeIndex:start+i}));
 }
 if(matchedRamps.size!==ramps.length)throw new RangeError('Every source Stunt ramp needs its high-resolution surfaces');
 const layout=freeze({version:1,courseIndex,rings,volumes});
 function snapshot(){
  const s=readState(),a=s.objectWordsC940,w=s.raceWords1f94;
  if(s.scene.mode620!==11||s.scene.courseIndex!==courseIndex)throw new RangeError('Stunt display selection changed');
  const world=captureNativeStuntWorld({version:1,rings:rings.map(r=>{
   const b=r.sourceIndex*49,collected=a[b+47]!==0;
   if(a[b+19]!==8)throw new RangeError('Stunt ring source row changed');
   // Use the actual EE6F4 matrix refreshed by6E0F4: its ordinal-dependent
   // spin is already part of the simulation. Only translation changes units;
   // the high-resolution torus already has its world-space radius.
   const transform=a.slice(b+29,b+45).map(float);for(let j=12;j<15;j++)transform[j]*=scale;
   const appearance=nativeStuntRingAppearance({renderClass:a[b+21]|0,age:a[b+27]|0,collected:a[b+47]|0});
   return {...r,position:position(a,r.sourceIndex),heading:Math.atan2(float(a[b+12]),float(a[b+13])),matrix:transform,collected,...appearance};
  }),volumes:volumes.map(v=>{
   const p=s.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(float);
   return {...v,origin:p.slice(0,3).map(n=>n*scale),axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:p.slice(12,15).map(n=>n*scale),visible:a[v.sourceIndex*49+21]!==0};
  })});
  const word=a=>w[ri(a)]|0,complete=word(0x2c2c)!==0;
  const completedTricks=Object.fromEntries(Object.entries({handstand:0x39e8,backwards:0x39ec,stand:0x39f0,somersault:0x39f4,dive:0x39f8,negativeRoll:0x39fc,positiveRoll:0x3a00,flip:0x3a04}).map(([k,a])=>[k,word(a)!==0]));
  const hud={native:true,score:word(0x26d0),rings:word(0x292c),chain:s.scene.ringStreak0cb4,
   nextCheckpoint:complete?4:Math.max(0,word(0x2a9c)-1),remaining:word(0x2bfc)/1000,complete,
   ringStatus:world.rings.map(r=>r.collected?'hit':null),completedTricks,pending:word(0x26e4),delayedBonus:word(0x39cc),
   // Native anatomy comes from nativeRiderPose; modern shortcut animation is idle.
   trick:null,angle:0,pose:null,poseTime:0,airDuration:0,event:'',eventId:0,crashes:0,tricks:Object.values(completedTricks).filter(Boolean).length};
  return freeze({world,hud});
 }
 return Object.freeze({layout,snapshot});
}
