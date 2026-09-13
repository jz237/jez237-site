import test from 'node:test';
import assert from 'node:assert/strict';
import {rippleSlopeShader} from '../lib/WaterRipples.ts';

// Evaluate the actual scalar GLSL, checking it against numerical derivatives of
// the pre-optimization height field. No browser/GPU-specific math approximation.
const js=rippleSlopeShader.replace('vec3 rippleSlope(float x,float z,float fineFilter)','function rippleSlope(x,z,fineFilter)')
 .replace(/\bfloat /g,'let ').replace(/\b(sin|cos|sqrt|exp|abs|min|max|sign)\(/g,'Math.$1(');
const normalAt=new Function('time',`const vec3=(x,y,z)=>({x,y,z}),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));${js};return rippleSlope;`);
const smooth=x=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u);};
function height(x,z,time,filter){
 const r=Math.hypot(x-4.25,z+1.6),qx=x+.09*Math.sin(z*1.9+x*.7-time*.29),qz=z+.09*Math.sin(x*1.3-z*.8+time*.23);
 const waves=.011*Math.sin(qx*2.7+qz*3.6-time*1.8)+.012*Math.sin(qx*8.3-qz*6.8-time*3.2+Math.sin(qz*1.7)*.65)+.007*Math.sin(qx*12.1+qz*9.7-time*4.8+Math.sin(qx*.8-time*.23)*.7);
 const fine=.002*Math.sin(qx*23.2-qz*17.8-time*7.1)+.0014*Math.sin(qx*31.7+qz*11.9-time*8.6+Math.sin(qz*2.3)*.25)+.0011*Math.sin(-qx*15.3+qz*37.4-time*10.3);
 const edge=Math.min(5.04-Math.abs(x),2.30-Math.abs(z));
 return ((waves+filter*fine)*(.65+.35*Math.exp(-r*.32))+.006*Math.sin(r*18-time*5.4)*Math.exp(-r*.8))*(.12+.88*smooth(edge/.18))+.015*Math.exp(-Math.max(0,edge)/.025);
}
test('analytic water normals retain every ripple, inlet disturbance and curved wet edge',()=>{
 const eps=1e-6;
 for(const t of [0,.3,3,11.2,29])for(const filter of [0,.37,1])for(const x of [-5.039,-5.02,-4.94,-3.71,-.12,2.52,4.249,5.01])for(const z of [-2.299,-2.27,-1.87,-1.599,.23,1.76,2.25]){
  const n=normalAt(t)(x,z,filter);
  // min(edgeX, edgeZ) has no unique derivative on the diagonal corner seam.
  if(Math.abs((5.04-Math.abs(x))-(2.30-Math.abs(z)))<eps*10)continue;
  const dx=(height(x+eps,z,t,filter)-height(x-eps,z,t,filter))/(2*eps),dz=(height(x,z+eps,t,filter)-height(x,z-eps,t,filter))/(2*eps);
  assert.ok(Math.abs(n.x+dx)<2e-6,`X slope at ${x},${z},${t}`);
  assert.ok(Math.abs(n.z+dz)<2e-6,`Z slope at ${x},${z},${t}`);
  assert.equal(n.y,1);
 }
});
test('inlet center and contact-line corners have finite normals',()=>{
 for(const t of [0,1,8])for(const [x,z] of [[4.25,-1.6],[5.04,2.3],[-5.04,-2.3]]){
  assert.ok(Object.values(normalAt(t)(x,z,1)).every(Number.isFinite));
 }
});
