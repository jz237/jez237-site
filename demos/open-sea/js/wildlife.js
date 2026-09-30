// Small, volumetric marine wildlife, lit by the same sky and cloud shadows as
// the ship. No billboards for animals and no additional texture downloads.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS } from './gl.js';
import { bindLighting } from './lighting.js';
import { WildlifeMotion } from './wildlife-motion.js';
import './glsl.js';

const VS=`
#include <common>
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNrm;
layout(location=2) in vec3 aColor;
layout(location=3) in vec3 aAttr;
uniform mat4 uVP,uModel;
uniform vec4 uMotion;
uniform float uKind;
uniform sampler2D uAnchors;
uniform int uWhaleIndex;
uniform float uWaterY;
out float vSurface;
out vec3 vN,vRel,vLocal,vColor;
vec3 deform(vec3 p,float part){
  if(uKind<.5&&part>0.5){
    float side=part<1.5?-1.0:1.0;
    float span=abs(p.z),angle=uMotion.x*side;
    // Shoulder downstroke plus delayed wrist flex: the outer wing does not
    // move as a rigid paddle. Primaries subtly spread on the upstroke.
    if(span>.40){
      float outer=side*(span-.40),a=side*uMotion.y;
      float y=p.y;p.y=y*cos(a)+outer*sin(a);p.z=side*.40+outer*cos(a)-y*sin(a);
      p.x-=uMotion.y*.10*smoothstep(.40,.80,span);
    }
    float z=p.z-side*.065,y=p.y;
    p.y=y*cos(angle)+z*sin(angle);p.z=side*.065+z*cos(angle)-y*sin(angle);
  }
  if(uKind>.5){
    float tail=smoothstep(-2.5,-8.5,p.x);
    p.y+=sin(uMotion.z+p.x*.35)*tail*.48;
    if(part>2.5)p.y+=sin(uMotion.z+.9)*abs(p.z)*.055;
  }
  return p;
}
void main(){
  vec3 p=deform(aPos,aAttr.x);
  // Carry the actual deformation into the normals without triangle facets.
  vec3 n=normalize(aNrm),t=normalize(cross(n,abs(n.y)>.9?vec3(1,0,0):vec3(0,1,0))),b=cross(n,t);
  vec3 nn=normalize(cross(deform(aPos+t*.002,aAttr.x)-p,deform(aPos+b*.002,aAttr.x)-p));
  vLocal=aPos;vN=mat3(uModel)*nn;vRel=(uModel*vec4(p,1)).xyz;vColor=aColor;
  if(uKind>.5){
    float h=texelFetch(uAnchors,ivec2(uWhaleIndex,0),0).r;
    vRel.y+=h-uWaterY;vSurface=h;
  }else vSurface=0.0;
  gl_Position=uVP*vec4(vRel,1);
}`;
const FS=`
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in vec3 vN,vRel,vLocal,vColor;
in float vSurface;
uniform float uKind,uMirror,uCamY,uWaterY;
out vec4 o;
void main(){
  if(uMirror>.5&&vRel.y+uCamY<vSurface-.08)discard;
  vec3 N=normalize(vN),V=normalize(-vRel),base=vColor;
  if(!gl_FrontFacing)N=-N;
  float rough=.75;
  if(uKind>.5){
    // Irregular slate mottling, ventral pleats and scars remain attached to
    // the skin, with filtered detail and a wet grazing highlight.
    float m=vnoise(vLocal.xz*1.2+vLocal.y*vec2(2.1,.8));
    float m2=vnoise(vLocal.xy*4.7);
    base*=.72+.28*m+.08*m2;
    float pleat=(.5+.5*sin(vLocal.z*30.0+vLocal.x*.8));
    base*=1.0-.12*pleat*smoothstep(.0,-1.3,vLocal.y)*smoothstep(-2.0,2.0,vLocal.x);
    rough=.23;
  }
  float shadow=cloudShadowAt(vRel.xz);
  vec3 E=lightSun()*max(dot(N,uSunDir),0.0)*shadow+lightMoon()*max(dot(N,uMoonDir),0.0)*shadow;
  vec3 col=base*(ambientFor(N)+E/PI+flashE(N)/PI);
  vec3 R=reflect(-V,N);float fres=.025+.975*pow(1.0-clamp(dot(N,V),0.0,1.0),5.0);
  col+=envRadiance(R,rough*6.0)*fres*(uKind>.5?.8:.07);
  vec3 H=normalize(V+uSunDir);float spec=pow(max(dot(N,H),0.0),uKind>.5?90.0:20.0);
  col+=lightSun()*shadow*spec*(uKind>.5?.12:.003);
  vec3 T=exp(-(RAY_S+(MIE_S+MIE_A)*uHaze)*.001*length(vRel));
  col=col*T+horizonColor(vRel)*(1.0-T);
  o=vec4(max(col,vec3(0)),1);
}`;

