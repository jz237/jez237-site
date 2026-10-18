import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=1404a4f711f8';

// Independently reconstructed finite projection intervals, not original artwork.
// .025 metres/native is conditional on the shared HUD/clock calibration.
export const PORT_NATIVE_SCALE=.025;
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const PORT_NATIVE_BOXES=deepFreeze({"nativeCourseIndex":5,"scale":0.025,"profiles":{"0":[{"address":"0x800d73b0","origin":[-250.0,-24.0,-645.0],"axes":[[0.0,-0.8091040253639221,-0.5876650214195251],[0.0,0.590641975402832,-0.8069339990615845],[-1.0,0.0,0.0]],"spans":[117.4137954711914,120.2081527709961,500.0],"flag":1},{"address":"0x800d73f0","origin":[-250.0,71.0,-576.0],"axes":[[0.0,-0.1434289962053299,-0.9896609783172607],[0.0,0.9899489879608154,-0.14142100512981415],[-1.0,0.0,0.0]],"spans":[69.72087097167969,120.2081527709961,500.0],"flag":1},{"address":"0x800d7430","origin":[-250.0,-23.0,-567.0],"axes":[[0.0,-0.8717970252037048,-0.4898670017719269],[0.0,0.48634299635887146,-0.8737679719924927],[-1.0,0.0,0.0]],"spans":[120.44085693359375,121.31364440917969,500.0],"flag":1},{"address":"0x800d7470","origin":[-250.0,-75.0,-479.0],"axes":[[0.0,-0.970628023147583,-0.24058300256729126],[0.0,0.2383279949426651,-0.971185028553009],[-1.0,0.0,0.0]],"spans":[120.54045104980469,167.8362274169922,500.0],"flag":1},{"address":"0x800d74b0","origin":[-250.0,-182.0,386.0],"axes":[[0.0,-0.994953989982605,-0.10033199936151505],[-1.0,0.0,0.0],[0.0,-0.09741800278425217,0.995244026184082]],"spans":[119.60350799560547,500.0,759.613037109375],"flag":1}],"1":[{"address":"0x800d7270","origin":[-500.0,-24.0,-645.0],"axes":[[0.0,-0.8091040253639221,-0.5876650214195251],[0.0,0.590641975402832,-0.8069339990615845],[-1.0,0.0,0.0]],"spans":[117.4137954711914,120.2081527709961,1000.0],"flag":1},{"address":"0x800d72b0","origin":[-500.0,71.0,-576.0],"axes":[[0.0,-0.1434289962053299,-0.9896609783172607],[0.0,0.9899489879608154,-0.14142100512981415],[-1.0,0.0,0.0]],"spans":[69.72087097167969,120.2081527709961,1000.0],"flag":1},{"address":"0x800d72f0","origin":[-500.0,-23.0,-567.0],"axes":[[0.0,-0.8717970252037048,-0.4898670017719269],[0.0,0.48634299635887146,-0.8737679719924927],[-1.0,0.0,0.0]],"spans":[120.44085693359375,121.31364440917969,1000.0],"flag":1},{"address":"0x800d7330","origin":[-500.0,-75.0,-479.0],"axes":[[0.0,-0.970628023147583,-0.24058300256729126],[0.0,0.2383279949426651,-0.971185028553009],[-1.0,0.0,0.0]],"spans":[120.54045104980469,167.8362274169922,1000.0],"flag":1},{"address":"0x800d7370","origin":[-500.0,-182.0,386.0],"axes":[[0.0,-0.994953989982605,-0.10033199936151505],[0.0,-0.09741800278425217,0.995244026184082],[-1.0,0.0,0.0]],"spans":[119.60350799560547,759.613037109375,1000.0],"flag":1}],"2":[{"address":"0x800d7130","origin":[-750.0,-24.0,-645.0],"axes":[[0.0,-0.8091040253639221,-0.5876650214195251],[0.0,0.590641975402832,-0.8069339990615845],[-1.0,0.0,0.0]],"spans":[117.4137954711914,120.2081527709961,1500.0],"flag":1},{"address":"0x800d7170","origin":[-750.0,81.0,-507.0],"axes":[[0.0,0.1434289962053299,0.9896609783172607],[0.0,0.9887530207633972,-0.14955900609493256],[-1.0,0.0,0.0]],"spans":[69.72087097167969,120.35364532470703,1500.0],"flag":1},{"address":"0x800d71b0","origin":[750.0,-82.0,-461.0],"axes":[[0.0,-0.8697829842567444,-0.49343499541282654],[0.0,-0.48634299635887146,0.8737679719924927],[1.0,0.0,0.0]],"spans":[119.57006072998047,121.31364440917969,1500.0],"flag":1},{"address":"0x800d71f0","origin":[-750.0,-75.0,-479.0],"axes":[[0.0,-0.970628023147583,-0.24058300256729126],[0.0,0.2383279949426651,-0.971185028553009],[-1.0,0.0,0.0]],"spans":[120.54045104980469,167.8362274169922,1500.0],"flag":1},{"address":"0x800d7230","origin":[750.0,-63.0,398.0],"axes":[[0.0,0.994953989982605,0.10033199936151505],[0.0,-0.09741800278425217,0.995244026184082],[1.0,0.0,0.0]],"spans":[119.60350799560547,759.613037109375,1500.0],"flag":1}]},"supplementaryNormal":[{"address":"0x800d7770","origin":[1400.0,-100.0,-100.0],"axes":[[0.0,0.0,1.0],[0.0,-1.0,0.0],[1.0,0.0,0.0]],"spans":[50.0,350.0,700.0],"flag":0},{"address":"0x800d77b0","origin":[-950.0,-100.0,-4500.0],"axes":[[-1.0,0.0,0.0],[0.0,-1.0,0.0],[0.0,0.0,-1.0]],"spans":[50.0,350.0,600.0],"flag":0}],"supplementaryExpert":[{"address":"0x800d76f0","origin":[1400.0,-100.0,450.0],"axes":[[-1.0,0.0,0.0],[0.0,-1.0,0.0],[0.0,0.0,-1.0]],"spans":[200.0,650.0,700.0],"flag":0},{"address":"0x800d7730","origin":[-950.0,550.0,-4750.0],"axes":[[-1.0,0.0,0.0],[0.0,0.0,1.0],[0.0,1.0,0.0]],"spans":[200.0,600.0,650.0],"flag":0}]});

