import * as T from '../aquaclear-studio/vendor/three.module.js';

// The aquarium reflects the actual filter. A separate depth capture lets the
// falling sheet bend the scene behind it, without displacing foreground parts.
export function createWaterOptics(renderer,scene,camera,water){
 const options={type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,minFilter:T.LinearFilter,magFilter:T.LinearFilter};
 const behind=new T.WebGLRenderTarget(1,1,options),reflected=new T.WebGLRenderTarget(1,1,options);
 behind.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);reflected.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
 const mirror=new T.PerspectiveCamera(),size=new T.Vector2(),up=new T.Vector3(0,1,0),look=new T.Vector3(),plane=new T.Plane(),clip=new T.Vector4(),q=new T.Vector4();
 const textureMatrix=new T.Matrix4(),bias=new T.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
 const uniforms={sceneTexture:{value:behind.texture},sceneDepth:{value:behind.depthTexture},reflectionTexture:{value:reflected.texture},reflectionDepth:{value:reflected.depthTexture},reflectionMatrix:{value:textureMatrix},reflectionWeight:{value:1},waterTime:{value:0},delivery:{value:1},impactZ:{value:2.1}};
 function material(kind){return new T.ShaderMaterial({uniforms:{...uniforms,kind:{value:kind}},transparent:true,depthWrite:false,side:T.DoubleSide,
 vertexShader:`varying vec3 wPoint,wNormal;varying vec4 projected,reflectedPoint;varying vec2 waterUV;uniform mat4 reflectionMatrix;
 void main(){vec4 world=modelMatrix*vec4(position,1.);wPoint=world.xyz;wNormal=normalize(mat3(modelMatrix)*normal);waterUV=uv;projected=projectionMatrix*viewMatrix*world;reflectedPoint=reflectionMatrix*world;gl_Position=projected;}`,
 fragmentShader:`uniform sampler2D sceneTexture,sceneDepth,reflectionTexture,reflectionDepth;uniform float kind,waterTime,delivery,impactZ,reflectionWeight;
 varying vec3 wPoint,wNormal;varying vec4 projected,reflectedPoint;varying vec2 waterUV;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 float height(vec2 p){float t=waterTime;return noise(p*10.+vec2(t*.27,-t*.46))*.52+noise(p*23.+vec2(-t*.39,t*.14))*.22+noise(p*47.+vec2(t*.31,t*.53))*.09;}
 void main(){bool sheet=kind>.5&&kind<1.5;float v=1.-waterUV.y;vec3 N=normalize(wNormal),V=normalize(cameraPosition-wPoint);if(dot(N,V)<0.)N=-N;
   float dx=max(abs(wPoint.x-.35)-.95*min(1.,sqrt(delivery/.35)),0.);float radius=length(vec2(dx,(wPoint.z-impactZ)*1.15));float agitation=exp(-radius*2.8)*delivery;
   vec2 p=sheet?vec2(waterUV.x*2.2,v*.55-waterTime*.26):wPoint.xz;
   float h=height(p),hx=height(p+vec2(.006,0.))-h,hy=height(p+vec2(0.,.006))-h;
   vec3 dp1=dFdx(wPoint),dp2=dFdy(wPoint),r1=cross(dp2,N),r2=cross(N,dp1);float det=dot(dp1,r1);
   float strength=sheet?.016:(.008+.018*agitation);float relief=h*strength;
   N=normalize(abs(det)*N-sign(det)*(dFdx(relief)*r1+dFdy(relief)*r2));
   float cosine=abs(dot(N,V)),fresnel=.0204+.9796*pow(1.-cosine,5.);vec3 viewN=mat3(viewMatrix)*N;
   vec2 screenUV=projected.xy/projected.w*.5+.5;
   vec2 bend=viewN.xy*(sheet?.009:.014)+vec2(hx,hy)*(sheet?.05:.10);
   vec2 refractUV=clamp(screenUV+bend,vec2(.002),vec2(.998));if(texture2D(sceneDepth,refractUV).r<gl_FragCoord.z-.0001)refractUV=screenUV;
   vec4 transmitted=texture2D(sceneTexture,refractUV);transmitted.a*=1.-step(.99999,texture2D(sceneDepth,refractUV).r);
   vec2 reflectUV=reflectedPoint.xy/reflectedPoint.w+N.xz*.024+vec2(hx,hy)*.035;
   vec4 reflection=texture2D(reflectionTexture,clamp(reflectUV,vec2(.002),vec2(.998)));reflection.a*=1.-step(.99999,texture2D(reflectionDepth,clamp(reflectUV,vec2(.002),vec2(.998))).r);
   float valid=step(0.,reflectUV.x)*step(reflectUV.x,1.)*step(0.,reflectUV.y)*step(reflectUV.y,1.)*reflectionWeight*(kind<.5?1.:0.);
   float reflectance=min(.88,fresnel)*valid,coverage=mix(transmitted.a,reflection.a,reflectance);
   vec3 color=mix(transmitted.rgb*transmitted.a,reflection.rgb*reflection.a,reflectance);
   // Broad studio softboxes and a narrow key glint break up with the normals.
   vec3 R=reflect(-V,N);float softbox=pow(max(dot(R,normalize(vec3(-.45,.8,.42))),0.),65.);float key=pow(max(dot(N,normalize(V+normalize(vec3(-.45,1.,.65)))),0.),210.);
   float side=1.-smoothstep(0.,.018,min(waterUV.x,1.-waterUV.x));
   float lip=exp(-pow((v-.52)/.021,2.));float streak=pow(noise(vec2(waterUV.x*93.+sin(v*8.-waterTime*1.5)*.6,v*6.-waterTime*2.7)),5.);
   float gleam=sheet?(.12*side+.17*lip+.3*streak*smoothstep(.4,.65,v)):.035*agitation;
   float visibility=sheet?.10+gleam:.045+.10*fresnel;
   vec3 tint=vec3(.075,.18,.19)+vec3(.28,.36,.35)*gleam;
   float alpha=coverage*(1.-visibility)+visibility;color=(color*(1.-visibility)+tint*visibility)/max(alpha,.001);
   color+=vec3(.81,.92,.88)*(softbox*(.07+.34*fresnel)+key*.7+gleam*.17);
   float edge=1.;if(sheet){float ragged=(noise(vec2(v*48.-waterTime*2.,waterTime*.4))-.25)*.006*smoothstep(.52,.8,v);edge=smoothstep(ragged,ragged+.003,min(waterUV.x,1.-waterUV.x));}else{edge=smoothstep(0.,.008,min(min(waterUV.x,1.-waterUV.x),min(waterUV.y,1.-waterUV.y)));}
   gl_FragColor=vec4(color,edge*clamp(alpha+key*.15+softbox*.08,0.,1.));
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
 }`});}
 water.surface.material.dispose();water.surface.material=material(0);water.sheet.material=material(1);water.chamber.material=material(2);
 let captures=0,lastSize=[0,0];
 function capture(){
  if(!water.group.visible||!water.captureGroup.visible||!water.captureGroup.parent.visible)return;
  renderer.getSize(size);const scale=size.x<760?.5:.72,w=Math.min(1100,Math.max(1,Math.round(size.x*scale))),h=Math.max(1,Math.round(w*size.y/size.x));
  if(behind.width!==w||behind.height!==h){behind.setSize(w,h);reflected.setSize(w,h);lastSize=[w,h];}const s=water.snapshot();uniforms.waterTime.value=s.time;uniforms.delivery.value=s.delivery;uniforms.impactZ.value=s.impactZ;
  const level=water.surface.position.y;camera.updateMatrixWorld();mirror.copy(camera);mirror.position.y=2*level-camera.position.y;camera.getWorldDirection(look);look.reflect(up);mirror.up.copy(camera.up).reflect(up);mirror.lookAt(mirror.position.clone().add(look));mirror.updateMatrixWorld();
  textureMatrix.copy(bias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
  plane.set(up,-level).applyMatrix4(mirror.matrixWorldInverse);clip.set(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant);const p=mirror.projectionMatrix.elements;
  q.set((Math.sign(clip.x)+p[8])/p[0],(Math.sign(clip.y)+p[9])/p[5],-1,(1+p[10])/p[14]);const denominator=clip.dot(q),canReflect=camera.position.y>level+.03&&Math.abs(denominator)>1e-5;
  clip.multiplyScalar(2/(Math.abs(denominator)>1e-5?denominator:1));p[2]=clip.x;p[6]=clip.y;p[10]=clip.z+1-.002;p[14]=clip.w;uniforms.reflectionWeight.value=canReflect?1:0;
  const hidden=water.captureGroup,visibility=hidden.visible,target=renderer.getRenderTarget(),clear=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha(),tone=renderer.toneMapping,shadowAuto=renderer.shadowMap.autoUpdate,xr=renderer.xr.enabled;
  try{hidden.visible=false;renderer.xr.enabled=false;renderer.setClearColor('#142b32',0);renderer.toneMapping=T.NoToneMapping;renderer.setRenderTarget(behind);renderer.clear();renderer.render(scene,camera);renderer.shadowMap.autoUpdate=false;renderer.setRenderTarget(reflected);renderer.clear();if(canReflect)renderer.render(scene,mirror);captures++;}
  finally{hidden.visible=visibility;renderer.setRenderTarget(target);renderer.setClearColor(clear,alpha);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadowAuto;renderer.xr.enabled=xr;}
 }
 return {capture,snapshot:()=>({captures,resolution:lastSize,reflection:'planar-scene-capture',refraction:'depth-guarded-scene-capture'})};
}
