import * as T from './vendor/three.module.js';

// Two scene captures: projected planar reflection and depth-guarded screen refraction.
// All render state and temporary visibility are restored before the main render.
export function createWaterOptics(renderer,scene,camera,water,excluded=[]){
  const options={type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,minFilter:T.LinearFilter,magFilter:T.LinearFilter};
  const behind=new T.WebGLRenderTarget(1,1,options), reflected=new T.WebGLRenderTarget(1,1,options);
  behind.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
  const mirror=new T.PerspectiveCamera(),size=new T.Vector2(),normal=new T.Vector3(0,1,0),look=new T.Vector3(),plane=new T.Plane(),clip=new T.Vector4(),q=new T.Vector4();
  const textureMatrix=new T.Matrix4(),bias=new T.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
  const uniforms={sceneTexture:{value:behind.texture},sceneDepth:{value:behind.depthTexture},reflectionTexture:{value:reflected.texture},reflectionMatrix:{value:textureMatrix},reflectionWeight:{value:1},viewSize:{value:new T.Vector2()},waterTime:{value:0}};
  function material(sheet=false){return new T.ShaderMaterial({uniforms:{...uniforms,sheet:{value:sheet?1:0}},transparent:true,depthWrite:false,side:T.DoubleSide,
    vertexShader:`varying vec3 worldPoint;varying vec3 worldNormal;varying vec3 viewNormal;varying vec4 projected;varying vec4 reflectedPoint;varying vec2 waterUV;uniform mat4 reflectionMatrix;
      void main(){vec4 world=modelMatrix*vec4(position,1.);worldPoint=world.xyz;worldNormal=normalize(mat3(modelMatrix)*normal);viewNormal=normalize(normalMatrix*normal);waterUV=uv;projected=projectionMatrix*viewMatrix*world;reflectedPoint=reflectionMatrix*world;gl_Position=projected;}`,
    fragmentShader:`uniform sampler2D sceneTexture,sceneDepth,reflectionTexture;uniform float sheet,waterTime,reflectionWeight;uniform vec2 viewSize;
      varying vec3 worldPoint,worldNormal,viewNormal;varying vec4 projected,reflectedPoint;varying vec2 waterUV;
      void main(){vec3 N=normalize(worldNormal);vec3 V=normalize(cameraPosition-worldPoint);float cosine=abs(dot(N,V));float fresnel=.0204+.9796*pow(1.-cosine,5.);
        vec2 uv=projected.xy/projected.w*.5+.5;
        vec2 micro=vec2(sin(worldPoint.x*38.+worldPoint.z*17.-waterTime*2.),cos(worldPoint.z*31.-worldPoint.x*23.+waterTime*1.7))*.0003;
        vec2 bend=normalize(viewNormal).xy*(sheet>.5?.002:.006)+micro;
        vec2 refractedUV=clamp(uv+bend,vec2(.002),vec2(.998));
        float depth=texture2D(sceneDepth,refractedUV).r;
        if(depth<gl_FragCoord.z-.0001)refractedUV=uv;
        vec4 transmitted=texture2D(sceneTexture,refractedUV);
        vec2 reflectUV=reflectedPoint.xy/reflectedPoint.w+micro*2.+N.xz*.012;
        vec4 reflection=texture2D(reflectionTexture,clamp(reflectUV,vec2(.002),vec2(.998)));
        float valid=step(0.,reflectUV.x)*step(reflectUV.x,1.)*step(0.,reflectUV.y)*step(reflectUV.y,1.)*reflectionWeight;
        vec3 lightDirection=normalize(vec3(-.45,1.,.65));vec3 H=normalize(V+lightDirection);
        float sparkle=pow(max(dot(N,H),0.),220.)*.38;
        float reflectance=clamp(fresnel*valid,0.,.88);
        float coverage=mix(transmitted.a,reflection.a,reflectance);
        vec3 color=mix(transmitted.rgb*transmitted.a,reflection.rgb*reflection.a,reflectance)/max(coverage,.001);
        color=mix(color,vec3(.12,.25,.27),.012)+sparkle;
        float edge=sheet>.5?1.:smoothstep(0.,.025,min(min(waterUV.x,1.-waterUV.x),min(waterUV.y,1.-waterUV.y)));
        gl_FragColor=vec4(color,edge*clamp(coverage+sparkle,.0,1.));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});}
  water.surface.material.dispose();water.sheet.material.dispose();water.surface.material=material();water.sheet.material=material(true);
  let captures=0,lastSize=[0,0];
  function capture(time){
    if(!water.group.visible)return;
    renderer.getSize(size);const scale=size.x<760?.5:.72,w=Math.min(1024,Math.max(1,Math.round(size.x*scale))),h=Math.max(1,Math.round(w*size.y/size.x));
    if(behind.width!==w||behind.height!==h){behind.setSize(w,h);reflected.setSize(w,h);lastSize=[w,h];}uniforms.viewSize.value.set(size.x,size.y);uniforms.waterTime.value=time;
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
  return {capture,snapshot:()=>({captures,resolution:lastSize,reflection:'planar',refraction:'screen-space-depth-guarded'})};
}
