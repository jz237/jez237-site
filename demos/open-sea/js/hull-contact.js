import {glslFloat as F} from './vessels.js';
import {DOMAIN,SY} from './vessels.js';
// Recent wetting stays in the solid boat frame. Its thin water film drains
// over time instead of disappearing as soon as a crest recedes.
import {gl,Program,FS_VERT,tex2D,makeFBO,bindFBO,drawFS} from './gl.js';
import {bindHullWater} from './hull-water.js';
const W=128,H=32;
const FS=`
#include <common>
#include <water.uv>
#include <whirlpool>
#include <wake>
#include <hull-water>
in vec2 vUv;
uniform sampler2DArray uDisp;
uniform sampler2D uPrevious;
uniform float uDt,uFirst;
out vec4 o;
float surface(vec2 p){
 vec2 dd=vec2(0);float h=0.0;
 for(int it=0;it<4;it++){
  vec2 g=p-dd;dd=vec2(0);h=0.0;
  for(int i=0;i<5;i++){if(i>=uCascades)break;vec4 d=textureLod(uDisp,vec3(cascUV(i,g),float(i)),0.0);dd+=toWorld(d.xz,i);h+=d.y;}
 }
 h+=whirlSurface(p).x+kelvinWake(p,16).x;
 return h+hullRunup(vec3(p.x,h,p.y));
}
void main(){
 vec2 local=(vUv-.5)*vec2(${F(DOMAIN[0])},${F(DOMAIN[1])});
 vec3 base=uHullBow*local.x+uHullSide*local.y;
 float y=0.0;
 for(int it=0;it<4;it++){
  vec3 p=base+uHullUp*y;float error=p.y+uHullCenter.y-surface(p.xz);
  float derivative=uHullUp.y-dot(whirlSurface(p.xz).yz,uHullUp.xz);
  y=clamp(y-error/max(.25,derivative),-${F(7*SY)},${F(7*SY)});
 }
 vec4 previous=texture(uPrevious,vUv);
 float wet=uFirst>.5?y:max(y,y+(previous.g-y)*exp(-uDt/5.0));
 o=vec4(y,clamp(wet,-${F(7*SY)},${F(7*SY)}),0,1);
}`;
export class HullContact{
 constructor(){
  this.prog=new Program('hull.contact',FS_VERT,FS);this.first=true;
  this.a=tex2D(W,H,{fmt:'rgba16f',filter:'linear'});this.b=tex2D(W,H,{fmt:'rgba16f',filter:'linear'});
  this.fa=makeFBO([this.a]);this.fb=makeFBO([this.b]);this.cur=this.a;this.other=this.b;this.curF=this.fa;this.otherF=this.fb;
 }
 update(ctx,yacht,dt){
  bindFBO(this.otherF);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
  const p=this.prog.use().t('uDisp',8,ctx.sim.disp).t('uPrevious',0,this.cur).i('uCascades',ctx.sim.count).f('uDt',Math.max(0,Math.min(dt,.1))).f('uFirst',this.first?1:0);
  const {scale,off}=ctx.sim.cascadeUniforms(yacht.x,yacht.z);
  p.v4v('uCasc',scale).v2v('uCen',off);
  if(ctx.sim.count>1)p.v2('uNoiseOrg',scale[5]*yacht.x+scale[6]*yacht.z,-scale[6]*yacht.x+scale[5]*yacht.z);
  const origin={x:yacht.x,y:0,z:yacht.z};ctx.whirlpool.bind(p,origin);bindHullWater(p,yacht,origin);
  p.v4('uWakeA',0,0,Math.cos(yacht.psi+yacht.yaw),Math.sin(yacht.psi+yacht.yaw)).v4('uWakeB',yacht.speed,.20*Math.pow(yacht.speed/6,2),1,0);
  drawFS();[this.cur,this.other]=[this.other,this.cur];[this.curF,this.otherF]=[this.otherF,this.curF];this.first=false;
 }
}
