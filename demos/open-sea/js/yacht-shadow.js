import {vessel,SX,SY,SZ,imperial} from './vessels.js';
// A boat-local directional depth map: all receivers and moving cloth use the
// same pose. Projected water shadows can extend well beyond the hull at sunset.
import {gl,Program,tex2D,depthTex,makeFBO,bindFBO} from './gl.js';
import {m4,v3} from './math.js';
import {YACHT_VS,RIG_VS} from './yacht.js';

export class YachtShadow {
  constructor(size=2048){
    this.size=size;
    this.depth=depthTex(size,size);
    this.opaque=depthTex(size,size);
    this.color=tex2D(size,size,{fmt:'rgba32f',filter:'nearest'});
    this.secondColor=tex2D(size,size,{fmt:'rgba32f',filter:'nearest'});
    this.secondDepth=depthTex(size,size);
    this.fbo=makeFBO([this.color],this.depth);
    this.secondFbo=makeFBO([this.secondColor],this.secondDepth);
    this.opaqueFbo=makeFBO([this.color],this.opaque);
    const fs=`in vec4 vAttr;uniform float uOpacity,uTexelMetres,uPeel,uPeelBias;uniform int uCurrentSail;uniform sampler2D uFirstLayer;out vec4 o;
      void main(){float id=float(uCurrentSail+1);
      if(uPeel>.5){vec4 first=texelFetch(uFirstLayer,ivec2(gl_FragCoord.xy),0);if(gl_FragCoord.z<=first.r+uPeelBias||first.b==id)discard;}
      float coverage=vAttr.w>0.0&&vAttr.w<.065?clamp(2.0*vAttr.w/uTexelMetres,0.0,1.0):1.0;o=vec4(gl_FragCoord.z,uOpacity*coverage,id,1);}`;
    this.hull=new Program('yacht.shadow.solid',YACHT_VS,fs);
    this.sail=new Program('yacht.shadow.cloth',YACHT_VS,fs,'SAIL');
    this.rig=new Program('yacht.shadow.rig',RIG_VS,`
      flat in vec4 vLine;flat in float vDiameterScale;uniform vec2 uViewport;
      uniform float uPeel,uPeelBias;uniform sampler2D uFirstLayer;out vec4 o;
      void main(){
        vec2 a=(vLine.xy*.5+.5)*uViewport,b=(vLine.zw*.5+.5)*uViewport,d=b-a;
        float t=clamp(dot(gl_FragCoord.xy-a,d)/max(dot(d,d),.0001),0.0,1.0);
        float distanceToLine=length(gl_FragCoord.xy-a-t*d);
        float diameter=vDiameterScale,radius=max(diameter,1.0)*.5;
        float coverage=(1.0-smoothstep(radius-.5,radius+.5,distanceToLine))*min(diameter,1.0);
        if(coverage<.001)discard;
        if(uPeel>.5){vec4 first=texelFetch(uFirstLayer,ivec2(gl_FragCoord.xy),0);if(gl_FragCoord.z<=first.r+uPeelBias||first.b==0.0)discard;}
        o=vec4(gl_FragCoord.z,coverage,0.0,1.0);
      }`);
    this.on=false;this.matrix=m4.ident();
  }
  update(ctx,yacht){
    this.sun=ctx.useSun;
    const world=this.sun?ctx.sk.sunDir:ctx.sk.moonDir;
    this.on=world[1]>.015;
    if(!this.on)return;
    const L=v3.norm(yacht.toLocalDir(world));
    const R=v3.norm(v3.cross(Math.abs(L[1])>.97?[1,0,0]:[0,1,0],L));
    const U=v3.cross(L,R),points=[];
    for(const x of [imperial?-56:-27,imperial?71:27])for(const y of [imperial?-8:-7,imperial?59:40])for(const z of [imperial?-18:-6,imperial?18:6])points.push([x,y,z]);
    const bounds=axis=>{
      const p=points.map(v=>v3.dot(axis,v));
      return [Math.min(...p)-1,Math.max(...p)+1];
    };
    const [xl,xh]=bounds(R),[yl,yh]=bounds(U),[zl,zh]=bounds(L);
    // Only depth range grows at low light angles; lateral resolution remains
    // concentrated on the silhouette instead of a huge square of empty sea.
    const low=zl-(imperial?70:45)/Math.max(world[1],.015),high=zh+2;
    const sx=2/(xh-xl),sy=2/(yh-yl),sz=-2/(high-low);
    this.matrix=new Float32Array([
      R[0]*sx,U[0]*sy,L[0]*sz,0,R[1]*sx,U[1]*sy,L[1]*sz,0,
      R[2]*sx,U[2]*sy,L[2]*sz,0,-(xh+xl)/(xh-xl),-(yh+yl)/(yh-yl),(high+low)/(high-low),1,
    ]);
    this.depthRange=high-low;
    this.texelMetres=Math.max(xh-xl,yh-yl)/this.size;
    bindFBO(this.opaqueFbo);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);gl.depthFunc(gl.LESS);gl.disable(gl.CULL_FACE);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    this.hull.use().f('uOpacity',1).f('uTexelMetres',this.texelMetres).f('uPeel',0).t('uFirstLayer',0,this.secondColor);
    this.sail.use().f('uOpacity',.62).f('uTexelMetres',this.texelMetres).f('uPeel',0).t('uFirstLayer',0,this.secondColor);
    this.rig.use().v2('uViewport',this.size,this.size).f('uPixelScale',1/this.texelMetres).f('uPeel',0).t('uFirstLayer',0,this.secondColor);
    yacht.drawShadow(this.matrix,this.hull,this.sail,ctx.time,true,this.rig);
    // The closest translucent sail/rope must never reveal a solid cabin
    // farther down the same ray. Keep opaque blockers in their own depth map.
    bindFBO(this.fbo);gl.clearColor(1,0,-1,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    yacht.drawShadow(this.matrix,this.hull,this.sail,ctx.time,false,this.rig);
    // Peel the next distinct cloth/rope group, then pack depth, opacity and
    // identity into each layer. Receivers still use only three samplers.
    bindFBO(this.secondFbo);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    for(const p of [this.hull,this.sail,this.rig])p.use().f('uPeel',1).f('uPeelBias',.006/this.depthRange).t('uFirstLayer',0,this.color);
    yacht.drawShadow(this.matrix,this.hull,this.sail,ctx.time,false,this.rig);
  }
}
