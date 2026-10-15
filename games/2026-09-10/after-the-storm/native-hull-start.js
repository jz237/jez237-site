import {decodeNativeRaceStartTransform} from './native-race-start-transform.js';

// The physical portion of62E50/624CC/4AE88/4AC80. Geometry, selected damping
// coefficients and the retained horizontal frame are caller inputs. This does
// not initialize actors, animation, targets, resource pointers or scene state.
const F=Math.fround,axes=['x','y','z'];
function finite(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${name} must fit finite float32`);return F(v);}
function vector(v,name){if(!v||typeof v!=='object')throw new TypeError(`${name} needs XYZ`);return axes.map(k=>finite(v[k],name+'.'+k));}
const object=p=>Object.fromEntries(axes.map((k,i)=>[k,p[i]]));
const add=(a,b)=>finite(a+b,'source sum'),sub=(a,b)=>finite(a-b,'source difference'),mul=(a,b)=>finite(a*b,'source product');
function div(a,b){if(b===0)throw new RangeError('Native hull start reached a zero divisor');return finite(a/b,'source quotient');}
const squared=p=>add(add(mul(p[0],p[0]),mul(p[1],p[1])),mul(p[2],p[2]));
const root=v=>{if(v<0)throw new RangeError('Native hull start reached a negative square root');return finite(Math.sqrt(v),'source square root');};
const minus=(a,b)=>a.map((v,i)=>sub(v,b[i]));
const cross=(a,b)=>[sub(mul(a[1],b[2]),mul(a[2],b[1])),sub(mul(a[2],b[0]),mul(a[0],b[2])),sub(mul(a[0],b[1]),mul(a[1],b[0]))];
const unit=p=>{const reciprocal=div(1,root(squared(p)));return p.map(v=>mul(v,reciprocal));};
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Native coordinates in/out. The source transforms its descending local
 * centroid separately from the twelve points; a world-point average differs.
 * Points use the DECODED packed16.16 transform, then source geometry refits
 * the frame. A vertical forward retains the supplied four yaw words. No
 * fallback basis, guessed yaw, Euler reconstruction or implicit BSS is used.
 * All ordinary scalar operations roundF32, with the source F64 midpoint before
 * finalF32. Unsupported exceptional/degenerate arithmetic rejects atomically.
 */
export function prepareNativeHullStart({matrixWords,localPointsNative,dampingInner,dampingOuter,constraint20,retainedYawFrame}={}){
 if(!Array.isArray(localPointsNative)||localPointsNative.length!==12)throw new RangeError('Native hull start needs twelve local points');
 const local=Array.from(localPointsNative,(p,i)=>vector(p,'localPointsNative['+i+']'));
 const inner=finite(dampingInner,'dampingInner'),outer=finite(dampingOuter,'dampingOuter'),constraint=finite(constraint20,'constraint20');
 const decoded=decodeNativeRaceStartTransform({matrixWords});
 const r=vector(decoded.frameNative.right,'decoded right'),u=vector(decoded.frameNative.up,'decoded up'),f=vector(decoded.frameNative.forward,'decoded forward'),t=vector(decoded.positionNative,'decoded translation');
 const affine=p=>axes.map((_,j)=>add(t[j],add(add(mul(r[j],p[0]),mul(u[j],p[1])),mul(f[j],p[2]))));
 let centroid=[0,0,0];
 for(let i=11;i>=0;i--)centroid=centroid.map((v,j)=>add(v,local[i][j]));
 centroid=centroid.map(v=>div(v,12));
 const center=affine(centroid),points=Array(12);
 for(let i=11;i>=0;i--)points[i]=affine(local[i]);
 const forward=unit(minus(points[8],points[11]));
 const temporaryUp=points[11].map((v,j)=>finite(v-.5*add(points[9][j],points[10][j]),'source midpoint'));
 const right=unit(cross(temporaryUp,forward)),up=cross(forward,right);
 const horizontal=add(mul(forward[0],forward[0]),mul(forward[2],forward[2]));
 let yaw;
 if(horizontal!==0){const reciprocal=div(1,root(horizontal)),x=mul(forward[0],reciprocal),z=mul(forward[2],reciprocal);yaw=[x,z,z,-x];}
 else{
  if(!retainedYawFrame||typeof retainedYawFrame!=='object')throw new TypeError('Vertical startup needs the actual retained yaw frame');
  yaw=['field1434','field1438','field143c','field1440'].map(k=>finite(retainedYawFrame[k],'retainedYawFrame.'+k));
 }
 const restLengths=[],pairCoefficients=[],gain=div(.5,add(mul(constraint,10),1));
 for(let a=0;a<12;a++)for(let b=a+1;b<12;b++){
  const distance=root(squared(minus(points[a],points[b])));restLengths.push(distance);pairCoefficients.push(mul(distance,gain));
 }
 const radii=points.map(p=>root(squared(minus(p,center)))),maximumRadius=Math.max(...radii);
 const slope=div(sub(outer,inner),maximumRadius),damping=radii.map(radius=>add(mul(radius,slope),inner));
 const proxyBase=center.map((v,j)=>add(v,add(up[j],up[j])));
 const proxies=[27,9,-9,-27].map(distance=>proxyBase.map((v,j)=>add(mul(forward[j],distance),v)));
 return freeze({centerNative:object(center),pointsNative:points.map(object),frameNative:{forward:object(forward),up:object(up),right:object(right)},
  yawFrame:Object.fromEntries(['field1434','field1438','field143c','field1440'].map((k,i)=>[k,yaw[i]])),
  restLengthsNative:restLengths,pairCoefficientsNative:pairCoefficients,damping,proxyCentersNative:proxies.map(object),
  pairExtremaNative:{minimum:Math.min(...restLengths),maximum:Math.max(...restLengths)},
  provenance:{transform:'decoded packed16.16',geometry:'explicit caller-owned twelve local points',
   scope:'physical hull initialization only; actor/pose/profile selection remains caller-owned',arithmetic:'source F32; host sqrt rounded F32'}});
}
