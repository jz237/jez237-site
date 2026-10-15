// Numeric source water selection, independent of the high-resolution renderer.
// ALL positions, velocities and heights here use NATIVE units. One call describes
// one native outer frame, after its five hull ticks; this is not a global 100Hz
// ocean update. The host owns cadence, phase history, RNG and water storage.
//
// Source ordering: hull ticks -> forcing using OLD camera/patch -> camera update
// -> P2 patch -> P1 patch. Overlap evolves twice. Patch centers must subsequently
// be snapped by createNativeWaterPatch; those SNAPPED centers feed the next frame.
//
// The ordinary virtual follow branch below excludes obstacle corrections and
// scripted/replay/stunt scene cameras. Use nativeWaterCameraBasis on an explicitly
// selected/corrected source camera for those paths. Never substitute the modern
// presentation camera without recording that as an approximation.
// Sine/acos samples are regenerated; optional lookups allow numeric diagnostics.
// Original tables, executable code, meshes and textures are not included.

import { nativeWaterFieldParameters } from './native-water-field.js';

const F=Math.fround;
const frozen=Object.freeze;
const followStates=new WeakSet();
const PROFILES=frozen([
  frozen({fovDegrees:72,radiusNative:200,pitchDegrees:23,liftNative:0}),
  frozen({fovDegrees:75,radiusNative:140,pitchDegrees:23,liftNative:0}),
  frozen({fovDegrees:90,radiusNative:90,pitchDegrees:23,liftNative:12}),
  frozen({fovDegrees:90,radiusNative:80,pitchDegrees:30,liftNative:62}),
]);
const vector=value=>frozen(value);
function finite(value,name){
  if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);
  if(Math.abs(value)>1e9)throw new RangeError(`${name} exceeds the supported native range`);
  return F(value);
}
function integer(value,name,min,max){
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}
function tuple(value,length,name){
  if(!Array.isArray(value)||value.length!==length)throw new TypeError(`${name} must contain ${length} values`);
  return value.map((x,i)=>finite(x,`${name}[${i}]`));
}
function positive(value,name){
  const x=finite(value,name);if(x<=0)throw new RangeError(`${name} must be positive`);return x;
}
function response(value,name){
  const x=finite(value,name);if(x<0||x>1)throw new RangeError(`${name} must be between 0 and 1`);return x;
}
function radiusValue(radius){
  integer(radius,'radius',2,16);if(radius%2)throw new RangeError('radius must be even');return radius;
}
const square=x=>F(x*x);
const dot3=(a,b)=>F(F(F(a[0]*b[0])+F(a[1]*b[1]))+F(a[2]*b[2]));
const lerp=(a,b,t)=>F(a+F(F(b-a)*t));
const length2=(x,z)=>F(Math.sqrt(F(square(x)+square(z))));
function normalize3(v,name){
  const n=F(Math.sqrt(dot3(v,v)));
  if(!(n>0))throw new RangeError(`${name} must have a nonzero length`);
  return v.map(x=>F(x/n));
}
function sine(index,lookup){
  const i=index&4095;
  return finite(lookup?lookup(i):Math.sin(i*Math.PI*2/4096),'sine lookup value');
}
function angleIndex(degrees){return Math.trunc(F(F(degrees*4096)/360));}
function bearingDegrees(x,z,acosLookup){
  // Source computes the angle from +X with a quantized512-entry acos lookup,
  // choosing the smaller component before the quadrant correction.
  const ax=Math.abs(x),az=Math.abs(z),n=length2(ax,az);
  if(!n)return 0;
  const small=Math.min(ax,az),index=Math.trunc(F(F(small/n)*511));
  const sample=finite(acosLookup?acosLookup(index):Math.acos(index/511)*180/Math.PI,'acos lookup value');
  let angle=ax<=az?sample:F(90-sample);
  if(x<0&&z>=0)angle=F(180-angle);
  else if(x<0&&z<0)angle=F(angle+180);
  else if(x>=0&&z<0)angle=F(360-angle);
  return angle;
}
function sealFollow(state){followStates.add(state);return frozen(state);}