const HEIGHT_FS=`
#include <common>
#include <water.uv>
uniform sampler2DArray uDisp;
uniform float uWaterSpacing,uGridN,uMorph,uCurvature;
layout(location=0) out float o;
void main(){
  vec2 dd=vec2(0.0);float h=0.0;
  for(int it=0;it<3;it++){
    vec2 q=-dd;dd=vec2(0.0);h=0.0;
    for(int i=0;i<5;i++){if(i>=uCascades)break;
      float lod=max(log2(uWaterSpacing*(1.0+uMorph)*1.2/(uCasc[i].w/uGridN)),0.0);
      vec4 d=textureLod(uDisp,vec3(cascUV(i,q),float(i)),lod);dd+=toWorld(d.xz,i);h+=d.y;
    }
  }
  o=h-uCurvature;
}`;

const SPRAY_VS=`
layout(location=0) in vec4 aParticle;
uniform mat4 uVP;
uniform vec3 uOrigin;
uniform vec2 uWind;
uniform float uAge,uScale,uPixelScale;
uniform float uBurst;
uniform sampler2D uAnchors;
uniform int uWhaleIndex;
uniform float uWaterY;
out float vAlpha;
out vec3 vRel;
void main(){
  float age=uAge-aParticle.w*.8;
  float life=clamp(age/2.8,0.0,1.0);
  float spread=.20+life*.9;
  vRel=uOrigin+vec3(aParticle.x*spread+uWind.x*age*.18,age*(3.1+aParticle.y*.65)-1.15*age*age,aParticle.z*spread+uWind.y*age*.18);
  if(uBurst>.5){
    vec2 radial=normalize(aParticle.xz+vec2(.0001));
    vRel=uOrigin+vec3(radial.x*(2.2+age*(3.0+aParticle.y*2.5)),age*(5.0+aParticle.y*3.0)-4.9*age*age,radial.y*(2.2+age*(3.0+aParticle.y*2.5)));
  }
  vRel.y+=texelFetch(uAnchors,ivec2(uWhaleIndex,0),0).r-uWaterY;
  vec4 p=uVP*vec4(vRel,1);gl_Position=p;
  gl_PointSize=clamp(uPixelScale*(.045+life*.15)*uScale/max(p.w,.1),1.0,14.0);
  vAlpha=smoothstep(0.0,.12,age)*(1.0-smoothstep(1.0,2.8,age))*.16;
  if(age<0.0||age>2.8||p.w<.1){gl_Position=vec4(2,2,2,1);vAlpha=0.0;}
}`;
const SPRAY_FS=`
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in float vAlpha;
in vec3 vRel;
out vec4 o;
void main(){
  float r=length(gl_PointCoord-.5)*2.0;
  float a=vAlpha*exp(-r*r*4.0)*(1.0-smoothstep(.6,1.0,r));
  vec3 E=lightSky()/PI+lightSun()*cloudShadowAt(vRel.xz)*.25/PI+lightMoon()*.25/PI;
  o=vec4(E,a);
}`;

