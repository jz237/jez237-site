import {gl,Program} from './gl.js';import {bindLighting} from './lighting.js';import {HullSprayMotion} from './hull-spray-motion.js';
const VS=`
layout(location=0)in vec3 aPosition;
layout(location=1)in vec2 aLifeSize;
uniform mat4 uVP;
uniform float uPixelScale;
out vec3 vRel;
out float vLife;
void main(){vRel=aPosition;vLife=aLifeSize.x;gl_Position=uVP*vec4(aPosition,1);gl_PointSize=clamp(aLifeSize.y*uPixelScale/max(gl_Position.w,.1),.7,2.8);}
`;
const FS=`
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in vec3 vRel;in float vLife;
layout(location=0)out vec4 o;
void main(){
 float r=length(gl_PointCoord-.5),alpha=(1.0-smoothstep(.12,.50,r))*vLife*.38;if(alpha<.002)discard;
 vec3 col=vec3(.92,.95,.97)*(lightSun()*.65*cloudShadowAt(vRel.xz)+lightMoon()*.5+lightSky()*.65+flashE(vec3(0,1,0)))/PI;
 float dist=length(vRel);vec3 T=exp(-(RAY_S+(MIE_S+MIE_A)*uHaze)*.001*dist);
 col=col*T+horizonColor(normalize(vec3(vRel.x,.01,vRel.z)))*(1.0-T);o=vec4(col,alpha);
}`;
export class HullSpray{
 constructor(){
  this.motion=new HullSprayMotion();this.prog=new Program('hull.spray',VS,FS);this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);
  this.buffer=gl.createBuffer();this.vertices=new Float32Array(512*5);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices.byteLength,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,2,gl.FLOAT,false,20,12);gl.bindVertexArray(null);
 }
 draw(ctx,VP){
  if(ctx.under||!this.motion.particles.length)return;let off=0;
  for(const p of this.motion.particles)this.vertices.set([p.p[0]-ctx.cam.x,p.p[1]-ctx.cam.y,p.p[2]-ctx.cam.z,Math.sin(Math.PI*Math.min(1,p.age/p.life)),p.size],off),off+=5;
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
  const p=this.prog.use();bindLighting(p,ctx);p.m4('uVP',VP).f('uPixelScale',ctx.h/(2*Math.tan(ctx.cam.fov*.5)));
  gl.bindVertexArray(this.vao);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertices.subarray(0,off));gl.drawArrays(gl.POINTS,0,off/5);
  gl.depthMask(true);gl.disable(gl.BLEND);
 }
}
