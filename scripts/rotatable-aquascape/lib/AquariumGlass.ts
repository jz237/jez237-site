import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReflectionPool} from './ReflectionPool';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Clear glass slabs plus the grazing internal reflections of water-filled side walls. */
export function buildAquariumGlass(scene:T.Scene,reflections:ReflectionPool){
 // Thin planar glazing: preserve the already rendered water and transparent
 // details, which the renderer's opaque-only transmission buffer cannot contain.
 // The physical BRDF already weights the reflected RGB by Fresnel. Composite it
 // once, leaving the complementary transmitted scene beneath the surface.
 const glass=new T.MeshPhysicalMaterial({color:0x000000,metalness:0,roughness:.025,transparent:true,opacity:1,ior:1.5,side:T.FrontSide,depthWrite:false,envMapIntensity:.28,blending:T.CustomBlending,blendSrc:T.OneFactor,blendDst:T.OneMinusSrcAlphaFactor});
 glass.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
float glassCosine=abs(dot(normal,normalize(vViewPosition)));
diffuseColor.a=.04+.96*pow(1.-glassCosine,5.);
#include <opaque_fragment>`);
 };
 glass.customProgramCacheKey=()=> 'clear-fresnel-pane-v1';
 glass.userData.skipWaterDepth=true;
 const polishedEdge=new T.MeshPhysicalMaterial({color:0xd9eee3,roughness:.065,transmission:.88,transparent:true,opacity:.8,ior:1.5,thickness:1.4,attenuationColor:new T.Color(0x72b591),attenuationDistance:2.4,depthWrite:false,envMapIntensity:.7});
 const pane=(w:number,h:number,x:number,y:number,z:number,ry=0)=>{
  const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,.07,2,.012),[polishedEdge,polishedEdge,polishedEdge,polishedEdge,glass,glass]);mesh.position.set(x,y,z);mesh.rotation.y=ry;mesh.renderOrder=8;scene.add(mesh);
 };
 pane(10.2,5.55,0,2.8,2.36);pane(10.2,5.55,0,2.8,-2.36);
 pane(4.72,5.55,-5.1,2.8,0,Math.PI/2);pane(4.72,5.55,5.1,2.8,0,Math.PI/2);
 // Fine clear silicone at the joints; the pane bevels catch the room and LED.
 const edge=new T.MeshPhysicalMaterial({color:0xb7cfc5,roughness:.26,transparent:true,opacity:.28,transmission:.65,ior:1.42,thickness:.018,depthWrite:false});
 const seam=(w:number,h:number,d:number,x:number,y:number,z:number)=>{
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),edge);mesh.position.set(x,y,z);scene.add(mesh);
 };
 for(const x of [-5.1,5.1])for(const z of [-2.36,2.36])seam(.016,5.54,.016,x,2.8,z);
 for(const side of [-1,1]){
  const wall=reflections.add(new Reflector(new T.PlaneGeometry(4.60,5.20),{textureWidth:768,textureHeight:1024,multisample:2,clipBias:.002,shader:{
   name:'AquariumInternalGlass',
   uniforms:{color:{value:new T.Color(0xffffff)},tDiffuse:{value:null},textureMatrix:{value:new T.Matrix4()},wallNormal:{value:new T.Vector3(-side,0,0)}},
   vertexShader:`uniform mat4 textureMatrix;varying vec4 reflectedUv;varying vec3 world;
void main(){world=(modelMatrix*vec4(position,1.)).xyz;reflectedUv=textureMatrix*vec4(position,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform sampler2D tDiffuse;uniform vec3 wallNormal;varying vec4 reflectedUv;varying vec3 world;
void main(){
 vec3 ray=normalize(cameraPosition-world);
 float cosine=abs(dot(ray,wallNormal));
 float internal=1.-smoothstep(.60,.76,cosine);
 vec3 reflected=texture2D(tDiffuse,reflectedUv.xy/reflectedUv.w).rgb;
 gl_FragColor=vec4(reflected*vec3(.965,.993,.977),.025+.87*internal);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`
  }}));
  wall.position.set(side*5.055,2.76,0);wall.rotation.y=-side*Math.PI/2;
  const material=wall.material as T.ShaderMaterial;material.transparent=true;material.depthWrite=false;
  wall.renderOrder=7;scene.add(wall);
 }
}