/** Source camera zoom presets; these select water, not modern image resolution. */
export function nativeWaterFollowProfile(zoomIndex=1){
  return PROFILES[integer(zoomIndex,'zoomIndex',0,3)];
}

/** Numeric source camera-control selection, with an already chosen zoom index. */
export function nativeWaterCameraControl({zoomIndex=1,previousZoomIndex=zoomIndex,liftOffsetNative=0,
  sourcePoseState=0,sourcePoseTimer=0}={}){
  const profile=nativeWaterFollowProfile(zoomIndex);
  integer(previousZoomIndex,'previousZoomIndex',0,3);
  integer(sourcePoseState,'sourcePoseState',0,255);integer(sourcePoseTimer,'sourcePoseTimer',0,0x7fffffff);
  const oldLift=finite(liftOffsetNative,'liftOffsetNative');
  const changed=zoomIndex!==previousZoomIndex;
  const zoomResponse=F(Math.abs(zoomIndex-previousZoomIndex)===3?.3:.2);
  let liftResponse=changed?zoomResponse:F(.07),liftTargetNative=profile.liftNative;
  if(sourcePoseState===23||sourcePoseState===24){liftResponse=F(.15);liftTargetNative=zoomIndex<2?0:10;}
  else if(sourcePoseState===25)liftTargetNative=zoomIndex<2?0:10;
  else if(sourcePoseState===7&&sourcePoseTimer<56)liftTargetNative=0;
  return frozen({...profile,zoomResponse,liftResponse,liftTargetNative,
    liftOffsetNative:lerp(oldLift,liftTargetNative,liftResponse)});
}

/** Native camera basis producer, including up-vector orthogonalization. */
export function nativeWaterCameraBasis({eyeNative,targetNative,up=[0,1,0],
  fovDegrees=75,nearNative=10,projectionOffset=[0,3]}={}){
  const eye=tuple(eyeNative,3,'eyeNative'),target=tuple(targetNative,3,'targetNative');
  const initialUp=tuple(up,3,'up'),forward=normalize3(target.map((x,i)=>F(x-eye[i])),'view direction');
  const horizontalLength=length2(forward[0],forward[2]);
  if(!horizontalLength)throw new RangeError('Source water selection requires a horizontal view direction');
  const projection=F(-dot3(forward,initialUp)/dot3(forward,forward));
  const normalizedUp=normalize3(initialUp.map((x,i)=>F(x+F(forward[i]*projection))),'orthogonal up');
  const fov=positive(fovDegrees,'fovDegrees');
  if(fov>=180)throw new RangeError('fovDegrees must be less than180');
  return frozen({eyeNative:vector(eye),targetNative:vector(target),forward:vector(forward),
    up:vector(normalizedUp),horizontalForward:vector([F(forward[0]/horizontalLength),F(forward[2]/horizontalLength)]),
    fovDegrees:fov,nearNative:positive(nearNative,'nearNative'),
    projectionOffset:vector(tuple(projectionOffset,2,'projectionOffset'))});
}

/** Ordinary type5 source follow initialization; no field or phase is reset. */
export function createNativeWaterFollowCamera({positionNative,forwardXZ,zoomIndex=1,datumNative=0}={}){
  const p=tuple(positionNative,3,'positionNative'),forward=tuple(forwardXZ,2,'forwardXZ');
  if(!length2(...forward))throw new RangeError('forwardXZ must be nonzero');
  const profile=nativeWaterFollowProfile(zoomIndex);
  const datum=finite(datumNative,'datumNative');
  return sealFollow({zoomIndex,lagXZ:vector([F(p[0]-F(forward[0]*100)),F(p[2]-F(forward[1]*100))]),
    radiusNative:profile.radiusNative,pitchDegrees:profile.pitchDegrees,fovDegrees:profile.fovDegrees,
    liftOffsetNative:profile.liftNative,datumNative:datum});
}

/**
 * One ordinary follow frame. velocityXZ is native displacement over the outer
 * 50ms frame (body+b78/b80), not per-hull-tick velocity or metres/second.
 * liftOffsetNative can inject the already-selected +FC camera
 * lift for pose/camera-input diagnostics. Scripted cameras need an explicit basis.
 * Returns a new immutable state; keeping an old state cannot alter later frames.
 */
