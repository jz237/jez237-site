import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReefReflections} from './ReefReflections.ts';

/** A dark-backed pane reflects the real reef at its actual mirrored depth.
 * Uses the existing capture budget, not an additional render on every frame. */
export function reefBackGlass(pool:ReefReflections,time:{value:number},daylight:{value:number}){
 // Reach below the lowest sand edge: the old .2 bottom left a black slot at
 // the newly visible channel end. Keep the original upper pane and tint UVs.
 const pane=new Reflector(new T.PlaneGeometry(10.04,5.4).translate(0,-.1,0),{
  textureWidth:1024,textureHeight:768,multisample:2,clipBias:.002,
  shader:{name:'ReefRearGlass',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},textureMatrix:{value:new T.Matrix4()},time,daylight,reflectionDepth:{value:null},reflectionInverseProjection:{value:new T.Matrix4()},reflectionWorld:{value:new T.Matrix4()}},
   vertexShader:`uniform mat4 textureMatrix;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    void main(){v=vec2(uv.x,(position.y+2.6)/5.2);world=(modelMatrix*vec4(position,1.)).xyz;reflectedUv=textureMatrix*vec4(position,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform sampler2D tDiffuse,reflectionDepth;uniform mat4 reflectionInverseProjection,reflectionWorld;uniform float time,daylight;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    void main(){
     float glow=pow(max(0.,1.-length((v-vec2(.5,.83))*vec2(1.,.65))),2.);
     vec3 blue=mix(vec3(.002,.008,.018),vec3(.008,.055,.16),glow)*(.25+.75*daylight);
     float grazing=pow(1.-abs(normalize(cameraPosition-world).z),3.);
     vec2 sampleUv=reflectedUv.xy/reflectedUv.w;
     vec3 reflected=texture2D(tDiffuse,sampleUv).rgb;
     float depth=texture2D(reflectionDepth,sampleUv).r;
     vec4 captured=reflectionInverseProjection*vec4(sampleUv*2.-1.,depth*2.-1.,1.);
     captured/=captured.w;
     vec3 subject=(reflectionWorld*captured).xyz;
     // Additional out-and-back water path grows as a fish leaves the rear pane.
     float distanceToPane=max(0.,subject.z+2.325);
     float pathFade=depth<.999999?exp(-.40*distanceToPane):.12;
     // Attenuate warm wavelengths across the longer reflected water path.
     reflected*=vec3(.53,.72,.90);
     gl_FragColor=vec4(mix(blue,reflected,(.32+.16*grazing)*pathFade),1.);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`
  }
 });
 pane.name='Submerged rear glass reflection';pane.position.set(0,2.8,-2.325);
 // Reflector clones its uniform set; reconnect live lighting controls.
 const material=pane.material as T.ShaderMaterial;material.uniforms.time=time;material.uniforms.daylight=daylight;
 const target=pane.getRenderTarget();target.depthTexture=new T.DepthTexture(target.width,target.height,T.UnsignedIntType);
 material.uniforms.reflectionDepth.value=target.depthTexture;
 const capture=pane.onBeforeRender;
 pane.onBeforeRender=(...args)=>{
  capture.apply(pane,args);
  const camera=pane.getReflectionCamera(args[2]);
  material.uniforms.reflectionInverseProjection.value.copy(camera.projectionMatrix).invert();
  material.uniforms.reflectionWorld.value.copy(camera.matrixWorld);
 };
 return pool.add(pane);
}
