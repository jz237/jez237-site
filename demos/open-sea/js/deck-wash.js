// Conservative, well-balanced shallow water on the moving schooner's deck.
// Hydrostatic reconstruction preserves resting puddles on its sheer/camber.
// Fixed CFL-safe steps keep a slow frame from launching the water into the sky.
import {gl,Program,FS_VERT,tex2D,makeFBO,bindFBO,drawFS,defineChunk} from './gl.js';
import {sheer,halfBeam} from './yacht-geo.js';
import {bindLighting} from './lighting.js';

export const DECK_WASH_GLSL=`
float deckBeam(float x){return x>=-2.0?4.65*pow(max(0.0,1.0-pow(max(0.0,(x+2.0)/25.5),2.1)),.7):4.65*(1.0-.4*pow(clamp((-2.0-x)/21.5,0.0,1.0),2.4));}
float deckFloor(vec2 p){float b=max(deckBeam(p.x)*.995,.1);return 2.6+(p.x>0.0?.0018:.0007)*p.x*p.x+.055*(1.0-p.y*p.y/(b*b));}
bool deckFootprint(vec2 p){return abs(p.x)<23.35&&abs(p.y)<deckBeam(p.x)*.992;}
vec4 washSample(sampler2D source,vec2 uv){
 vec2 pixel=clamp(uv*vec2(128,32)-.5,vec2(0),vec2(127,31));
 ivec2 p=ivec2(floor(pixel)),b=min(p+1,ivec2(127,31));vec2 f=fract(pixel);
 return mix(mix(texelFetch(source,p,0),texelFetch(source,ivec2(b.x,p.y),0),f.x),
   mix(texelFetch(source,ivec2(p.x,b.y),0),texelFetch(source,b,0),f.x),f.y);
}
`;
defineChunk('deck-wash',DECK_WASH_GLSL);
const W=128,H=32,DX=48/W,DZ=10/H,STEP=1/120;

const SOLVER=`
in vec2 vUv;
uniform sampler2D uState,uTerrain,uSea;
uniform vec2 uGravity;
uniform float uG,uDt,uRain,uSeaOn;
out vec4 o;
const vec2 cell=vec2(${DX},${DZ});
const ivec2 size=ivec2(${W},${H});
vec4 ground(ivec2 p){return texelFetch(uTerrain,clamp(p,ivec2(0),size-1),0);}
vec4 state(ivec2 p){return texelFetch(uState,clamp(p,ivec2(0),size-1),0);}
// Terrain channels: floor elevation, wettable cell, solid wall, open edge.
vec3 neighbour(ivec2 p,vec3 c,vec4 gc,vec2 axis,out float bed){
 vec4 gn=ground(p);bed=gn.r;
 if(gn.b>.5){bed=gc.r;return vec3(c.x,c.yz-2.0*axis*dot(c.yz,axis));}
 if(gn.g<.5){
   bed=gc.r;
   float sea=texture(uSea,(vec2(p)+.5)/vec2(size)).r;
   return vec3(uSeaOn*clamp(sea-bed,0.0,1.2),0,0);
 }
 return state(p).xyz;
}
vec3 physical(vec3 q,vec2 axis){
 float v=q.x>.00001?dot(q.yz,axis)/q.x:0.0;
 return vec3(q.x*v,q.yz*v+axis*(.5*uG*q.x*q.x));
}
vec3 flux(vec3 a,vec3 b,float ba,float bb,vec2 axis){
 float bed=max(ba,bb),ha=max(0.0,a.x+ba-bed),hb=max(0.0,b.x+bb-bed);
 vec3 ar=vec3(ha,a.yz*(ha/max(a.x,.00001))),br=vec3(hb,b.yz*(hb/max(b.x,.00001)));
 float va=ha>.00001?dot(ar.yz,axis)/ha:0.0,vb=hb>.00001?dot(br.yz,axis)/hb:0.0;
 float s=max(abs(va)+sqrt(uG*ha),abs(vb)+sqrt(uG*hb));
 return .5*(physical(ar,axis)+physical(br,axis)-s*(br-ar))
   +vec3(0,axis*(.5*uG*(a.x*a.x-ha*ha)));
}
void main(){
 ivec2 p=ivec2(gl_FragCoord.xy);vec4 g=ground(p),old=state(p);
 if(g.g<.5||g.b>.5){o=vec4(0);return;}
 vec3 c=old.xyz;float b;
 vec3 r=neighbour(p+ivec2(1,0),c,g,vec2(1,0),b);vec3 fr=flux(c,r,g.r,b,vec2(1,0));
 vec3 l=neighbour(p-ivec2(1,0),c,g,vec2(-1,0),b);vec3 fl=flux(c,l,g.r,b,vec2(-1,0));
 vec3 t=neighbour(p+ivec2(0,1),c,g,vec2(0,1),b);vec3 ft=flux(c,t,g.r,b,vec2(0,1));
 vec3 d=neighbour(p-ivec2(0,1),c,g,vec2(0,-1),b);vec3 fd=flux(c,d,g.r,b,vec2(0,-1));
 vec3 q=c-uDt*((fr+fl)/cell.x+(ft+fd)/cell.y);
 q.x=max(q.x,0.0)+uRain*.00002*uDt;
 q.yz+=uGravity*q.x*uDt;
 // Bed drag damps momentum, not volume. Dry cells retain no spurious velocity.
 float h=max(q.x,.00001),speed=length(q.yz)/h;
 q.yz/=1.0+uDt*(.8+1.6*speed/max(sqrt(h),.06));
 if(q.x<.00002)q.yz=vec2(0);
 else q.yz*=min(1.0,4.0/max(length(q.yz)/h,.0001));
 // Inlet reservoirs are capped at 1.2 m; this final guard is never reached in
 // normal operation and bounds deliberately corrupted/test state as well.
 if(q.x>1.5){q.yz*=1.5/q.x;q.x=1.5;}
 float wet=max(old.w*exp(-uDt/18.0),smoothstep(.00001,.001,q.x));
 o=vec4(q,wet);
}`;

