// Independently reconstructed common actor24 procedural target preparation.
// No original animation, mesh, texture or pose records are included. The
// alternateStumble!=0 branch reads separate pose records and is unsupported;
// it is never replaced by ordinary riding targets.
//
// Inputs are ACTUAL solved19point positions/stored deltas and the physical
// auxiliary row21 pivot/history, in world units. No joint or support is inferred
// from a visual rider. Native dimensions remain fixed at the explicit scale;
// using an authored rest/anchor rig remains an explicitly authored adaptation.
// This pure producer runs once after5 hull ticks, before auxiliary/B/19point
// solving. Store prior rendered-physical history separately after those solves.
//
// yawForward is the persisted horizontal source record basis {x,z}, not a
// profile scale. The source retains it when hull forward is exactly vertical.
// Caller supplies that retained value instead of inventing a heading here.
// Float32 operations and double literal stages retain recovered source order.
// This does not emulate processor floating-point exception modes. Undefined
// collapsed divisions reject explicitly without manufacturing a fallback pose.

const F=Math.fround,AXES=['x','y','z'];
const vec=(x=0,y=0,z=0)=>({x,y,z});
const add=(a,b)=>vec(F(a.x+b.x),F(a.y+b.y),F(a.z+b.z));
const minus=(a,b)=>vec(F(a.x-b.x),F(a.y-b.y),F(a.z-b.z));
const times=(a,t)=>vec(F(a.x*t),F(a.y*t),F(a.z*t));
const dot=(a,b)=>F(F(F(a.x*b.x)+F(a.y*b.y))+F(a.z*b.z));
const length=a=>F(Math.sqrt(dot(a,a)));
const cross=(a,b)=>vec(F(F(a.y*b.z)-F(a.z*b.y)),F(F(a.z*b.x)-F(a.x*b.z)),F(F(a.x*b.y)-F(a.y*b.x)));
function finite(value,name){if(!Number.isFinite(value))throw new RangeError(`${name} exceeds finite native arithmetic`);return value;}
function vector(value,name){
  if(!value||!AXES.every(a=>Number.isFinite(value[a])))throw new TypeError(`${name} requires finite x, y and z`);
  return value;
}
function native(value,scale,name){vector(value,name);return vec(...AXES.map(a=>finite(F(value[a]/scale),name)));}
function points(value,scale,name){
  if(!Array.isArray(value)||value.length!==19)throw new TypeError(`${name} must contain nineteen world vectors`);
  return value.map((p,i)=>native(p,scale,`${name}[${i}]`));
}
function axis(value,name){
  vector(value,name);if(Math.abs(Math.hypot(value.x,value.y,value.z)-1)>1e-6)throw new RangeError(`${name} must be a unit hull axis`);
  return native(value,1,name);
}
function ratio(n,d,name){
  if(!Number.isFinite(d)||d===0)throw new RangeError(`Collapsed ${name}`);
  return finite(F(n/d),name);
}
function normalized(p){const n=finite(length(p),'direction');return n===0?vec(p.x,p.y,p.z):times(p,ratio(1,n,'direction'));}
function normalizedFrame(first,second){
  const a=normalized(first);return [a,normalized(cross(a,cross(second,a)))];
}
function world(points,scale){return points.map(p=>vec(...AXES.map(a=>finite(finite(p[a],'point')*scale,'world point'))));}