function validateClass(nativeClass){if(!Number.isInteger(nativeClass)||nativeClass<0||nativeClass>2)throw new RangeError('Invalid native class');}
export function portRampProfile(nativeClass=0,{reverse=false}={}){
 validateClass(nativeClass);return PORT_NATIVE_BOXES.profiles[reverse?0:nativeClass];
}
export function portFixedVolumes({nativeClass=0,stunt=false}={}){
 validateClass(nativeClass);
 const family=stunt||nativeClass===0?'normal':nativeClass===2?'expert':null;
 const rows=family==='normal'?PORT_NATIVE_BOXES.supplementaryNormal:family==='expert'?PORT_NATIVE_BOXES.supplementaryExpert:[];
 return rows.map((q,index)=>clippedVolume({id:`port-${family}-solid-${index}`,kind:'quay',sourceRecordAddress:q.address,
  origin:q.origin.map(v=>v*PORT_NATIVE_SCALE),axes:q.axes,spans:q.spans.map(v=>v*PORT_NATIVE_SCALE),flag:q.flag}));
}
export function portRampVolumes(ramp){
 if(!ramp||![ramp.x,ramp.y??0,ramp.z,ramp.tx,ramp.tz].every(Number.isFinite)||Math.abs(Math.hypot(ramp.tx,ramp.tz)-1)>1e-6)throw new TypeError('Invalid Port ramp transform');
 const profile=portRampProfile(ramp.sourceNativeClass,{reverse:ramp.sourceReverse});
 // Native yaw=raw heading+180. Transform each actual projection interval;
 // clippedVolume preserves the slightly nonorthogonal axes and finite height.
 const c=-ramp.tz,s=-ramp.tx,rotate=p=>[c*p[0]+s*p[2],p[1],-s*p[0]+c*p[2]];
 return profile.map((q,index)=>{
  const origin=rotate(q.origin.map(v=>v*PORT_NATIVE_SCALE));origin[0]+=ramp.x;origin[1]+=ramp.y??0;origin[2]+=ramp.z;
  return clippedVolume({id:ramp.id+'-solid-'+index,kind:'ramp',rampId:ramp.id,sourceRecordAddress:q.address,
   origin,axes:q.axes.map(rotate),spans:q.spans.map(v=>v*PORT_NATIVE_SCALE),flag:q.flag});
 });
}
export function portContactVolumes(ramps=[],selection={}){
 if(!Array.isArray(ramps))throw new TypeError('Ramps must be an array');
 return clippedVolumes([...portFixedVolumes(selection),...ramps.filter(q=>q.sourceCourseIndex===5&&q.sourceVolumeProfile).flatMap(portRampVolumes)]);
}
