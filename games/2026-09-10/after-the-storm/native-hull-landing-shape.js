// Original51EC0 checks the six end-section points against the current body
// axes. A folded section rebuilds all twelve positions from the caller's
// local shape. Velocities, frame, center and constraints are not rewritten.
const F=Math.fround,axes=['x','y','z'];
function vector(v,name){
 if(!v||!axes.every(k=>Number.isFinite(v[k])&&Number.isFinite(F(v[k]))))throw new TypeError(`${name} requires finite binary32 XYZ`);
 return Object.fromEntries(axes.map(k=>[k,F(v[k])]));
}
function points(v,name){
 if(!Array.isArray(v)||v.length!==12)throw new TypeError(`${name} requires twelve points`);
 return v.map((p,i)=>vector(p,`${name}[${i}]`));
}
const dot=(p,a)=>F(F(F(p.x*a.x)+F(p.y*a.y))+F(p.z*a.z));
const sides=[['right',2,1],['right',5,1],['right',0,-1],['right',3,-1],
 ['up',1,1],['up',4,1],['up',0,-1],['up',2,-1],['up',3,-1],['up',5,-1],
 ['forward',3,1],['forward',4,1],['forward',5,1],['forward',0,-1],['forward',1,-1],['forward',2,-1]];

/** Explicit native-unit inputs. Zero plane distances pass. Local geometry is
 * caller-owned; this helper supplies no original mesh or default hull shape.
 * It prepares a landing-result side effect, not a per-tick shape constraint.
 */
export function prepareNativeHullLandingShape({pointsNative,localPointsNative,centerNative,frame}={}){
 const current=points(pointsNative,'pointsNative'),local=points(localPointsNative,'localPointsNative'),center=vector(centerNative,'centerNative');
 const basis=Object.fromEntries(['right','up','forward'].map(k=>[k,vector(frame?.[k],`frame.${k}`)]));
 const relative=current.slice(0,6).map(p=>Object.fromEntries(axes.map(k=>[k,F(p[k]-center[k])])));
 const reset=sides.some(([axis,i,sign])=>dot(relative[i],basis[axis])*sign<0);
 if(!reset)return {reset:false,pointsNative:current};
 const rebuilt=local.map(p=>Object.fromEntries(axes.map(k=>[k,F(F(F(F(basis.right[k]*p.x)+F(basis.up[k]*p.y))+F(basis.forward[k]*p.z))+center[k])])));
 if(rebuilt.some(p=>axes.some(k=>!Number.isFinite(p[k]))))throw new RangeError('Landing shape exceeds finite binary32 coordinates');
 return {reset:true,pointsNative:rebuilt};
}
