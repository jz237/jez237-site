import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
/** Two-sided planar reflections: underside reflects planting; top reflects the luminaire. */
export class AquariumWater extends T.Group {
 private surfaces:Reflector[]=[];
 constructor(){
  super();
  for(const underside of [true,false]){
   const surface=new Reflector(new T.PlaneGeometry(10.08,4.6),{textureWidth:1024,textureHeight:512,clipBias:.002,multisample:0,shader:{
    name:'AquariumWaterReflection',uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},textureMatrix:{value:new T.Matrix4()},time:{value:0},underside:{value:underside?1:0}},
    vertexShader:`uniform mat4 textureMatrix;varying vec4 reflectionUv;varying vec3 world;void main(){reflectionUv=textureMatrix*vec4(position,1.);world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D tDiffuse;uniform float time;uniform float underside;varying vec4 reflectionUv;varying vec3 world;
    void main(){
     float waveA=sin(world.x*10.+sin(world.z*7.+time*.7)*1.3+time*.9);
     float waveB=sin(world.z*16.-time*1.1+sin(world.x*5.-time*.3));
     vec2 distortion=vec2(waveA,waveB)*.0019;
     vec3 reflection=texture2D(tDiffuse,reflectionUv.xy/reflectionUv.w+distortion).rgb;
     vec3 viewDirection=normalize(cameraPosition-world);
     float cosine=abs(viewDirection.y);
     float fresnel=.02+.98*pow(1.-cosine,5.);
     float internalReflection=1.-smoothstep(.62,.71,cosine);
     float strength=mix(.15+.8*fresnel,.15+.84*internalReflection,underside);
     gl_FragColor=vec4(reflection*vec3(.94,1.,.96),strength);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`
   }});
   surface.position.y=5.36;surface.rotation.x=underside?Math.PI/2:-Math.PI/2;surface.renderOrder=6;(surface.material as T.ShaderMaterial).transparent=true;(surface.material as T.ShaderMaterial).depthWrite=false;this.add(surface);this.surfaces.push(surface);
  }
 }
 update(time:number,cameraY:number){this.surfaces.forEach((s,i)=>{s.visible=(cameraY<5.36)===(i===0);(s.material as T.ShaderMaterial).uniforms.time.value=time;});}
}