// Smooth parametric surfaces; normals come from their metric derivatives.
class Mesh {
  constructor(){this.v=[];this.i=[];}
  surface(nu,nv,fn,color,part=0){
    const start=this.v.length/12,eps=.0001;
    for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
      const u=i/nu,v=j/nv,p=fn(u,v),a=fn(Math.min(1,u+eps),v),b=fn(Math.max(0,u-eps),v),c=fn(u,Math.min(1,v+eps)),d=fn(u,Math.max(0,v-eps));
      const x=a.map((q,k)=>q-b[k]),y=c.map((q,k)=>q-d[k]);
      let n=[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]],len=Math.hypot(...n);
      if(len<1e-12){n=[0,1,0];len=1;}
      const col=typeof color==='function'?color(p,u,v):color;
      this.v.push(...p,...n.map(q=>q/len),...col,part,u,v);
    }
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
      const a=start+j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;this.i.push(a,b,c,b,d,c);
    }
  }
  ellipsoid(center,r,col,part=0,nu=24,nv=12){
    this.surface(nu,nv,(u,v)=>{const a=u*Math.PI*2,b=(v-.5)*Math.PI;return [center[0]+r[0]*Math.cos(b)*Math.cos(a),center[1]+r[1]*Math.sin(b),center[2]+r[2]*Math.cos(b)*Math.sin(a)];},col,part);
  }
  upload(){
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.v),gl.STATIC_DRAW);
    for(let k=0;k<4;k++){gl.enableVertexAttribArray(k);gl.vertexAttribPointer(k,3,gl.FLOAT,false,48,k*12);}
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(this.i),gl.STATIC_DRAW);
    return {vao,count:this.i.length,vertices:this.v.length/12};
  }
}
function gullMesh(){
  const m=new Mesh(),white=[.76,.77,.74],grey=[.39,.43,.45],dark=[.012,.018,.02];
  m.ellipsoid([0,0,0],[.32,.105,.105],p=>p[1]>.035?grey:white);
  m.ellipsoid([.24,.055,0],[.11,.10,.088],white);
  m.surface(14,10,(u,v)=>{const a=v*Math.PI*2,r=.025*Math.pow(1-u,.6);return [.31+u*.16,.035-u*u*.016+Math.sin(a)*r*.65,Math.cos(a)*r];},[.64,.39,.055]);
  for(const side of [-1,1]){
    m.ellipsoid([.29,.078,side*.073],[.018,.019,.008],dark,0,10,6);
    for(const top of [-1,1])m.surface(38,10,(u,v)=>{
      const z=.065+u*.73,chord=.33*Math.pow(1-u,.65)+.012;
      const lead=.10-.36*u*u,feather=.014*Math.sin(u*110)*Math.pow(u,2);
      return [lead-chord*v+feather*v,top*(.004+.024*Math.sin(Math.PI*v)*(1-u))-.035*u,side*z];
    },(p,u,v)=>u>.75?dark:top>0?grey:white,side<0?1:2);
    m.surface(10,6,(u,v)=>[-.27-u*.21,.015-v*.01,side*(.04+u*.095)*(v*.7+.3)],white);
    // Feet trail under the tail rather than resembling extra wings.
    m.ellipsoid([-.19,-.095,side*.035],[.048,.012,.017],[.50,.25,.08],0,10,6);
  }
  return m.upload();
}
function whaleProfile(u){
  let x=-8+u*(12.8/.78);
  const body=Math.min(u,.78),shape=Math.pow(Math.max(0,Math.sin(Math.PI*body/.78*.82)),.8);
  let width=shape*(.4+1.8*Math.pow(body,.7)),depth=shape*(.65+1.45*Math.pow(body,.6));
  if(u>.78){const t=(u-.78)/.22,cap=t*Math.PI*.5;x=4.8+2.0*Math.sin(cap);width*=Math.cos(cap);depth*=Math.cos(cap)*(1-.17*t*t*(3-2*t));}
  return {x,width,depth,center:.12*Math.sin(u*Math.PI)};
}
function whaleProfileAtX(x){return whaleProfile(x<=4.8?(x+8)/12.8*.78:.78+Math.asin(Math.max(0,Math.min(1,(x-4.8)/2)))/(Math.PI*.5)*.22);}
function whaleMesh(){
  const m=new Mesh(),slate=[.022,.031,.037],pale=[.37,.40,.38];
  // Tail peduncle, broad shoulders, flattened rostrum. Both ends close.
  m.surface(92,40,(u,v)=>{
    const {x,width,depth,center}=whaleProfile(u),a=v*Math.PI*2;
    return [x,Math.sin(a)*depth+center,Math.cos(a)*width];
  },p=>p[1]<-.7?[.18,.21,.20]:slate);
  for(const side of [-1,1]){
    for(const top of [-1,1]){
      m.surface(30,12,(u,v)=>{
        const chord=1.8*Math.sin(Math.PI*(.08+u*.88));
        return [-6.65-u*.52-chord*v,top*.08*Math.sin(Math.PI*v)*(1-u)+.12*u*u,side*(.16+u*3.1)];
      },top<0?pale:slate,1);
      m.surface(30,10,(u,v)=>{
        const width=.95*Math.pow(1-u,.6)+.03;
        return [2.15-u*3.5-width*v,-.45-u*.8+top*.10*Math.sin(Math.PI*v)*(1-u),side*(1.28+u*3.7)];
      },top<0?pale:slate,3);
    }
    const eye=whaleProfileAtX(5.1),ey=.27,ez=eye.width*Math.sqrt(1-Math.pow((ey-eye.center)/eye.depth,2));
    m.ellipsoid([5.1,ey,side*(ez+.018)],[.095,.07,.028],[.008,.010,.011],0,12,8);
    for(let j=0;j<9;j++){
      const x=3.5+j*.33,q=whaleProfileAtX(x),z=side*q.width*(.52-j*.025),y=q.center+q.depth*Math.sqrt(1-Math.pow(z/q.width,2))+.012;
      m.ellipsoid([x,y,z],[.10,.042,.065],[.10,.12,.12],0,10,6);
    }
    m.surface(18,8,(u,v)=>{const x=-2.25-u*1.5,q=whaleProfileAtX(x);return [x,q.center+q.depth+Math.sin(Math.PI*u)*.83*(1-v),side*.075*v];},slate);
  }
  return m.upload();
}
function pose(x,y,z,yaw,pitch,roll,size,cam){
  const c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);
  const bow=[c*cp,sp,s*cp],up0=[-c*sp,cp,-s*sp],side0=[-s,0,c];
  const up=up0.map((v,k)=>v*cr+side0[k]*sr),side=side0.map((v,k)=>v*cr-up0[k]*sr);
  return new Float32Array([...bow.map(v=>v*size),0,...up.map(v=>v*size),0,...side.map(v=>v*size),0,x-cam.x,y-cam.y,z-cam.z,1]);
}
export class Wildlife {
  constructor(){
    this.motion=new WildlifeMotion();this.gulls=this.motion.gulls;this.whales=this.motion.whales;
    this.prog=new Program('wildlife.skin',VS,FS);this.gull=gullMesh();this.whale=whaleMesh();
    this.anchors=tex2D(2,1,{fmt:'r32f',filter:'nearest'});this.anchorFbo=makeFBO([this.anchors]);
    this.heightProg=new Program('wildlife.surface',FS_VERT,HEIGHT_FS);
    this.sprayProg=new Program('wildlife.breath',SPRAY_VS,SPRAY_FS);
    this.sprayVao=gl.createVertexArray();gl.bindVertexArray(this.sprayVao);
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    const particles=[];let seed=17231;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
    for(let i=0;i<384;i++)particles.push((rand()-.5)*1.7,rand(),(rand()-.5)*1.7,rand());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(particles),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);
  }
  update(dt,yacht,env){this.motion.update(dt,yacht,env);}
  feed(probe){this.motion.feed(probe);}
  probePoints(){return this.motion.probePoints();}
  rings(cam){return this.motion.rings(cam);}
  contacts(cam){return this.motion.contacts(cam);}
  updateSurface(ctx){
    // Two pixels evaluate the current warped/filtered water once per frame.
    // Both animal passes and all spray reuse those heights, avoiding hundreds
    // of thousands of repeated FFT texture reads on phone GPUs.
    bindFBO(this.anchorFbo);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(false);
    const p=this.heightProg.use().t('uDisp',8,ctx.sim.disp).i('uCascades',ctx.sim.count).f('uGridN',ctx.sim.N);
    for(const [i,w] of this.whales.entries()){
      const {scale,off}=ctx.sim.cascadeUniforms(w.x,w.z);
      const dx=w.x-ctx.cam.x,dz=w.z-ctx.cam.z,distance=Math.max(Math.abs(dx),Math.abs(dz));
      const spacing=.2*Math.pow(2,Math.max(0,Math.ceil(Math.log2(Math.max(distance,1)/9.6))));
      const edge=distance/(48*spacing),k=Math.max(0,Math.min(1,(edge-.72)/.28));
      p.v4v('uCasc',scale).v2v('uCen',off).f('uWaterSpacing',spacing).f('uMorph',k*k*(3-2*k)).f('uCurvature',(dx*dx+dz*dz)/(2*6371000));
      if(ctx.sim.count>1)p.v2('uNoiseOrg',scale[5]*w.x+scale[6]*w.z,-scale[6]*w.x+scale[5]*w.z);
      gl.viewport(i,0,1,1);drawFS();
    }
  }
  draw(ctx,VP,camAbs,mirror=false){
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.depthMask(true);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);
    const p=this.prog.use();bindLighting(p,ctx);p.m4('uVP',VP).f('uMirror',mirror?1:0).f('uCamY',ctx.cam.y).t('uAnchors',6,this.anchors);
    if(!ctx.under){
      gl.bindVertexArray(this.gull.vao);p.f('uKind',0).f('uWaterY',0);
      for(const g of this.gulls){
        p.m4('uModel',pose(g.x,g.y,g.z,g.yaw,.015*Math.sin(g.phase),g.bank,g.size,ctx.cam)).v4('uMotion',g.flap,g.fold,0,0);
        gl.drawElements(gl.TRIANGLES,this.gull.count,gl.UNSIGNED_INT,0);
      }
    }
    gl.bindVertexArray(this.whale.vao);p.f('uKind',1);
    for(const [i,w] of this.whales.entries()){
      if(w.surface<.001&&!ctx.under)continue;
      p.i('uWhaleIndex',i).f('uWaterY',w.waterY).m4('uModel',pose(w.x,w.y,w.z,w.yaw,w.pitch,w.roll,w.size,ctx.cam)).v4('uMotion',0,0,w.phase,0);
      gl.drawElements(gl.TRIANGLES,this.whale.count,gl.UNSIGNED_INT,0);
    }
  }
  drawSpray(ctx,VP){
    if(ctx.under)return;
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.enable(gl.DEPTH_TEST);
    const p=this.sprayProg.use();bindLighting(p,ctx);p.m4('uVP',VP).t('uAnchors',6,this.anchors).f('uPixelScale',ctx.h/(2*Math.tan(ctx.cam.fov*.5))).v2('uWind',Math.cos(ctx.windDir)*ctx.sim.cur.U,Math.sin(ctx.windDir)*ctx.sim.cur.U);
    gl.bindVertexArray(this.sprayVao);
    for(const [i,w] of this.whales.entries()){
      p.i('uWhaleIndex',i).f('uWaterY',w.waterY);
      if(w.age>=6&&w.age<=10.5){
        p.v3('uOrigin',w.x+Math.cos(w.yaw)*4.6-ctx.cam.x,w.waterY+.18-ctx.cam.y,w.z+Math.sin(w.yaw)*4.6-ctx.cam.z).f('uAge',w.age-6).f('uScale',w.size).f('uBurst',0);
        gl.drawArrays(gl.POINTS,0,384);
      }
      if(w.events%3===2&&w.age>=w.impact&&w.age<w.impact+3.5){
        const origin=w.ringOrigin||[w.x,w.z];
        p.v3('uOrigin',origin[0]-ctx.cam.x,w.waterY+.08-ctx.cam.y,origin[1]-ctx.cam.z).f('uAge',w.age-w.impact).f('uScale',w.size).f('uBurst',1);
        gl.drawArrays(gl.POINTS,0,384);
      }
    }
    gl.depthMask(true);gl.disable(gl.BLEND);
  }
}