export function stepNativeWaterFollowCamera(state,{positionNative,forwardXZ,velocityXZ,
  datumNative=state?.datumNative,zoomIndex=state?.zoomIndex,zoomResponse,liftResponse,liftTargetNative,
  liftOffsetNative,sourcePoseState=0,sourcePoseTimer=0,tilt=false,sineLookup,acosLookup}={}){
  if(!followStates.has(state))throw new TypeError('Expected an ordinary native water follow state');
  const p=tuple(positionNative,3,'positionNative'),forward=tuple(forwardXZ,2,'forwardXZ');
  const velocity=tuple(velocityXZ,2,'velocityXZ'),datum=finite(datumNative,'datumNative');
  const profile=nativeWaterCameraControl({zoomIndex,previousZoomIndex:state.zoomIndex,
    liftOffsetNative:state.liftOffsetNative,sourcePoseState,sourcePoseTimer});
  const t=response(zoomResponse??profile.zoomResponse,'zoomResponse');
  const lt=response(liftResponse??profile.liftResponse,'liftResponse');
  const lift=liftOffsetNative===undefined?
    lerp(state.liftOffsetNative,finite(liftTargetNative??profile.liftTargetNative,'liftTargetNative'),lt):finite(liftOffsetNative,'liftOffsetNative');
  const anchor=[p[0],F(p[1]+lift),p[2]];
  const radius=lerp(state.radiusNative,profile.radiusNative,t),pitch=lerp(state.pitchDegrees,profile.pitchDegrees,t);
  const fov=lerp(state.fovDegrees,profile.fovDegrees,t);
  const dx=F(state.lagXZ[0]-anchor[0]),dz=F(state.lagXZ[1]-anchor[2]),distance=length2(dx,dz);
  if(!distance)throw new RangeError('Source follow lag coincides with the craft; reset the follow state explicitly');
  const lagRatio=F(77/distance),lag=vector([F(F(dx*lagRatio)+anchor[0]),F(F(dz*lagRatio)+anchor[2])]);
  const yaw=angleIndex(bearingDegrees(dx,dz,acosLookup)),pit=angleIndex(pitch);
  const eye=[F(F(sine(yaw+1024,sineLookup)*F(radius*sine(pit+1024,sineLookup)))+anchor[0]),
    F(F(sine(pit,sineLookup)*radius)+F(F(F(anchor[1]-datum)*.5)+datum)),
    F(F(sine(yaw,sineLookup)*F(radius*sine(pit+1024,sineLookup)))+anchor[2])];
  const speed=length2(...velocity),speedRatio=speed<40?F(speed/40):1;
  const cubic=F(F(F(F(-2*speedRatio)*speedRatio)*speedRatio)+F(F(3*speedRatio)*speedRatio));
  const desiredX=F(forward[0]*cubic),desiredZ=F(forward[1]*cubic);
  const projection=F(-F(F(dx*desiredX)+F(dz*desiredZ))/F(square(dz)+square(dx)));
  let turnX=F(F(F(dx*projection)+desiredX)*45),turnZ=F(F(F(dz*projection)+desiredZ)*45);
  const turnLength=length2(turnX,turnZ);
  if(turnLength>45){const k=F(45/turnLength);turnX=F(turnX*k);turnZ=F(turnZ*k);}
  let heightFactor;
  if(anchor[1]<=50)heightFactor=F(.7);
  else if(anchor[1]>=300)heightFactor=F(.9);
  else {const k=F(F(anchor[1]-50)/250);heightFactor=F(F(square(k)*F(F(.9)-F(.7)))+F(.7));}
  const target=[F(turnX+anchor[0]),F(F(F(anchor[1]-datum)*heightFactor)+datum),F(turnZ+anchor[2])];
  const up=tilt?[F(turnX*F(.15)),45,F(turnZ*F(.15))]:[0,1,0];
  const camera=nativeWaterCameraBasis({eyeNative:eye,targetNative:target,up,fovDegrees:fov});
  const next=sealFollow({zoomIndex,lagXZ:lag,radiusNative:radius,pitchDegrees:pitch,fovDegrees:fov,
    liftOffsetNative:lift,datumNative:datum});
  return frozen({state:next,camera});
}

