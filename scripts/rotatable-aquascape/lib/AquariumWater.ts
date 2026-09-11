import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReflectionPool} from './ReflectionPool';
import {waterOpticsShader,WATER_LEVEL} from './WaterDepth';
const ripple=`
float rippleHeight(vec2 p){
 float inlet=length(p-vec2(4.25,-1.6));
 float agitation=.65+.35*exp(-inlet*.32);
 // Several crossing ripple scales break up the long, regular mirror stripes.
 // Shorter waves change reflection direction without making large water swells.
 vec2 q=p+vec2(sin(p.y*1.9+p.x*.7-time*.29),sin(p.x*1.3-p.y*.8+time*.23))*.16;
 float broad=sin(q.x*2.7+q.y*3.6-time*1.07)*.018;
 float cross=sin(q.x*8.3-q.y*6.8-time*1.83+sin(q.y*1.7)*.65)*.018;
 float secondary=sin(q.x*12.1+q.y*9.7-time*2.27+sin(q.x*.8-time*.23)*.7)*.011;
 float fine=sin(q.x*23.2-q.y*17.8-time*3.21)*.0025;
 float rings=sin(inlet*18.-time*3.1)*exp(-inlet*.58)*.009;
 float edge=min(5.04-abs(p.x),2.30-abs(p.y));
 // A narrow raised meniscus meets the glass; the contact line retains a
 // small part of the passing wave instead of becoming a rigid straight bar.
 float wetEdge=.015*exp(-max(0.,edge)/.025);
 float wallMotion=.12+.88*smoothstep(0.,.18,edge);
 return ((broad+cross+secondary+fine)*agitation+rings)*wallMotion+wetEdge;
}
`;
/** Concentrate real surface vertices around the curved glass contact zone. */
function waterSurfaceGeometry(){
 const geometry=new T.PlaneGeometry(10.08,4.6,320,128),positions=geometry.getAttribute('position');
 for(let i=0;i<positions.count;i++){
  positions.setXY(i,Math.sin(positions.getX(i)/5.04*Math.PI*.5)*5.04,Math.sin(positions.getY(i)/2.3*Math.PI*.5)*2.3);
 }
 positions.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();
 // Shader displacement includes the raised contact edge and passing waves.
 geometry.boundingSphere!.radius+=.075;
 return geometry;
}
/** Two-sided scene captures with depth-guided reflection rays across the moving surface. */
export class AquariumWater extends T.Group {
 private surfaces:Reflector[]=[];
 get reflectionTexture(){return this.surfaces.find(s=>s.visible)?.getRenderTarget().texture??this.surfaces[0].getRenderTarget().texture;}
 constructor(reflections:ReflectionPool){
  super();
  for(const underside of [true,false]){
   const surface=new Reflector(waterSurfaceGeometry(),{textureWidth:1024,textureHeight:1024,clipBias:.002,multisample:2,shader:{
    name:'AquariumWaterReflection',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},reflectionDepth:{value:null},reflectionView:{value:new T.Matrix4()},reflectionProjection:{value:new T.Matrix4()},reflectionInverseProjection:{value:new T.Matrix4()},textureMatrix:{value:new T.Matrix4()},time:{value:0},illumination:{value:1},underside:{value:underside?1:0}},
    vertexShader:`uniform mat4 textureMatrix;uniform float time;uniform float underside;varying vec4 reflectionUv;varying vec3 world;${ripple}
    void main(){vec3 displaced=position;world=(modelMatrix*vec4(position,1.)).xyz;float wave=rippleHeight(world.xz);displaced.z+=wave*(underside>.5?-1.:1.);world.y+=wave;reflectionUv=textureMatrix*vec4(displaced,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.);}`,
    fragmentShader:`uniform sampler2D tDiffuse;uniform sampler2D reflectionDepth;uniform mat4 reflectionView;uniform mat4 reflectionProjection;uniform mat4 reflectionInverseProjection;uniform float time;uniform float illumination;uniform float underside;varying vec4 reflectionUv;varying vec3 world;${ripple}${waterOpticsShader}
    // Unpolarized dielectric Fresnel, including the water-to-air critical angle.
    // See PBRT, Specular Reflection and Transmission (FrDielectric).
    float waterFresnel(float cosine){
     float incident=mix(1.,1.333,underside),transmitted=mix(1.333,1.,underside);
     float ratio=incident/transmitted;
     float sinTransmitted2=ratio*ratio*max(0.,1.-cosine*cosine);
     if(sinTransmitted2>=1.)return 1.;
     float ct=sqrt(1.-sinTransmitted2);
     float parallel=(transmitted*cosine-incident*ct)/max(.00001,transmitted*cosine+incident*ct);
     float perpendicular=(incident*cosine-transmitted*ct)/max(.00001,incident*cosine+transmitted*ct);
     return .5*(parallel*parallel+perpendicular*perpendicular);
    }
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
     // The captured plants already include their path toward the surface.
     // Account separately for the real camera-to-surface segment inside water.
     if(underside>.5){
      vec3 incident=world-cameraPosition;
      float opticalDistance=waterPath(cameraPosition,normalize(incident),length(incident));
      reflection=attenuateWater(reflection,opticalDistance,illumination);
     }
     // Intersect the reflected ray with the actual three LED strips. Sampling
     // their narrow shapes only from a capture made the highlight break into
     // isolated white pixels. Pixel-footprint coverage keeps the emitter intact.
     if(underside<.5){
      vec3 lampHit=world+wavyRay*((6.326-world.y)/max(wavyRay.y,.0001));
      vec2 aa=clamp(fwidth(lampHit.xz),vec2(.003),vec2(.10));
      float along=1.-smoothstep(4.375-aa.x,4.375+aa.x,abs(lampHit.x));
      float across=0.;
      for(int strip=0;strip<3;strip++){
       float z=-.37+float(strip)*.2;
       across+=1.-smoothstep(.0525-aa.y,.0525+aa.y,abs(lampHit.z-z));
      }
      float coverage=along*min(across,1.)*step(.0001,wavyRay.y);
      reflection=mix(reflection,vec3(.745,.947,.855)*3.3*illumination,coverage);
     }
     // Filter the steep critical-angle transition across the pixel footprint.
     float footprint=max(fwidth(cosine)*.5,.0001);
     float strength=.5*(waterFresnel(clamp(cosine-footprint,0.,1.))+waterFresnel(clamp(cosine+footprint,0.,1.)));
     // A very narrow wet edge catches light where the surface meets the glass.
     float edge=min(5.04-abs(world.x),2.30-abs(world.z));
     float meniscus=exp(-max(0.,edge)*180.)*.028*illumination;
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
   surface.position.y=WATER_LEVEL;surface.rotation.x=underside?Math.PI/2:-Math.PI/2;surface.renderOrder=6;(surface.material as T.ShaderMaterial).transparent=true;(surface.material as T.ShaderMaterial).depthWrite=false;this.add(surface);this.surfaces.push(surface);
  }
 }
 update(time:number,cameraY:number,illumination=1){this.surfaces.forEach((s,i)=>{s.visible=(cameraY<WATER_LEVEL)===(i===0);const uniforms=(s.material as T.ShaderMaterial).uniforms;uniforms.time.value=time;uniforms.illumination.value=illumination;});}
}
