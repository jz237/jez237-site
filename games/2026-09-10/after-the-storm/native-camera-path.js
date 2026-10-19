// Numeric reconstruction of original DE690 and DEB08/DEC00. These are the
// scalar/vector path samplers used by scripted course-introduction cameras.
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const add=(a,b)=>F(a+b),sub=(a,b)=>F(a-b),mul=(a,b)=>F(a*b),div=(a,b)=>F(a/b);
const word=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid camera path ${n}`);return v;}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Camera path values must fit finite float32');return F(v);}
function points(v){if(!Array.isArray(v)||v.length<4)throw new RangeError('Camera path requires at least four control points');return v.map(finite);}

/** The original spline has distinct first, second, interior, penultimate and
 * final span weights. Preserve each single-precision operation and its order;
 * a generic cubic spline changes endpoints and the camera's travel timing.
 * The source also permits extrapolation, so t is not clamped to [0,1].
 */
export function evaluateNativeCameraSpline({t,segment,points:values}={}){
 const p=points(values),n=p.length;t=finite(t);integer(segment,'segment',0,n-4);
 let w;const u=sub(1,t),t2=mul(t,t),t3=mul(t2,t),u2=mul(u,u),u3=mul(u2,u);
 const second=(x,x2,x3)=>add(add(sub(div(mul(x3,7),12),mul(mul(x2,5),.25)),mul(x,.25)),F(7/12));
 const middle=(x,x2,x3)=>add(add(add(mul(-x3,.5),mul(x2,.5)),mul(x,.5)),F(1/6));
 const first=(x,x2,x3)=>add(sub(div(mul(x3,21),12),mul(mul(x2,9),.5)),mul(x,3));
 const last=(x2,x3)=>add(div(mul(-x3,11),12),mul(mul(x2,3),.5));
 if(segment===0)w=[u3,first(t,t2,t3),last(t2,t3),div(t3,6)];
 else if(segment===1)w=[mul(u3,.25),second(t,t2,t3),middle(t,t2,t3),div(t3,6)];
 else if(n<7||segment<n-5)w=[div(u3,6),add(sub(mul(t3,.5),t2),F(2/3)),middle(t,t2,t3),div(t3,6)];
 else if(n===segment+5)w=[div(u3,6),middle(u,u2,u3),second(u,u2,u3),mul(t3,.25)];
 else w=[div(u3,6),last(u2,u3),first(u,u2,u3),t3];
 return finite(add(mul(p[segment+3],w[3]),add(add(mul(w[0],p[segment]),mul(w[1],p[segment+1])),mul(w[2],p[segment+2]))));
}

/** One DEB08 scalar or DEC00 XYZ sample. State writes are kept in source
 * order, including zero-duration span skips and terminal segment=-1. The
 * current frame is sampled before its signed increment and span rollover.
 * A script owns the lifecycle: sampling a terminal path is rejected instead
 * of inventing a loop or silently restarting it. No camera/scene is mutated.
 */
export function prepareNativeCameraPathSample({frame,segment,channels,durations}={}){
 integer(frame,'frame');
 if(!Array.isArray(channels)||![1,3].includes(channels.length))throw new RangeError('Supply scalar or XYZ camera path channels');
 const p=channels.map(points),count=p[0].length;
 if(p.some(row=>row.length!==count))throw new RangeError('Camera path channels must have matching control-point counts');
 integer(segment,'segment',0,count-4);
 if(!Array.isArray(durations)||durations.length!==count-3)throw new RangeError('Supply one camera path duration per span');
 const times=durations.map(v=>integer(v,'duration',0));
 const operations=[],stateWords=[frame>>>0,segment>>>0],outputWords=[];
 function write(i,v){stateWords[i]=v>>>0;operations.push({kind:'pathStateWrite',wordIndex:i,value:v>>>0});}
 while(times[segment]===0){segment++;if(segment>=times.length)throw new RangeError('Camera path has no remaining timed span');write(1,segment);}
 const t=div(F(frame),F(times[segment]));
 for(const row of p){const value=word(evaluateNativeCameraSpline({t,segment,points:row}));operations.push({kind:'pathOutputWrite',wordIndex:outputWords.length,value});outputWords.push(value);}
 frame=(frame+1)|0;write(0,frame);
 if(frame>=times[segment]){
  write(0,0);write(1,segment+1);
  if(segment+1>=count-3)write(1,-1);
 }
 return freeze({operations,outputWords,stateWords,frame:stateWords[0]|0,segment:stateWords[1]|0});
}