/**
 * Source radial amplitude threshold from the SELECTED loaded primary markers and
 * boundary-family points. These are not arbitrary shore/model/camera bounds.
 * Callers must apply player/class/mode filtering before providing native XZ rows.
 */
export function nativeWaterAmplitudeThreshold({primaryPointsNative=[],boundaryPointsNative=[]}={}){
  let maximum=4096;
  for(const [rows,name,bound]of [[primaryPointsNative,'primaryPointsNative',64],[boundaryPointsNative,'boundaryPointsNative',256]]){
    if(!Array.isArray(rows)||rows.length>bound)throw new RangeError(`${name} exceeds the source row bound${bound}`);
    for(const [i,row]of rows.entries()){
      const [x,z]=tuple(row,2,`${name}[${i}]`);maximum=Math.max(maximum,Math.abs(x),Math.abs(z));
    }
  }
  return F(F(maximum*F(1.4142))+2048);
}

/** Source frustum-to-water selection; source projection aspect remains320/240. */
export function nativeWaterPatchCenter(camera,{radius,datumNative=0,amplitudeNative,sineLookup}={}){
  radiusValue(radius);
  const eye=tuple(camera?.eyeNative,3,'camera.eyeNative'),forward=tuple(camera?.forward,3,'camera.forward');
  const up=tuple(camera?.up,3,'camera.up'),horizontal=tuple(camera?.horizontalForward,2,'camera.horizontalForward');
  const offsets=tuple(camera?.projectionOffset,2,'camera.projectionOffset');
  const near=positive(camera?.nearNative,'camera.nearNative'),fov=positive(camera?.fovDegrees,'camera.fovDegrees');
  if(fov>=180)throw new RangeError('camera.fovDegrees must be less than180');
  const datum=integer(datumNative,'datumNative',-32768,32767);
  const amplitude=integer(amplitudeNative,'amplitudeNative',-32768,32767);
  const angle=F(F(fov/720)*4096),index=Math.trunc(F(angle+(angle>=0?.5:-.5)));
  const cosine=sine(index+1024,sineLookup);
  if(!cosine)throw new RangeError('Source camera half-angle has no finite projection');
  const halfHeight=F(F(near*sine(index,sineLookup))/cosine),halfWidth=F(F(halfHeight*320)/240);
  const right=[F(F(up[1]*forward[2])-F(up[2]*forward[1])),
    F(F(up[2]*forward[0])-F(up[0]*forward[2])),F(F(up[0]*forward[1])-F(up[1]*forward[0]))];
  const sides=[F(offsets[0]+halfWidth),F(offsets[0]-halfWidth)].map(k=>right.map(x=>F(k*x)));
  const base=forward.map(x=>F(near*x)),planeDelta=F(F(datum+amplitude)-eye[1]);
  let cap=F(F(F(near*2048)*F(1.732))/320);
  for(const vertical of [F(offsets[1]-halfHeight),F(offsets[1]+halfHeight)]){
    const ray=up.map((x,i)=>F(F(x*vertical)+base[i]));
    for(const side of sides){
      const y=F(ray[1]+side[1]);
      if(y< -5){
        const along=F(F(F(ray[0]+side[0])*horizontal[0])+F(F(ray[2]+side[2])*horizontal[1]));
        const candidate=F(F(planeDelta/y)*along);if(candidate<cap)cap=candidate;
      }
    }
  }
  const ahead=F(F(F(radius*64*F(.866))+cap)-32);
  return frozen({xNative:F(eye[0]+F(ahead*horizontal[0])),zNative:F(eye[2]+F(ahead*horizontal[1]))});
}