// Two squared-length intersection with an explicit bending pole. The source
// falls back to a length-weighted chord when its intersection is unavailable.
function twoLengthPoint(a,b,squaredA,squaredB,pole){
  const d=minus(b,a),n2=finite(dot(d,d),'limb distance');
  if(n2>=1e-6){
    const t=F((.5/n2)*F(F(squaredA-squaredB)+n2)),middle=add(a,times(d,t)),offset=minus(middle,a);
    const h2=F(F(F(squaredA-F(offset.x*offset.x))-F(offset.y*offset.y))-F(offset.z*offset.z));
    if(h2>0){
      const direction=cross(d,cross(pole,d)),q=finite(dot(direction,direction),'limb pole');
      if(q!==0)return add(middle,times(direction,F(Math.sqrt(F(h2/q)))));
    }
  }
  const rootA=F(Math.sqrt(squaredA)),rootB=F(Math.sqrt(squaredB));
  return add(a,times(d,ratio(rootA,F(rootA+rootB),'limb chord')));
}
function fitShoulder(point,grip){
  const d=minus(point,grip),squared=finite(dot(d,d),'arm reach');
  if(squared>420.25008200000406)return {point:add(grip,times(d,ratio(20.500002000000002,F(Math.sqrt(squared)),'arm reach'))),squared};
  if(squared<109.34884900000002)return {point:add(grip,times(d,ratio(10.457,F(Math.sqrt(squared)),'arm reach'))),squared};
  return {point,squared};
}

