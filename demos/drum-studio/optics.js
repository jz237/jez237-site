import * as T from '../aquaclear-studio/vendor/three.module.js';

// Two scene captures: projected planar reflection and depth-guarded screen refraction.
// All render state and temporary visibility are restored before the main render.
export function createWaterOptics(renderer,scene,camera,water,excluded=[]){
  const options={type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,minFilter:T.LinearFilter,magFilter:T.LinearFilter};
  const behind=new T.WebGLRenderTarget(1,1,options), reflected=new T.WebGLRenderTarget(1,1,options);
  behind.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);reflected.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
  const mirror=new T.PerspectiveCamera(),size=new T.Vector2(),normal=new T.Vector3(0,1,0),look=new T.Vector3(),plane=new T.Plane(),clip=new T.Vector4(),q=new T.Vector4();
  const textureMatrix=new T.Matrix4(),bias=new T.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
  const uniforms={sceneTexture:{value:behind.texture},sceneDepth:{value:behind.depthTexture},reflectionTexture:{value:reflected.texture},reflectionDepth:{value:reflected.depthTexture},reflectionMatrix:{value:textureMatrix},reflectionWeight:{value:1},viewSize:{value:new T.Vector2()},waterTime:{value:0},impactZ:{value:0},delivery:{value:1},dirtyLoad:{value:.12},nearPlane:{value:camera.near},farPlane:{value:camera.far}};
  function material(dirty=false){return new T.ShaderMaterial({uniforms:{...uniforms,sheet:{value:0},dirtySide:{value:dirty?1:0}},transparent:true,depthWrite:false,side:T.DoubleSide,
    vertexShader:`varying vec3 worldPoint;varying vec3 worldNormal;varying vec3 viewNormal;varying vec4 projected;varying vec4 reflectedPoint;varying vec2 waterUV;uniform mat4 reflectionMatrix;
      void main(){vec4 world=modelMatrix*vec4(position,1.);worldPoint=world.xyz;worldNormal=normalize(mat3(modelMatrix)*normal);viewNormal=normalize(normalMatrix*normal);waterUV=uv;projected=projectionMatrix*viewMatrix*world;reflectedPoint=reflectionMatrix*world;gl_Position=projected;}`,
    fragmentShader:`uniform sampler2D sceneTexture,sceneDepth,reflectionTexture,reflectionDepth;uniform float dirtySide,sheet,waterTime,reflectionWeight,impactZ,delivery,dirtyLoad,nearPlane,farPlane;uniform vec2 viewSize;
      varying vec3 worldPoint,worldNormal,viewNormal;varying vec4 projected,reflectedPoint;varying vec2 waterUV;
      float waterNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec4 h=fract(sin(vec4(dot(i,vec2(127.1,311.7)),dot(i+vec2(1,0),vec2(127.1,311.7)),dot(i+vec2(0,1),vec2(127.1,311.7)),dot(i+vec2(1,1),vec2(127.1,311.7))))*43758.5453);return mix(mix(h.x,h.y,f.x),mix(h.z,h.w,f.x),f.y);}
      float linearDepth(float d){return nearPlane*farPlane/(farPlane-d*(farPlane-nearPlane));}
      float waterHeight(vec2 p){float t=waterTime;float broad=sin(p.x*4.3+p.y*2.7-t*1.4)*.006+sin(p.x*-3.1+p.y*6.1+t*1.8)*.004;float fine=(waterNoise(p*19.+vec2(t*.65,-t*.4))-.5)*.0035+(waterNoise(p*31.+vec2(-t*.8,t*.45))-.5)*.0013;return (broad+fine)*(.18+.82*delivery);}
      void main(){float halfWidth=sqrt(max(0.,1.275*1.275-pow(worldPoint.y-1.8,2.)));bool interior=worldPoint.x< -1.86||(worldPoint.x<1.5&&abs(worldPoint.z)<halfWidth);if(dirtySide>.5&&!interior)discard;if(dirtySide<.5&&interior)discard;vec2 p=worldPoint.xz;float e=.018;float gx=(waterHeight(p+vec2(e,0))-waterHeight(p-vec2(e,0)))/(2.*e),gz=(waterHeight(p+vec2(0,e))-waterHeight(p-vec2(0,e)))/(2.*e);vec3 N=normalize(worldNormal+vec3(-gx,0.,-gz));vec3 V=normalize(cameraPosition-worldPoint);float cosine=abs(dot(N,V));float fresnel=.0204+.9796*pow(1.-cosine,5.);
        vec2 uv=projected.xy/projected.w*.5+.5;
        vec2 micro=vec2(sin(worldPoint.x*38.+worldPoint.z*17.-waterTime*2.),cos(worldPoint.z*31.-worldPoint.x*23.+waterTime*1.7))*.0003;
        vec2 bend=normalize(viewNormal).xy*.0025+vec2(gx,gz)*.010+micro;
        vec2 refractedUV=clamp(uv+bend,vec2(.002),vec2(.998));
        float depth=texture2D(sceneDepth,refractedUV).r;
        if(depth<gl_FragCoord.z-.0001)refractedUV=uv;
        vec4 transmitted=texture2D(sceneTexture,refractedUV);
        float distanceThroughWater=clamp(linearDepth(texture2D(sceneDepth,refractedUV).r)-linearDepth(gl_FragCoord.z),0.,5.);vec3 attenuation=exp(-distanceThroughWater*(dirtySide>.5?vec3(.19,.16,.22)*(1.+dirtyLoad*.6):vec3(.10,.04,.025)));vec3 scatter=dirtySide>.5?vec3(.13,.15,.095):vec3(.045,.16,.18);transmitted.rgb=transmitted.rgb*attenuation+scatter*(1.-attenuation);
        transmitted.a*=1.-step(.99999,texture2D(sceneDepth,refractedUV).r);
        vec2 reflectUV=reflectedPoint.xy/reflectedPoint.w+micro*2.+N.xz*.012;
        vec4 reflection=texture2D(reflectionTexture,clamp(reflectUV,vec2(.002),vec2(.998)));
        reflection.a*=1.-step(.99999,texture2D(reflectionDepth,clamp(reflectUV,vec2(.002),vec2(.998))).r);
        float valid=step(0.,reflectUV.x)*step(reflectUV.x,1.)*step(0.,reflectUV.y)*step(reflectUV.y,1.)*reflectionWeight;
        vec3 lightDirection=normalize(vec3(-.45,1.,.65));vec3 H=normalize(V+lightDirection);
        float sparkle=pow(max(dot(N,H),0.),150.)*.38;
        float reflectance=clamp(fresnel*valid,0.,.88);
        float coverage=mix(transmitted.a,reflection.a,reflectance);
        vec3 color=mix(transmitted.rgb*transmitted.a,reflection.rgb*reflection.a,reflectance)/max(coverage,.001);
        // A restrained visibility layer keeps clear water legible against an empty
        // studio background. Crests move with the same clock as the water mesh.
        float sideRim=1.-smoothstep(.0,.024,min(waterUV.x,1.-waterUV.x));
        float lip=exp(-pow((waterUV.y-.98)/.025,2.));
        float streak=pow(.5+.5*sin(waterUV.x*116.+sin(waterUV.y*13.-waterTime*3.)*.7),12.);
        float travel=.45+.55*pow(.5+.5*sin(waterUV.y*39.+waterTime*7.+waterUV.x*8.),4.);
        float dx=max(abs(worldPoint.x)-1.15,0.);
        float radius=length(vec2(dx,min(abs(worldPoint.z-.62),abs(worldPoint.z+.62))));
        float crest=pow(.5+.5*sin(worldPoint.x*9.+worldPoint.z*8.-waterTime*2.),18.)*.13;
        float gleam=sheet>.5?(.21*sideRim+.13*lip+.075*streak*travel):crest*.20*delivery;
        float wallDistance=min(3.1-abs(worldPoint.x),1.6-abs(worldPoint.z));float drumDistance=worldPoint.x> -1.86&&worldPoint.x<1.5?abs(abs(worldPoint.z)-halfWidth):10.;float meniscus=exp(-max(0.,min(wallDistance,drumDistance))/.014);gleam+=meniscus*.11;float visibility=sheet>.5?.17+gleam:.18+.09*fresnel+gleam;
        vec3 tint=sheet>.5?vec3(.08,.34,.40):vec3(.035,.28,.34);
        if(dirtySide>.5)tint=mix(tint,vec3(.21,.25,.15),.32);tint+=vec3(.30,.46,.46)*min(1.,gleam*3.);
        float alpha=coverage*(1.-visibility)+visibility;
        color=(color*coverage*(1.-visibility)+tint*visibility)/max(alpha,.001);
        float bubbleFilm=0.;
        color+=sparkle+gleam*.25+vec3(.23,.31,.30)*bubbleFilm;
        float edge=sheet>.5?1.:smoothstep(0.,.025,min(min(waterUV.x,1.-waterUV.x),min(waterUV.y,1.-waterUV.y)));
        gl_FragColor=vec4(color,edge*clamp(alpha+sparkle,.0,1.));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});}
  water.surface.material.dispose();water.sheet.material.dispose();water.surface.material=material();water.sheet.material=material(true);
  let captures=0,lastSize=[0,0];
  function capture(time){
    if(!water.group.visible)return;
    renderer.getSize(size);const scale=size.x<760?.5:.72,w=Math.min(1024,Math.max(1,Math.round(size.x*scale))),h=Math.max(1,Math.round(w*size.y/size.x));
    if(behind.width!==w||behind.height!==h){behind.setSize(w,h);reflected.setSize(w,h);lastSize=[w,h];}uniforms.viewSize.value.set(size.x,size.y);uniforms.waterTime.value=time;const flow=water.snapshot();uniforms.impactZ.value=flow.impactZ??0;uniforms.delivery.value=flow.delivery??1;uniforms.dirtyLoad.value=flow.load??0;
    const level=water.surface.position.y;camera.updateMatrixWorld();mirror.copy(camera);mirror.position.y=2*level-camera.position.y;camera.getWorldDirection(look);look.reflect(normal);mirror.up.copy(camera.up).reflect(normal);mirror.lookAt(mirror.position.clone().add(look));mirror.updateMatrixWorld();
    textureMatrix.copy(bias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
    plane.set(normal,-level).applyMatrix4(mirror.matrixWorldInverse);clip.set(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant);
    const p=mirror.projectionMatrix.elements;q.set((Math.sign(clip.x)+p[8])/p[0],(Math.sign(clip.y)+p[9])/p[5],-1,(1+p[10])/p[14]);const denominator=clip.dot(q),canReflect=camera.position.y>level+.03&&Math.abs(denominator)>1e-5;clip.multiplyScalar(2/(Math.abs(denominator)>1e-5?denominator:1));p[2]=clip.x;p[6]=clip.y;p[10]=clip.z+1-.002;p[14]=clip.w;
    uniforms.reflectionWeight.value=canReflect?1:0;
    const hidden=[water.group,...excluded],visibility=hidden.map(o=>o.visible),target=renderer.getRenderTarget(),clear=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha(),tone=renderer.toneMapping,shadowAuto=renderer.shadowMap.autoUpdate,xr=renderer.xr.enabled;
    try{hidden.forEach(o=>o.visible=false);renderer.xr.enabled=false;renderer.setClearColor('#142b32',0);renderer.toneMapping=T.NoToneMapping;
      renderer.setRenderTarget(behind);renderer.clear();renderer.render(scene,camera);renderer.shadowMap.autoUpdate=false;
      renderer.setRenderTarget(reflected);renderer.clear();if(canReflect)renderer.render(scene,mirror);captures++;
    }finally{hidden.forEach((o,i)=>o.visible=visibility[i]);renderer.setRenderTarget(target);renderer.setClearColor(clear,alpha);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadowAuto;renderer.xr.enabled=xr;}
  }
  return {capture,snapshot:()=>({captures,resolution:lastSize,reflection:'planar',refraction:'screen-space-depth-guarded',surfaceDetail:'two-level-masked-ripple-surfaces',absorption:'view-depth-approximation'})};
}