/** Force-line arguments, using BEFORE-update camera orientation and snapped centers. */
export function nativeWaterForcingPlan({players=1,radius,previousPatchCentersNative,camerasBeforeUpdate,
  craftPositionsNative,baseAmplitudeNative,period=20,amplitudeThresholdNative,
  positiveXLimitNative=24575,simulationActive=true}={}){
  integer(players,'players',1,2);radiusValue(radius);
  if(typeof simulationActive!=='boolean')throw new TypeError('simulationActive must be boolean');
  if(!simulationActive)return frozen([]);
  const base=integer(baseAmplitudeNative,'baseAmplitudeNative',-32768,32767);
  integer(period,'period',1,65535);
  for(const [list,name]of [[previousPatchCentersNative,'previousPatchCentersNative'],[camerasBeforeUpdate,'camerasBeforeUpdate'],[craftPositionsNative,'craftPositionsNative']]){
    if(!Array.isArray(list)||list.length!==players)throw new TypeError(`${name} must contain exactly${players} entries`);
  }
  const centers=previousPatchCentersNative.map((p,i)=>{
    if(!p||!Number.isInteger(p.xNative)||!Number.isInteger(p.zNative))throw new TypeError('Previous patch centers must be native snapped integers');
    const x=finite(p.xNative,`center${i}.xNative`),z=finite(p.zNative,`center${i}.zNative`);
    const h=tuple(camerasBeforeUpdate[i]?.horizontalForward,2,`camera${i}.horizontalForward`);
    return {xNative:F(x+F(radius*64*h[0])),zNative:F(z+F(radius*64*h[1]))};
  });
  const positions=craftPositionsNative.map((p,i)=>tuple(p,2,`craftPositionsNative[${i}]`));
  const calls=[];
  const append=(i,amplitude,advance)=>calls.push(frozen({...centers[i],radius,amplitudeNative:amplitude,period,advance,playerIndex:i}));
  if(players===1){
    const threshold=positive(amplitudeThresholdNative,'amplitudeThresholdNative');
    const limit=positive(positiveXLimitNative,'positiveXLimitNative');
    const radial=F(Math.trunc(length2(...positions[0])));let amplitude=base;
    if(radial>threshold){
      const end=Math.min(F(threshold+4000),limit);amplitude=60;
      if(radial<end)amplitude=Math.trunc(F(F(F(F(radial-threshold)*F(60-base))/F(end-threshold))+base));
    }
    append(0,amplitude,1);
  }else{
    const beyond=(i,other)=>{
      const dx=F(centers[i].xNative-positions[other][0]),dz=F(centers[i].zNative-positions[other][1]);
      return F((radius*64)**2)<F(square(dx)+square(dz));
    };
    const first=beyond(0,1);if(first)append(0,base,1);
    if(beyond(1,0))append(1,base,first?0:1);
  }
  return frozen(calls);
}

/**
 * Pure plan for one host outer frame. Apply forcing first, then create/snap and
 * evolve the ordered patches. Paused/inactive frames still select display patches
 * but evolve=false and produce no forcing. No phase or field is mutated here.
 * Variant1 has a separate random disturbance producer and is rejected explicitly.
 */
export function planNativeWaterFrame({variant=0,players=1,camerasAfterUpdate,datumNative=0,
  baseAmplitudeNative,simulationActive=true,sineLookup,...forcingOptions}={}){
  const parameters=nativeWaterFieldParameters({variant,players});
  if(variant===1)throw new RangeError('Variant1 special random disturbance scheduling is not reconstructed');
  if(!Array.isArray(camerasAfterUpdate)||camerasAfterUpdate.length!==players)throw new TypeError(`camerasAfterUpdate must contain exactly${players} entries`);
  const forcing=nativeWaterForcingPlan({...forcingOptions,players,radius:parameters.radius,
    baseAmplitudeNative,simulationActive});
  const patches=[];
  for(let i=players-1;i>=0;i--){
    const center=nativeWaterPatchCenter(camerasAfterUpdate[i],{radius:parameters.radius,datumNative,
      amplitudeNative:baseAmplitudeNative,sineLookup});
    patches.push(frozen({...center,radius:parameters.radius,playerIndex:i,evolve:simulationActive}));
  }
  return frozen({variant,players,parameters,forcing,patches:frozen(patches)});
}