/** Produce decoded current targets without changing physical state or history. */
export function prepareNativeRiderStumblePose({positions,storedDeltas,auxiliaryPivot,auxiliaryPivotDelta,
  center,forward,up,right,yawForward,scale=.025,alternateStumble=0}={}){
  if(alternateStumble!==0)throw new RangeError('Alternate stumble requires its separate authored pose-record provider');
  if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive');
  const p=points(positions,scale,'positions'),d=points(storedDeltas,scale,'storedDeltas');
  const pivot=native(auxiliaryPivot,scale,'auxiliaryPivot'),pivotDelta=native(auxiliaryPivotDelta,scale,'auxiliaryPivotDelta');
  const c=native(center,scale,'center'),f=axis(forward,'forward'),u=axis(up,'up'),r=axis(right,'right');
  if(!yawForward||!Number.isFinite(yawForward.x)||!Number.isFinite(yawForward.z))throw new TypeError('yawForward requires finite x and z');
  if(Math.abs(Math.hypot(yawForward.x,yawForward.z)-1)>1e-6)throw new RangeError('yawForward must be horizontal unit forward');
  const yaw=vec(F(yawForward.x),0,F(yawForward.z));
  const raised=vec(...AXES.map(a=>F(c[a]+13*u[a]+37*f[a])));
  const toward=minus(add(add(pivot,times(pivotDelta,F(.94))),times(u,-4)),raised);
  let along=dot(toward,f);if(along>-.1)along=F(-.1);
  const vertical=Math.max(0,dot(toward,u)),projected=add(times(f,along),times(u,vertical));
  const direction=times(projected,ratio(1,length(projected),'pivot direction'));
  const fittedPivot=vec(...AXES.map(a=>F(raised[a]+direction[a]*41.070999)));
  // The current circle point is written BEFORE its pose direction receives a
  // second normalization. The physical import uses that normalized direction.
  const decodedDirection=normalized(direction);
  const auxiliaryTargets=[c,raised,fittedPivot,
    vec(...AXES.map(a=>F(fittedPivot[a]+decodedDirection[a]*1.867542+r[a]*10.135))),
    vec(...AXES.map(a=>F(fittedPivot[a]+decodedDirection[a]*1.867542-r[a]*10.135))),
    add(c,times(f,10))];
  const gripBase=vec(...AXES.map(a=>F(fittedPivot[a]-f[a]*1.867542)));
  const span=vec(...AXES.map(a=>F(r[a]*10.135))),grips=[add(gripBase,span),minus(gripBase,span)];
  const predict=(i,drop=-4)=>{
    const q=add(p[i],times(d[i],F(.82)));q.y=F(q.y+drop);return q;
  };
  let shoulders=[predict(3),predict(11)];
  if(dot(r,minus(shoulders[0],shoulders[1]))<0)shoulders.reverse();
  shoulders=[add(shoulders[0],times(r,5)),minus(shoulders[1],times(r,5))];
  let side,mid;
  for(let pass=0;pass<3;pass++){
    shoulders[0]=fitShoulder(shoulders[0],grips[0]).point;
    const last=fitShoulder(shoulders[1],grips[1]);shoulders[1]=last.point;
    // The source denominator is the PRE-clamp second shoulder/grip distance,
    // not the shoulder-pair distance. Replacing it changes the actual pose.
    side=times(minus(shoulders[1],shoulders[0]),ratio(7,F(Math.sqrt(last.squared)),'shoulder fit'));
    mid=times(add(shoulders[0],shoulders[1]),.5);
    shoulders=[minus(mid,side),add(mid,side)];
  }
  const secondaryRaw=cross(minus(mid,predict(2)),side);
  const [first,secondary]=normalizedFrame(cross(side,secondaryRaw),secondaryRaw);
  const torso=vec(...AXES.map(a=>F(mid[a]-12.546404*first[a])));
  const neck=vec(...AXES.map(a=>F(mid[a]+1.936598*first[a])));
  const wrists=[],wristDirections=[];
  for(let i=0;i<2;i++){
    const diff=minus(grips[i],shoulders[i]),wd=times(diff,ratio(3.5,length(diff),'hand direction'));
    wristDirections.push(wd);wrists.push(minus(grips[i],wd));
  }
  const sideUnit=normalized(side);
  const elbows=[twoLengthPoint(shoulders[0],wrists[0],72.98287963867188,109.34884643554688,minus(secondary,sideUnit)),
    twoLengthPoint(shoulders[1],wrists[1],72.98287963867188,109.34884643554688,add(secondary,sideUnit))];
  let hipDirection=minus(times(add(predict(7),predict(15)),.5),torso);
  hipDirection=times(hipDirection,ratio(2.729486,length(hipDirection),'hip direction'));
  const hipSecondaryRaw=cross(hipDirection,r);
  let hipSide=cross(hipSecondaryRaw,hipDirection);
  hipSide=times(hipSide,ratio(3.133,length(hipSide),'hip spacing'));
  const hips=[add(add(torso,hipDirection),hipSide),minus(add(torso,hipDirection),hipSide)];
  const hipSecondary=normalizedFrame(hipDirection,hipSecondaryRaw)[1];
  const across=minus(hips[0],hips[1]),ankleSide=times(across,ratio(.5,length(across),'ankle spacing'));
  const candidates=[add(predict(9,-2),ankleSide),minus(predict(17,-2),ankleSide)];
  const ankles=candidates.map((point,i)=>{
    let displacement=minus(point,hips[i]);const squared=finite(dot(displacement,displacement),'leg reach');
    if(squared>1164.505046274025)displacement=times(displacement,ratio(34.124845,F(Math.sqrt(squared)),'leg reach'));
    // Source recomposes origin+displacement even in the unclamped branch.
    return add(hips[i],displacement);
  });
  const hipPole=times(hipSide,ratio(F(.1),length(hipSide),'leg pole'));
  const knees=[twoLengthPoint(hips[0],ankles[0],298.01123046875,355.7691345214844,add(hipSecondary,hipPole)),
    twoLengthPoint(hips[1],ankles[1],298.01123046875,355.7691345214844,minus(hipSecondary,hipPole))];
  const targets=Array(19);targets[1]=neck;targets[0]=add(neck,times(yaw,25));targets[2]=torso;
  for(let i=0;i<2;i++){
    const indices=i===0?[3,4,5,6,7,8,9,10]:[11,12,13,14,15,16,17,18];
    const handDirection=normalized(wristDirections[i]);
    const values=[shoulders[i],elbows[i],wrists[i],vec(...AXES.map(a=>F(wrists[i][a]+3.5*handDirection[a]))),
      hips[i],knees[i],ankles[i],add(ankles[i],times(normalized(minus(knees[i],hips[i])),10))];
    // Actor24's toe extension follows the UPPER-leg direction, as stored by
    // its pose producer; it is not substituted with the lower-leg direction.
    indices.forEach((index,j)=>{targets[index]=values[j];});
  }
  return {targets:world(targets,scale),auxiliaryTargets:world(auxiliaryTargets,scale),nextAnimationFrame:0};
}
