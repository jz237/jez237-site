// Numeric actor15/descriptor7 evaluator. All selected frame records are explicit
// caller data; this module includes no animation records or original rest rig.
// Native coordinates remain native coordinates. The caller owns lifecycle,
// physical points, prior pose history, and any conversion to presentation units.
const F=Math.fround,AXES=['x','y','z'];
const POSITION=F(.1),DIRECTION=F(.007874020375311375);
const SOURCE_ANATOMY=Object.freeze({neckShoulderNative:F(14.367053985595703),shoulderHalfSpanNative:7,
 armUpperSquaredNative:F(72.98287963867188),armLowerSquaredNative:F(109.34884643554688),
 maxReachNative:19.000002000000002,neckHeadNative:14.483002,headExtensionNative:25,
 gripExtensionNative:3.5,toeExtensionNative:10,auxiliaryAlongNative:1.867542,
 auxiliaryGripHalfSpanNative:10.135,auxiliarySupportSpanNative:10});
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function finite(value,name='pose arithmetic'){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new RangeError(`${name} requires finite float32`);
 return F(value);
}
function integer(v,name,min,max){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} is outside the supported native range`);
 return v;
}
function vector(v,name){
 if(!v||typeof v!=='object')throw new TypeError(`${name} requires XYZ`);
 return AXES.map(k=>finite(v[k],`${name}.${k}`));
}
function array(v,n,name,convert){
 if(!Array.isArray(v)||v.length!==n)throw new RangeError(`${name} requires ${n} entries`);
 return Array.from(v,(x,i)=>convert(x,`${name}[${i}]`));
}

/** Default dimensions reproduce the original numeric evaluator. A complete
 * caller-authored anatomy explicitly adapts its geometry, retaining the same
 * three shoulder passes, hybrid placement, arm IK and point-mapping recipe.
 * Such output is not asserted to equal the original fixed-size skeleton. */
export function nativeRiderStartAnatomy(value){
 if(value===undefined||value===SOURCE_ANATOMY)return SOURCE_ANATOMY;
 const keys=Object.keys(SOURCE_ANATOMY);
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||
  keys.some(k=>!Object.hasOwn(value,k)))throw new TypeError('Start anatomy requires all twelve explicit native dimensions');
 const out={};
 for(const k of keys){
  const v=value[k];
  if(!Number.isFinite(v)||!Number.isFinite(F(v))||v<0||F(v)===0&&k!=='auxiliaryAlongNative')
   throw new RangeError(`Invalid start anatomy.${k}`);
  out[k]=['neckShoulderNative','armUpperSquaredNative','armLowerSquaredNative'].includes(k)?F(v):v;
 }
 if(!Number.isFinite(F(out.maxReachNative*out.maxReachNative)))throw new RangeError('Start anatomy reach must have finite squared extent');
 return keys.every(k=>out[k]===SOURCE_ANATOMY[k])?SOURCE_ANATOMY:Object.freeze(out);
}
const add=(a,b)=>finite(a+b),sub=(a,b)=>finite(a-b),mul=(a,b)=>finite(a*b);
const div=(a,b)=>{if(b===0)throw new RangeError('Start pose reached an unsupported zero divisor');return finite(a/b);};
const sqrt=a=>{if(a<0)throw new RangeError('Start pose reached an unsupported negative square root');return finite(Math.sqrt(a));};
const plus=(a,b)=>a.map((v,i)=>add(v,b[i])),minus=(a,b)=>a.map((v,i)=>sub(v,b[i]));
const times=(a,s)=>a.map(v=>mul(v,s));
const squared=a=>add(add(mul(a[0],a[0]),mul(a[1],a[1])),mul(a[2],a[2]));
const cross=(a,b)=>[sub(mul(a[1],b[2]),mul(a[2],b[1])),sub(mul(a[2],b[0]),mul(a[0],b[2])),sub(mul(a[0],b[1]),mul(a[1],b[0]))];
const object=a=>Object.fromEntries(AXES.map((k,i)=>[k,a[i]]));

/** Request this view before obtaining records. The source has no lower clamp;
 * negative frame indexing is deliberately outside this finite selected view. */
export function nativeRiderStartFrameView({animationFrame}={}){
 integer(animationFrame,'animationFrame',0,2147483647);
 const evaluatedAnimationFrame=Math.min(animationFrame,84);
 return freeze({descriptorIndex:7,frameCount:85,requestedAnimationFrame:animationFrame,
  evaluatedAnimationFrame,nextAnimationFrame:evaluatedAnimationFrame===84?-1:evaluatedAnimationFrame+1});
}
function frame(v){
 if(!v||typeof v!=='object')throw new TypeError('frameView is required');
 const expected=nativeRiderStartFrameView({animationFrame:v.requestedAnimationFrame});
 if(Object.keys(v).length!==Object.keys(expected).length||Object.keys(expected).some(k=>v[k]!==expected[k]))
  throw new RangeError('frameView does not match the source descriptor7 frame selection');
 return expected;
}
function record(v,name){
 if(!v||typeof v!=='object')throw new TypeError(`${name} is required`);
 return {p:array(v.coordinatesS16,3,`${name}.coordinatesS16`,(n,k)=>integer(n,k,-32768,32767)),
  a:array(v.firstDirectionS8,3,`${name}.firstDirectionS8`,(n,k)=>integer(n,k,-128,127)),
  b:array(v.secondDirectionS8,3,`${name}.secondDirectionS8`,(n,k)=>integer(n,k,-128,127))};
}
function body(v){
 if(!v||typeof v!=='object'||!v.yawFrame)throw new TypeError('bodyNative and its retained yawFrame are required');
 return {p:vector(v.position,'bodyNative.position'),r:vector(v.right,'bodyNative.right'),
  u:vector(v.up,'bodyNative.up'),f:vector(v.forward,'bodyNative.forward'),
  yaw:['field1434','field1438','field143c','field1440'].map(k=>finite(v.yawFrame[k],`bodyNative.yawFrame.${k}`))};
}
function decodeFull(rec,h){
 const transform=v=>AXES.map((_,i)=>add(add(mul(h.r[i],v[0]),mul(h.u[i],v[1])),mul(h.f[i],v[2])));
 return {p:plus(transform(times(rec.p,POSITION)),h.p),a:transform(times(rec.a,DIRECTION)),b:transform(times(rec.b,DIRECTION))};
}
function decodeYaw(rec,h){
 const [fx,fz,rx,rz]=h.yaw,p=times(rec.p,POSITION);
 const decodedA=times(rec.a,DIRECTION);
 const a=[add(mul(rx,decodedA[0]),mul(fx,decodedA[2])),decodedA[1],
  add(mul(rz,decodedA[0]),mul(fz,decodedA[2]))];
 const b=times(rec.b,DIRECTION);
 return {p:[add(add(mul(rx,p[0]),mul(fx,p[2])),h.p[0]),add(h.p[1],p[1]),add(add(mul(rz,p[0]),mul(fz,p[2])),h.p[2])],a,
  b:[add(mul(rx,b[0]),mul(fx,b[2])),b[1],add(mul(rz,b[0]),mul(fz,b[2]))]};
}
function fitShoulder(shoulder,wrist,neck,g){
 let delta=minus(shoulder,wrist),lengthSquared=squared(delta);
 if(lengthSquared>g.maxReachNative*g.maxReachNative)shoulder=plus(wrist,times(delta,finite(g.maxReachNative/sqrt(lengthSquared))));
 delta=minus(shoulder,neck);
 return plus(neck,times(delta,div(g.neckShoulderNative,sqrt(squared(delta)))));
}
function normalizeBlock(block){
 const firstSquared=squared(block.a);
 // These two zero guards are actual helper behavior, not invented fallbacks.
 if(firstSquared===0)return;
 block.a=times(block.a,div(1,sqrt(firstSquared)));
 block.b=cross(block.a,cross(block.b,block.a));
 const secondSquared=squared(block.b);
 if(secondSquared!==0)block.b=times(block.b,div(1,sqrt(secondSquared)));
}
function armJoint(shoulder,wrist,hint,g){
 const delta=minus(wrist,shoulder),distanceSquared=squared(delta);
 if(distanceSquared>=.000001){
  const along=finite((.5/distanceSquared)*add(sub(g.armUpperSquaredNative,g.armLowerSquaredNative),distanceSquared));
  const projected=plus(times(delta,along),shoulder),part=minus(projected,shoulder);
  const radialSquared=sub(sub(sub(g.armUpperSquaredNative,mul(part[0],part[0])),mul(part[1],part[1])),mul(part[2],part[2]));
  if(radialSquared>0){
   const perpendicular=cross(delta,cross(hint,delta)),perpendicularSquared=squared(perpendicular);
   if(perpendicularSquared!==0)return plus(times(perpendicular,sqrt(div(radialSquared,perpendicularSquared))),projected);
  }
 }
 const a=sqrt(g.armUpperSquaredNative),b=sqrt(g.armLowerSquaredNative);
 return plus(times(delta,div(a,add(a,b))),shoulder);
}
function mapPoints(pose,g){
 const p=i=>[...pose[i].p],extension=(i,n)=>plus(pose[i].p,times(pose[i].a,n));
 const grip=i=>pose[i].p.map((v,j)=>finite(v+pose[i].a[j]*g.gripExtensionNative));
 const targets=[extension(7,g.headExtensionNative),p(7),p(6),p(10),p(9),p(8),grip(8),p(2),p(1),p(0),extension(0,g.toeExtensionNative),
  p(13),p(12),p(11),grip(11),p(5),p(4),p(3),extension(3,g.toeExtensionNative)];
 const auxiliary=[p(17),p(16),p(15),...[1,-1].map(sign=>pose[15].p.map((v,j)=>
  finite((v+pose[16].a[j]*g.auxiliaryAlongNative)+sign*pose[15].a[j]*g.auxiliaryGripHalfSpanNative))),extension(17,g.auxiliarySupportSpanNative)];
 return {targetsNative:targets.map(object),auxiliaryTargetsNative:auxiliary.map(object)};
}

/** Complete reached actor15 math with explicit selected descriptor7 records.
 * This owns no pose clock, table, body or physical state. A finite nonzero
 * divisor is required where the original evaluator divides unconditionally;
 * nonfinite/FCSR exceptional outcomes are outside this bounded API. */
export function prepareNativeRiderStartPose({frameView,selectedFrame,bodyNative,anatomy}={}){
 const view=frame(frameView),g=nativeRiderStartAnatomy(anatomy);
 if(!selectedFrame||selectedFrame.evaluatedAnimationFrame!==view.evaluatedAnimationFrame)
  throw new RangeError('Selected records must identify the evaluated animation frame');
 const records=array(selectedFrame.records,18,'selectedFrame.records',record),h=body(bodyNative);
 const yawBones=new Set([2,5,6,7,10,13,14]);
 const pose=records.map((r,i)=>(yawBones.has(i)?decodeYaw:decodeFull)(r,h));
 for(let pass=0;pass<3;pass++){
  pose[10].p=fitShoulder(pose[10].p,pose[8].p,pose[14].p,g);
  pose[13].p=fitShoulder(pose[13].p,pose[11].p,pose[14].p,g);
  const delta=minus(pose[10].p,pose[13].p),factor=finite(g.shoulderHalfSpanNative/sqrt(squared(delta)));
  const middle=pose[10].p.map((v,i)=>finite(add(v,pose[13].p[i])*.5)),half=times(delta,factor);
  pose[10].p=plus(half,middle);pose[13].p=minus(middle,half);
 }
 const neck=pose[14],a=minus(pose[10].p,neck.p),b=minus(pose[13].p,neck.p);
 const neckDirection=pose[10].p.map((v,i)=>finite(add(v,pose[13].p[i])*.5-neck.p[i]));
 neck.a=times(neckDirection,div(1,sqrt(squared(neckDirection))));
 const neckNormal=cross(a,b);neck.b=times(neckNormal,div(1,sqrt(squared(neckNormal))));
 for(const [shoulder,elbow,wrist]of [[10,9,8],[13,12,11]]){
  const hint=pose[elbow].p.map((v,i)=>finite(v-.5*add(pose[wrist].p[i],pose[shoulder].p[i])));
  pose[elbow].p=armJoint(pose[shoulder].p,pose[wrist].p,hint,g);
  pose[shoulder].a=minus(pose[elbow].p,pose[shoulder].p);pose[shoulder].b=[...h.f];normalizeBlock(pose[shoulder]);
  pose[elbow].a=minus(pose[wrist].p,pose[elbow].p);pose[elbow].b=[...h.u];normalizeBlock(pose[elbow]);
 }
 pose[7].p=neck.p.map((v,i)=>finite(v+g.neckHeadNative*neck.a[i]));
 return freeze({poseNative:pose.map(p=>({origin:object(p.p),firstDirection:object(p.a),secondDirection:object(p.b)})),
  ...mapPoints(pose,g),evaluatedAnimationFrame:view.evaluatedAnimationFrame,nextAnimationFrame:view.nextAnimationFrame,
  provenance:{mechanics:'numeric actor15 descriptor7 evaluator and nineteen-plus-six point mapping',
   animation:'explicit caller-supplied selected records; no original animation or rest data',
   anatomy:g===SOURCE_ANATOMY?'original numeric dimensions':'explicit caller anatomy adapts the original fixed-size skeleton',
   units:'native global coordinates; no presentation scale conversion'}});
}