const VS=`
#include <deck-wash>
layout(location=0)in vec2 aPos;
uniform sampler2D uState,uTerrain;
uniform mat4 uModel,uVP;
out vec3 vRel,vLocal;
void main(){
 vec2 uv=aPos/vec2(48,10)+.5;
 vec4 q=washSample(uState,uv),g=washSample(uTerrain,uv);
 float floorY=max(deckFloor(aPos),g.r);
 vLocal=vec3(aPos.x,floorY+q.x+.003,aPos.y);
 vRel=(uModel*vec4(vLocal,1)).xyz;gl_Position=uVP*vec4(vRel,1);
}`;
const FS=`
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <deck-wash>
uniform sampler2D uState,uTerrain,uScene;
uniform vec2 uRes;
uniform mat4 uModel;
uniform float uTime;
in vec3 vRel,vLocal;
out vec4 o;
void main(){
 vec2 uv=vLocal.xz/vec2(48,10)+.5;
 vec4 q=washSample(uState,uv),g=texture(uTerrain,uv);
 vec2 tx=vec2(1.0/${W}.0,0),tz=vec2(0,1.0/${H}.0);
 float hx=(washSample(uState,uv+tx).r-washSample(uState,uv-tx).r)/(2.0*${DX});
 float hz=(washSample(uState,uv+tz).r-washSample(uState,uv-tz).r)/(2.0*${DZ});
 vec3 surface=cross(dFdx(vRel),dFdy(vRel));
 vec3 baseN=normalize(mat3(uModel)*vec3(0,1,0));
 float normalSq=dot(surface,surface);
 vec3 N=normalSq>1e-20?surface*inversesqrt(max(normalSq,1e-20)):baseN;
 if(dot(N,baseN)<0.0)N=-N;
 vec2 velocity=q.yz/max(q.x,.00001);
 float micro=.012*sin(dot(vLocal.xz,vec2(7.0,13.0))-uTime*(2.0+length(velocity)));
 N=normalize(N+mat3(uModel)*vec3(-hx*.25+micro,0,-hz*.25-micro));
 vec3 V=normalize(-vRel);
 if(q.x<.0015||g.g<.99||g.b>.01||!deckFootprint(vLocal.xz))discard;
 vec2 pixel=gl_FragCoord.xy/uRes;
 // A clear, centimetre-deep film preserves the planks underneath. Absorption
 // depends on depth; there is no opaque pale-blue layer over the deck.
 vec3 under=texture(uScene,clamp(pixel+N.xz*min(q.x,.06)*.002,vec2(0),vec2(1))).rgb;
 vec3 R=reflect(-V,N);float f=.0204+.9796*pow(1.0-clamp(dot(N,V),0.0,1.0),5.0);
 vec3 col=under*exp(-q.x*vec3(.45,.16,.09))*(1.0-f)+envRadiance(vec3(R.x,max(R.y,.02),R.z),.5)*f;
 float sun=yachtShadowWorld(vRel,N,true),moon=yachtShadowWorld(vRel,N,false);
 vec3 Hs=normalize(V+uSunDir),Hm=normalize(V+uMoonDir);
 col+=(lightSun()*sun*pow(max(dot(N,Hs),0.0),600.0)+lightMoon()*moon*pow(max(dot(N,Hm),0.0),600.0))*cloudShadowAt(vRel.xz)*.15;
 float turbulence=smoothstep(.8,2.8,length(velocity))*smoothstep(.01,.06,q.x);
 float foam=turbulence*smoothstep(.76,.9,vnoise(vLocal.xz*12.0-velocity*uTime*.7))*.10;
 col=mix(col,lightSky()*.30,foam);
 o=vec4(col,1);
}`;

