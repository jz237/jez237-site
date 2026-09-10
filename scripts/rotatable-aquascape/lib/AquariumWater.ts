import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReflectionPool} from './ReflectionPool';
const ripple=`
float rippleHeight(vec2 p){
 float broad=sin(p.x*5.4+p.y*7.1+time*1.15)*.016;
 float cross=sin(p.x*11.7-p.y*8.3-time*1.46+sin(p.y*2.1)*.65)*.009;
 float fine=sin(p.x*24.3+p.y*17.8+time*1.83)*.0015;
 float inlet=length(p-vec2(4.25,-1.6));
 float edge=min(5.04-abs(p.x),2.30-abs(p.y));
 return (broad+cross+fine+sin(inlet*23.-time*3.2)*exp(-inlet*.6)*.0025)*smoothstep(0.,.18,edge);
}
`;
/** Two-sided scene captures with depth-guided reflection rays across the moving surface. */
export class AquariumWater extends T.Group {
 private surfaces:Reflector[]=[];
 get reflectionTexture(){return this.surfaces.find(s=>s.visible)?.getRenderTarget().texture??this.surfaces[0].getRenderTarget().texture;}
 constructor(reflections:ReflectionPool){
  super();
  for(const underside of [true,false]){
   const surface=new Reflector(new T.PlaneGeometry(10.08,4.6,160,72),{textureWidth:1024,textureHeight:1024,clipBias:.002,multisample:2,shader:{
    name:'AquariumWaterReflection',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},reflectionDepth:{value:null},reflectionView:{value:new T.Matrix4()},reflectionProjection:{value:new T.Matrix4()},reflectionInverseProjection:{value:new T.Matrix4()},textureMatrix:{value:new T.Matrix4()},time:{value:0},underside:{value:underside?1:0}},
    vertexShader:`uniform mat4 textureMatrix;uniform float time;uniform float underside;varying vec4 reflectionUv;varying vec3 world;${ripple}
    void main(){vec3 displaced=position;world=(modelMatrix*vec4(position,1.)).xyz;float wave=rippleHeight(world.xz);displaced.z+=wave*(underside>.5?-1.:1.);world.y+=wave;reflectionUv=textureMatrix*vec4(displaced,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.);}`,
    fragmentShader:`uniform sampler2D tDiffuse;uniform sampler2D reflectionDepth;uniform mat4 reflectionView;uniform mat4 reflectionProjection;uniform mat4 reflectionInverseProjection;uniform float time;uniform float underside;varying vec4 reflectionUv;varying vec3 world;${ripple}
    float reflectedDepth(vec2 uv){
     float depth=texture2D(reflectionDepth,uv).x;
     if(depth>.999999)return -10000.;
     vec4 p=reflectionInverseProjection*vec4(uv*2.-1.,depth*2.-1.,1.);
     return p.z/p.w;
    }
    // Search the captured scene along the bent world-space ray. Geometry outside
    // the capture remains a planar approximation rather than inventing detail.
    vec2 traceReflection(vec3 origin,vec3 direction,vec2 fallback){
     vec3 start=(reflectionView*vec4(origin,1.)).xyz;
     vec3 ray=(reflectionView*vec4(direction,0.)).xyz;
     float previous=.02;
     for(int i=0;i<28;i++){
      float distance=.045+float(i)*.24;
      vec3 p=start+ray*distance;
      vec4 projected=reflectionProjection*vec4(p,1.);
      vec2 uv=projected.xy/projected.w*.5+.5;
      if(projected.w<=0.||any(lessThan(uv,vec2(.002)))||any(greaterThan(uv,vec2(.998))))break;
      float delta=reflectedDepth(uv)-p.z;
      if(delta>0.&&delta<.36){
       float low=previous,high=distance;
       for(int j=0;j<4;j++){
        float mid=(low+high)*.5;vec3 q=start+ray*mid;
        vec4 clip=reflectionProjection*vec4(q,1.);vec2 sampleUv=clip.xy/clip.w*.5+.5;
        if(reflectedDepth(sampleUv)>q.z){high=mid;uv=sampleUv;}else low=mid;
       }
       return uv;
      }
      previous=distance;
     }
     return fallback;
    }
    void main(){
     vec3 viewDirection=normalize(cameraPosition-world);
     float dx=(rippleHeight(world.xz+vec2(.012,0.))-rippleHeight(world.xz-vec2(.012,0.)))/.024;
     float dz=(rippleHeight(world.xz+vec2(0.,.012))-rippleHeight(world.xz-vec2(0.,.012)))/.024;
     vec3 rippleNormal=normalize(vec3(-dx,1.,-dz));
     float cosine=abs(dot(viewDirection,rippleNormal));
     vec3 flatRay=reflect(-viewDirection,vec3(0.,1.,0.));
     vec3 wavyRay=reflect(-viewDirection,rippleNormal);
     vec3 screenBend=(viewMatrix*vec4(wavyRay-flatRay,0.)).xyz;
     vec2 distortion=screenBend.xy*(.055+.085*(1.-cosine));
     vec2 planarUv=reflectionUv.xy/reflectionUv.w;
     vec2 reflectedUv=traceReflection(world,wavyRay,planarUv+distortion*.25);
     vec3 reflection=texture2D(tDiffuse,reflectedUv).rgb;
     float fresnel=.02+.98*pow(1.-cosine,5.);
     float internalReflection=1.-smoothstep(.62,.71,cosine);
     float strength=mix(.15+.8*fresnel,.15+.84*internalReflection,underside);
     // A very narrow wet edge catches light where the surface meets the glass.
     float edge=min(5.04-abs(world.x),2.30-abs(world.z));
     float meniscus=exp(-max(0.,edge)*180.)*.028;
     gl_FragColor=vec4(reflection*vec3(.96,1.,.97)+meniscus*vec3(.65,.84,.72),strength);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`
   }});
   const target=surface.getRenderTarget();target.depthTexture=new T.DepthTexture(1024,1024,T.UnsignedIntType);
   const uniforms=(surface.material as T.ShaderMaterial).uniforms;uniforms.reflectionDepth.value=target.depthTexture;
   const capture=surface.onBeforeRender;
   surface.onBeforeRender=(...args)=>{
    capture.apply(surface,args);
    const camera=surface.getReflectionCamera(args[2]);
    uniforms.reflectionView.value.copy(camera.matrixWorldInverse);
    uniforms.reflectionProjection.value.copy(camera.projectionMatrix);
    // Reflector modifies the near plane for clipping. Invert that final matrix,
    // not the main camera projection, to reconstruct the captured depth correctly.
    uniforms.reflectionInverseProjection.value.copy(camera.projectionMatrix).invert();
   };
   reflections.add(surface);
   surface.position.y=5.36;surface.rotation.x=underside?Math.PI/2:-Math.PI/2;surface.renderOrder=6;(surface.material as T.ShaderMaterial).transparent=true;(surface.material as T.ShaderMaterial).depthWrite=false;this.add(surface);this.surfaces.push(surface);
  }
 }
 update(time:number,cameraY:number){this.surfaces.forEach((s,i)=>{s.visible=(cameraY<5.36)===(i===0);(s.material as T.ShaderMaterial).uniforms.time.value=time;});}
}
