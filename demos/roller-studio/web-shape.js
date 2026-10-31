import * as T from '../aquaclear-studio/vendor/three.module.js';
const V=(x,y,z=0)=>new T.Vector3(x,y,z),clamp=x=>Math.min(1,Math.max(0,x));
export function createWebShape(s,tension=0){
 const path=new T.CurvePath(),slack=.085*(1-tension),left=V(-1.34-s.clean,4.25),right=V(1.34+s.dirty,4.25);
 path.add(new T.CubicBezierCurve3(left,V(left.x,3.79-slack),V(-1.42-slack,3.64-slack),V(-1.41,3.18)));
 path.add(new T.LineCurve3(V(-1.41,3.18),V(-1.41,1.4)));
 path.add(new T.CubicBezierCurve3(V(-1.41,1.4),V(-1.41,1.28954),V(-1.32046,1.2),V(-1.21,1.2)));
 path.add(new T.CubicBezierCurve3(V(-1.21,1.2),V(-.5,1.18),V(.5,1.18),V(1.21,1.2)));
 path.add(new T.CubicBezierCurve3(V(1.21,1.2),V(1.32046,1.2),V(1.41,1.28954),V(1.41,1.4)));
 path.add(new T.LineCurve3(V(1.41,1.4),V(1.41,3.18)));
 path.add(new T.CubicBezierCurve3(V(1.41,3.18),V(1.42+slack,3.64-slack),V(right.x,3.79-slack),right));
 const length=path.getLength();
 function sample(distance,z=0){const u=clamp(distance/length),p=path.getPointAt(u),t=path.getTangentAt(u),n=V(-t.y,t.x),across=z/1.8+.5,free=clamp((p.y-3.18)/.65),wrinkle=Math.sin(across*31+distance*.8-s.travel*.8)*(.003+free*.024*(1-tension*.8))*Math.sin(across*Math.PI)*clamp(Math.min(distance,length-distance)/.18);p.addScaledVector(n,wrinkle);p.z=z;return {p,t,n};}
 return {path,length,sample,slack};
}
