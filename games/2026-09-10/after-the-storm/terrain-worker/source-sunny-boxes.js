import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=446f22fe0449';

// Independent numeric reconstruction of finite collision intervals. No source
// artwork or executable code. .025 metres/native remains conditional on the
// HUD/clock calibration; the live craft response is shared modern physics.
export const SUNNY_NATIVE_SCALE=.025;
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const SUNNY_NATIVE_BOXES=deepFreeze({"nativeCourseIndex":1,"scale":0.025,"fixed":[],"rampProfiles":[{"address":"0x800d6cf0","origin":[-750.0,2.0,1.0],"axes":[[0.0,0.9486830234527588,0.3162280023097992],[0.0,0.3162280023097992,-0.9486830234527588],[-1.0,0.0,0.0]],"spans":[234.008544921875,316.2277526855469,1500.0],"flag":1},{"address":"0x800d6d30","origin":[-750.0,-127.0,-737.0],"axes":[[0.0,0.5895370244979858,-0.8077419996261597],[0.0,-0.8095239996910095,-0.5870869755744934],[-1.0,0.0,0.0]],"spans":[261.2221374511719,274.23529052734375,1500.0],"flag":1},{"address":"0x800d6d70","origin":[-750.0,93.0,-575.0],"axes":[[0.0,-0.1434289962053299,-0.9896609783172607],[0.0,0.9901880025863647,-0.13974399864673615],[-1.0,0.0,0.0]],"spans":[69.72087097167969,250.45758056640625,1500.0],"flag":1},{"address":"0x800d6db0","origin":[750.0,105.0,-507.0],"axes":[[0.0,0.4910129904747009,-0.8711519837379456],[0.0,0.8724370002746582,0.4887259900569916],[1.0,0.0,0.0]],"spans":[189.40432739257812,247.58230590820312,1500.0],"flag":1},{"address":"0x800d6df0","origin":[750.0,0.0,-189.0],"axes":[[0.0,0.970628023147583,0.24058300256729126],[0.0,-0.24445199966430664,0.9696609973907471],[1.0,0.0,0.0]],"spans":[241.08090209960938,245.446533203125,1500.0],"flag":1},{"address":"0x800d6e30","origin":[-750.0,30.0,-307.0],"axes":[[0.0,0.9952849745750427,0.09699799865484238],[0.0,0.09725700318813324,-0.9952589869499207],[-1.0,0.0,0.0]],"spans":[237.1181182861328,308.4623107910156,1500.0],"flag":1}]});

export function sunnyRampVolumes(ramp){
 if(!ramp||![ramp.x,ramp.y??0,ramp.z,ramp.tx,ramp.tz].every(Number.isFinite)||Math.abs(Math.hypot(ramp.tx,ramp.tz)-1)>1e-6)throw new TypeError('Invalid Sunny ramp transform');
 // Source yaw is raw heading+180. Rotate the actual projection intervals;
 // clippedVolume retains nonorthogonal axes and the full vertical extent.
 const c=-ramp.tz,s=-ramp.tx,rotate=p=>[c*p[0]+s*p[2],p[1],-s*p[0]+c*p[2]];
 return SUNNY_NATIVE_BOXES.rampProfiles.map((q,index)=>{
  const origin=rotate(q.origin.map(v=>v*SUNNY_NATIVE_SCALE));
  origin[0]+=ramp.x;origin[1]+=ramp.y??0;origin[2]+=ramp.z;
  return clippedVolume({id:ramp.id+'-solid-'+index,kind:'ramp',rampId:ramp.id,sourceRecordAddress:q.address,
   origin,axes:q.axes.map(rotate),spans:q.spans.map(v=>v*SUNNY_NATIVE_SCALE),flag:q.flag});
 });
}

export function sunnyContactVolumes(ramps=[]){
 if(!Array.isArray(ramps))throw new TypeError('Ramps must be an array');
 // Sunny has no supplementary fixed OBBs and no ordinary race ramps.
 return clippedVolumes(ramps.filter(q=>q.sourceCourseIndex===1&&q.sourceVolumeProfile).flatMap(sunnyRampVolumes));
}
