import * as T from 'three';
import {FeedingBite} from './FeedingBite.ts';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {assetURL} from './AssetPaths.ts';

/** Blender-authored mesh and maps are loaded once and shared by both animals. */
let source:Promise<T.Group>|undefined;
export function loadAngelfish(){return source??=new GLTFLoader().loadAsync(assetURL('./models/angelfish/silver-angelfish.glb')).then(g=>g.scene);}
let mouthGeometry:T.SphereGeometry|undefined;
function oralOpening(){
 if(!mouthGeometry){mouthGeometry=new T.SphereGeometry(1,12,8);mouthGeometry.scale(.006,.006,.017);mouthGeometry.translate(.785,-.035,0);}
 const mesh=new T.Mesh(mouthGeometry,new T.MeshStandardMaterial({color:0x24110f,roughness:.85}));
 mesh.name='OralOpening';return mesh;
}

const deformation=`
uniform float angelPhase, angelEffort, angelPectoral, angelRegion, angelDrift, angelReach, angelStroke, angelFold, angelGill, angelMouth;
vec3 angelDeform(vec3 p){
 if(angelRegion>4.5){
  // The dark aperture stays within the lip rim; its upper edge is anchored.
  p.y=-.029+(p.y+.029)*(1.+1.65*angelMouth);
  return p;
 }
 if(angelRegion<.5){
  // Local opercular abduction: fixed anterior hinge and eyes, moving rear
  // cover/rim on both sides. The whole head does not nod with ventilation.
  float cover=smoothstep(.14,.26,p.x)*(1.-smoothstep(.35,.46,p.x));
  cover*=1.-smoothstep(.22,.36,abs(p.y+.045));
  cover*=smoothstep(.015,.07,abs(p.z));
  p.z+=sign(p.z)*cover*angelGill*.032;
  p.x-=cover*angelGill*.007;
  float jaw=smoothstep(.62,.77,p.x)*(1.-smoothstep(-.055,-.024,p.y));
  p.y-=jaw*angelMouth*.018;
 }
 float tail=1.-smoothstep(-1.3,.28,p.x);
 float w=tail*tail;
 // A traveling wave builds behind the steady head. Power strokes soften the
 // rear trunk; the broad torso never rocks back and forth as a rigid object.
 float propulsion=smoothstep(.50,.90,angelEffort);
 p.z+=sin(angelPhase-p.x*3.8)*w*(.005+.020*angelStroke+.025*propulsion);
 if(angelRegion>0.5&&angelRegion<1.5){
  // The dorsal and anal attachments end below |y|=.56. Free tips fold
  // inward during propulsion and fan open on the coast, without root gaps.
  float edge=smoothstep(.56,1.4,abs(p.y));
  float wave=angelDrift*2.7-p.x*3.2+abs(p.y)*1.8;
  p.z+=edge*sin(wave)*(.052+.048*angelEffort);
  p.y+=sign(p.y)*edge*(sin(wave+.5)*.010-angelFold);
  p.x+=edge*angelFold*.30;
  // Faster, flexible caudal strokes lag behind the peduncle. The tail fan
  // is separate from the tall median-fin tips despite their shared material.
  float fan=clamp((-.80-p.x)/.51,0.,1.)*(1.-smoothstep(.45,.62,abs(p.y)));
  float caudalWave=angelPhase-p.x*4.8-.85;
  // A soft fan bends progressively behind the fixed attachment. Its upper
  // and lower margins trail the center, visibly cupping on each power stroke.
  float margin=smoothstep(.06,.40,abs(p.y));
  p.z+=fan*fan*sin(caudalWave-margin*.7)*(.055+.115*angelStroke);
  p.z+=fan*fan*fan*margin*sin(caudalWave*1.25-.9)*(.007+.017*angelStroke);
  p.x+=fan*fan*(cos(caudalWave)-1.)*.024*angelStroke;
 }else if(angelRegion>1.5&&angelRegion<3.5){
  float side=angelRegion<2.5?1.:-1.;
  float tip=clamp((.36-p.x)/.43,0.,1.);
  p.z+=side*tip*sin(angelPectoral+side*.71)*(.065+.085*angelEffort);
  p.y+=tip*cos(angelPectoral+side*.71)*.020;
  p.x+=tip*sin(angelPectoral+side*.71)*.012;
 }else if(angelRegion>3.5&&angelRegion<4.5){
  float tip=pow(clamp((-p.y-.43)/1.11,0.,1.),1.6);
  p.z+=tip*sin(angelDrift*.55+p.y*2.3)*.034;
  float side=p.z>0.?1.:-1.;
  float angle=.16*sin(angelDrift*.9+side*.85)+.85*angelReach;
  vec2 pelvic=p.xy-vec2(.27,-.43);
  p.xy=vec2(.27,-.43)+vec2(cos(angle)*pelvic.x-sin(angle)*pelvic.y,sin(angle)*pelvic.x+cos(angle)*pelvic.y);
  p.y+=tip*cos(angelDrift*.8+side*.8)*.016;
 }
 return p;
}
`;
export class AngelfishModel{
 readonly group:T.Group;
 private feedingBite=new FeedingBite();
 bite(){this.feedingBite.trigger();}
 private phase:number;private pectoral:number;private drift=0;private breath:number;
 private uniforms:{angelPhase:T.IUniform<number>;angelEffort:T.IUniform<number>;angelPectoral:T.IUniform<number>;angelDrift:T.IUniform<number>;angelReach:T.IUniform<number>;angelStroke:T.IUniform<number>;angelFold:T.IUniform<number>;angelGill:T.IUniform<number>;angelMouth:T.IUniform<number>} ;
 constructor(prototype:T.Group,seed=0){
  this.group=prototype.clone(true);this.phase=seed;this.pectoral=seed*1.7;this.breath=seed*2.13;
  const mouth=oralOpening();this.group.add(mouth);
  this.drift=seed;this.uniforms={angelPhase:{value:seed},angelEffort:{value:.2},angelPectoral:{value:seed*1.7},angelDrift:{value:seed},angelReach:{value:0},angelStroke:{value:0},angelFold:{value:0},angelGill:{value:0},angelMouth:{value:0}};
  this.group.traverse(o=>{
   if(!(o instanceof T.Mesh))return;
   const region=o.name==='OralOpening'?5:o.name.startsWith('Median')?1:o.name.startsWith('PectoralLeft')?2:o.name.startsWith('PectoralRight')?3:o.name.startsWith('Streamers')?4:0;
   const original=o.material as T.MeshStandardMaterial,m=original.clone();o.material=m;if(region===5)original.dispose();
   if(m.transparent){m.depthWrite=false;m.side=T.DoubleSide;m.forceSinglePass=true;}
   // No expensive transmission pass: transparent, textured single-sheet tissue.
   m.roughness=Math.max(.38,m.roughness);m.metalness=Math.min(.3,m.metalness);
   const install=(material:T.Material,normal=false)=>{
    material.onBeforeCompile=s=>{
     Object.assign(s.uniforms,this.uniforms,{angelRegion:{value:region}});
     if(normal&&region===1&&m.transparent)s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float finLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
diffuseColor.a*=mix(1.,.44,smoothstep(.055,.38,finLuma));
`);
     s.vertexShader=s.vertexShader.replace('#include <common>' ,'#include <common>\n'+deformation);
     if(normal)s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
vec3 an=normalize(objectNormal), at=normalize(cross(an,abs(an.y)<.9?vec3(0.,1.,0.):vec3(1.,0.,0.))), ab=cross(an,at);
vec3 ap=angelDeform(position);
objectNormal=normalize(cross(angelDeform(position+at*.001)-ap,angelDeform(position+ab*.001)-ap));
`);
     s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','vec3 transformed=angelDeform(position);');
    };
    material.customProgramCacheKey=()=>`angelfish-flexible-tail-v8-${region}-${normal}`;
   };
   install(m,true);
   // Subpixel fin rays cannot produce stable individual shadow texels. Their
   // visible geometry remains intact; let the torso provide the fish shadow.
   o.castShadow=region===0&&!m.transparent;o.receiveShadow=region===0;
   const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});install(depth);o.customDepthMaterial=depth;
   // The envelope includes fin/streamer motion; do not cull a waving tip.
   o.geometry.computeBoundingSphere();o.frustumCulled=false;
  });
 }
 update(dt:number,effort:number,hover=false,reach=0,speed=hover?0:effort,biteApproach=0){
  if(dt<=0)return;
  this.drift+=dt;this.feedingBite.update(dt);
  const blend=1-Math.exp(-dt*4),u=this.uniforms;
  u.angelEffort.value=T.MathUtils.lerp(u.angelEffort.value,effort,blend);
  // A separate, continuous ventilatory rhythm persists during hovering.
  // Slight effort/individual variation; qualitative timing, not measured rates.
  this.breath+=dt*2*Math.PI*(.95+.55*u.angelEffort.value+.035*Math.sin(this.drift*.43));
  // Open as the flake reaches the lips, then let the confirmed bite close it.
  u.angelMouth.value=Math.max(Math.pow(.5+.5*Math.sin(this.breath),1.6),this.feedingBite.value*2.4,T.MathUtils.clamp(biteApproach,0,1)*2.4);
  u.angelGill.value=Math.pow(.5+.5*Math.sin(this.breath-Math.PI*.60),1.25);
  // Speed drives fin folding; effort controls stronger propulsion. Individual
  // stroke/coast envelopes modulate amplitude without resetting phase.
  const swim=T.MathUtils.smoothstep(Math.max(0,speed),.025,.34);
  const power=T.MathUtils.smoothstep(.5+.5*Math.sin(this.drift*1.7),.16,.80);
  u.angelStroke.value=T.MathUtils.lerp(u.angelStroke.value,swim*(.22+.78*power),blend);
  u.angelFold.value=T.MathUtils.lerp(u.angelFold.value,swim*(.12+.14*power),blend);
  this.phase+=dt*2*Math.PI*(.45+u.angelStroke.value*(1.25+1.9*u.angelEffort.value));
  this.pectoral+=dt*(hover?7:5+u.angelEffort.value*5);
  this.uniforms.angelReach.value=reach;this.uniforms.angelPhase.value=this.phase;this.uniforms.angelPectoral.value=this.pectoral;this.uniforms.angelDrift.value=this.drift;
 }
 dispose(){this.group.traverse(o=>{if(o instanceof T.Mesh){(o.material as T.Material).dispose();o.customDepthMaterial?.dispose();}});}
}
