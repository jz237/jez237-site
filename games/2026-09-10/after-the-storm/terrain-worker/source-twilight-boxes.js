import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=4580da672e07';

// Independent numeric reconstruction of three-axis projection intervals.
// No original artwork or executable code is included. Scale remains conditional
// on the native HUD/clock calibration; live craft response is shared modern physics.
export const TWILIGHT_NATIVE_SCALE=.025;
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const TWILIGHT_NATIVE_BOXES=deepFreeze({"nativeCourseIndex":6,"scale":0.025,"fixed":[{"address":"0x800d7870","origin":[1637.0,67.0,-7400.0],"axes":[[0.7071070075035095,-0.7071070075035095,0.0],[0.6970779895782471,0.7169950008392334,0.0],[0.0,0.0,1.0]],"spans":[49.497474670410156,50.20956039428711,1000.0],"flag":0},{"address":"0x800d78b0","origin":[1600.0,100.0,-7400.0],"axes":[[1.0,0.0,0.0],[0.0,1.0,0.0],[0.0,0.0,1.0]],"spans":[200.0,200.0,1000.0],"flag":0},{"address":"0x800d78f0","origin":[400.0,72.0,-1032.0],"axes":[[0.0,-0.7071070075035095,-0.7071070075035095],[0.0,0.7071070075035095,-0.7071070075035095],[1.0,0.0,0.0]],"spans":[42.42640686035156,42.42640686035156,900.0],"flag":0},{"address":"0x800d7930","origin":[400.0,100.0,-1000.0],"axes":[[0.0,0.0,-1.0],[0.0,1.0,0.0],[1.0,0.0,0.0]],"spans":[100.0,120.0,900.0],"flag":0}],"rampProfiles":[{"address":"0x800d74f0","origin":[100.0,150.0,-305.0],"axes":[[1.0,0.0,0.0],[0.0,0.9408869743347168,0.3387190103530884],[0.0,0.3363359868526459,-0.9417420029640198]],"spans":[200.0,266.0,743.0],"flag":1},{"address":"0x800d7530","origin":[200.0,-350.0,305.0],"axes":[[0.0,-0.9408869743347168,-0.3387190103530884],[1.0,0.0,0.0],[0.0,-0.3363359868526459,0.9417420029640198]],"spans":[266.0,400.0,743.0],"flag":1}]});

export function twilightRampProfile(variant,nativeClass){
 if(!Number.isInteger(variant)||variant<0||variant>3)throw new RangeError('Invalid Twilight ramp variant');
 if(!Number.isInteger(nativeClass)||nativeClass<0||nativeClass>2)throw new RangeError('Invalid native class');
 // The initializer selects the narrow profile for variant0, and for variant1
 // on native class2. Other retained variants use the wider reverse profile.
 return TWILIGHT_NATIVE_BOXES.rampProfiles[variant===0||variant===1&&nativeClass===2?0:1];
}

export function twilightFixedVolumes(){
 return TWILIGHT_NATIVE_BOXES.fixed.map((q,index)=>clippedVolume({
  id:'twilight-solid-'+index,kind:index<2?'quay':'crossbar',sourceRecordAddress:q.address,
  origin:q.origin.map(v=>v*TWILIGHT_NATIVE_SCALE),axes:q.axes,spans:q.spans.map(v=>v*TWILIGHT_NATIVE_SCALE),flag:q.flag
 }));
}

export function twilightRampVolumes(ramp){
 if(!ramp||![ramp.x,ramp.y??0,ramp.z,ramp.tx,ramp.tz].every(Number.isFinite)||Math.abs(Math.hypot(ramp.tx,ramp.tz)-1)>1e-6)throw new TypeError('Invalid Twilight ramp transform');
 const q=twilightRampProfile(ramp.sourceVariant,ramp.sourceNativeClass);
 // Native object yaw is authored heading+180. Transform each projection axis
 // and the origin; spans and flag are copied unchanged. These axes are not
 // assumed orthogonal; clippedVolume solves their exact intersection.
 const c=-ramp.tz,s=-ramp.tx,rotate=p=>[c*p[0]+s*p[2],p[1],-s*p[0]+c*p[2]];
 const origin=rotate(q.origin.map(v=>v*TWILIGHT_NATIVE_SCALE));
 origin[0]+=ramp.x;origin[1]+=ramp.y??0;origin[2]+=ramp.z;
 return [clippedVolume({id:ramp.id+'-solid',kind:'ramp',rampId:ramp.id,sourceRecordAddress:q.address,
  origin,axes:q.axes.map(rotate),spans:q.spans.map(v=>v*TWILIGHT_NATIVE_SCALE),flag:q.flag})];
}

export function twilightContactVolumes(ramps=[]){
 if(!Array.isArray(ramps))throw new TypeError('Ramps must be an array');
 return clippedVolumes([...twilightFixedVolumes(),...ramps.filter(q=>q.sourceCourseIndex===6&&q.sourceVolumeProfile).flatMap(twilightRampVolumes)]);
}
