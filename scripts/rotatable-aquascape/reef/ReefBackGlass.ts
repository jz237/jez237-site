import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReefReflections} from './ReefReflections.ts';

/** A dark-backed pane reflects the real reef at its actual mirrored depth.
 * Uses the existing capture budget, not an additional render on every frame. */
export function reefBackGlass(pool:ReefReflections,time:{value:number},daylight:{value:number}){
 const pane=pool.add(new Reflector(new T.PlaneGeometry(10.04,5.2),{
  textureWidth:1024,textureHeight:768,multisample:2,clipBias:.002,
  shader:{name:'ReefRearGlass',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},textureMatrix:{value:new T.Matrix4()},time,daylight},
   vertexShader:`uniform mat4 textureMatrix;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    void main(){v=uv;world=(modelMatrix*vec4(position,1.)).xyz;reflectedUv=textureMatrix*vec4(position,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform sampler2D tDiffuse;uniform float time,daylight;varying vec4 reflectedUv;varying vec2 v;varying vec3 world;
    void main(){
     float glow=pow(max(0.,1.-length((v-vec2(.5,.83))*vec2(1.,.65))),2.);
     vec3 blue=mix(vec3(.002,.008,.018),vec3(.008,.055,.16),glow)*(.25+.75*daylight);
     float grazing=pow(1.-abs(normalize(cameraPosition-world).z),3.);
     vec3 reflected=texture2D(tDiffuse,reflectedUv.xy/reflectedUv.w).rgb;
     // Attenuate warm wavelengths across the longer reflected water path.
     reflected*=vec3(.53,.72,.90);
     gl_FragColor=vec4(mix(blue,reflected,.40+.20*grazing),1.);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`
  }
 }));
 pane.name='Submerged rear glass reflection';pane.position.set(0,2.8,-2.325);
 // Reflector clones its uniform set; reconnect live lighting controls.
 const material=pane.material as T.ShaderMaterial;material.uniforms.time=time;material.uniforms.daylight=daylight;
 return pane;
}