export class DeckWash {
  constructor(metadata){
    this.N=[W,H];this.acc=0;this.steps=0;this.inlet=true;
    const data=new Float32Array(W*H*4),obstacles=metadata.deck?.obstacles||[],surfaces=metadata.deck?.surfaces||[];
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){
      const x=(i+.5)*DX-24,z=(j+.5)*DZ-5,b=halfBeam(x)*.992;
      const inside=Math.abs(x)<23.35&&Math.abs(z)<b;
      let bed=sheer(x)+.055*(1-(z/Math.max(b,.1))**2),solid=false;
      for(const a of surfaces)if(Math.abs(x-a.x)<=a.halfX&&Math.abs(z-a.z)<=a.halfZ)bed=Math.max(bed,a.height);
      for(const a of obstacles){
        // The suspended tender does not block water on the deck underneath.
        if(a.name==='Suspended tender')continue;
        if(a.type==='circle'?Math.hypot(x-a.x,z-a.z)<a.radius:Math.abs(x-a.x)<a.halfX&&Math.abs(z-a.z)<a.halfZ)solid=true;
      }
      const edge=inside&&Math.abs(z)>b-.38;
      const scupper=Math.abs(((x+24)%3)-1.5)<.22;
      if(edge&&!scupper)bed+=.10;
      const k=(j*W+i)*4;data.set([bed,inside?1:0,solid?1:0,edge?1:0],k);
    }
    this.terrain=tex2D(W,H,{fmt:'rgba32f',filter:'nearest',data,dataType:gl.FLOAT});
    this.a=tex2D(W,H,{fmt:'rgba32f',filter:'nearest'});this.b=tex2D(W,H,{fmt:'rgba32f',filter:'nearest'});
    this.fa=makeFBO([this.a]);this.fb=makeFBO([this.b]);this.cur=this.a;this.other=this.b;this.curF=this.fa;this.otherF=this.fb;
    for(const f of [this.fa,this.fb]){bindFBO(f);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}
    this.solver=new Program('deck.wash.solver',FS_VERT,SOLVER);
    this.prog=new Program('deck.wash.surface',VS,FS);
    const verts=[],idx=[];
    for(let j=0;j<=H*2;j++)for(let i=0;i<=W*2;i++)verts.push(i*DX/2-24,j*DZ/2-5);
    const stride=W*2+1;
    for(let j=0;j<H*2;j++)for(let i=0;i<W*2;i++){const k=j*stride+i;idx.push(k,k+stride,k+1,k+1,k+stride,k+stride+1);}
    this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(idx),gl.STATIC_DRAW);
    this.count=idx.length;gl.bindVertexArray(null);
  }
  update(ctx,yacht,dt){
    this.acc+=Math.max(0,Math.min(dt,.1));let n=0;
    while(this.acc+1e-9>=STEP&&n<12){
      this.acc=Math.max(0,this.acc-STEP);n++;this.steps++;
      bindFBO(this.otherF);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
      this.solver.use().t('uState',0,this.cur).t('uTerrain',1,this.terrain).t('uSea',2,ctx.hullWet)
        .v2('uGravity',-9.81*yacht.axes.bow[1],-9.81*yacht.axes.sb[1])
        .f('uG',9.81*Math.max(yacht.axes.up[1],.2)).f('uDt',STEP).f('uRain',ctx.rain||0).f('uSeaOn',this.inlet?1:0);
      drawFS();[this.cur,this.other]=[this.other,this.cur];[this.curF,this.otherF]=[this.otherF,this.curF];
    }
  }
  draw(ctx,yacht,VP,scene){
    const M=new Float32Array(yacht.M);M[12]=yacht.x-ctx.cam.x;M[13]=yacht.y-ctx.cam.y;M[14]=yacht.z-ctx.cam.z;
    const p=this.prog.use().m4('uModel',M).m4('uVP',VP).t('uState',4,this.cur).t('uTerrain',3,this.terrain).t('uScene',5,scene).v2('uRes',ctx.w,ctx.h).f('uTime',ctx.time);
    bindLighting(p,ctx);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);
    gl.bindVertexArray(this.vao);gl.drawElements(gl.TRIANGLES,this.count,gl.UNSIGNED_INT,0);
  }
}
