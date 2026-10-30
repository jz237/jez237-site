import * as T from '../aquaclear-studio/vendor/three.module.js';
const TAU=Math.PI*2;

// Bounded visual embellishments, driven only by the teaching simulation clock.
// These do not calculate pressure, spray performance or liquid transport.
export function wetMotion({screenSpin,woven,effects,nozzleXs,clipMaterials}){
 const level={value:2.4},wetness={value:0},clock={value:0};
 const weaveCompile=woven.onBeforeCompile;
 woven.onBeforeCompile=shader=>{
  weaveCompile(shader);Object.assign(shader.uniforms,{wetLevel:level,rinseWetness:wetness,wetClock:clock});
  shader.vertexShader='varying vec3 wetWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','wetWorld=(modelMatrix*vec4(transformed,1.)).xyz;\n#include <project_vertex>');
  shader.fragmentShader='varying vec3 wetWorld;uniform float wetLevel,rinseWetness,wetClock;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   float immersed=1.-smoothstep(wetLevel-.035,wetLevel+.04,wetWorld.y);
   float wetFilm=max(immersed,rinseWetness*.8);
   roughnessFactor=mix(roughnessFactor,.15,wetFilm);
   diffuseColor.rgb*=1.-wetFilm*.12;`);
 };
 woven.customProgramCacheKey=()=> 'drum-wet-weave-v4';
 const beadMat=new T.MeshPhysicalMaterial({color:'#c4e4e0',metalness:.08,roughness:.06,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.66,depthWrite:false});
 clipMaterials.push(beadMat);
 const beads=new T.InstancedMesh(new T.SphereGeometry(.019,10,8),beadMat,96);screenSpin.add(beads);
 const splashMat=new T.MeshPhysicalMaterial({color:'#b4e1e6',roughness:.08,clearcoat:1,transparent:true,opacity:.68,depthWrite:false});
 const splash=new T.InstancedMesh(new T.SphereGeometry(.012,8,6),splashMat,144);effects.add(splash);
 // Crown-shaped splashes at the screen, separate from the falling nozzle spray.
 const crowns=new T.InstancedMesh(new T.TorusGeometry(1,.025,4,40,.95*Math.PI),new T.MeshBasicMaterial({color:'#c3e9e9',transparent:true,opacity:.34,depthWrite:false}),36);effects.add(crowns);
 // A continuous wet ribbon makes the short drop from screen to trough readable.
 const ribbonMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{clock,strength:wetness},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float clock,strength;void main(){float edge=smoothstep(0.,.15,min(vUv.x,1.-vUv.x));float filament=pow(.5+.5*sin(vUv.x*85.+sin(vUv.y*15.-clock*9.)*.6),10.);float pulse=.65+.35*sin(vUv.y*53.+clock*23.);gl_FragColor=vec4(.54,.77,.79,edge*(.035+.16*filament)*pulse*strength);}`});
 const ribbons=new T.Group();effects.add(ribbons);
 for(const x of nozzleXs){const m=new T.Mesh(new T.PlaneGeometry(.32,.30,6,12),ribbonMat);m.position.set(x,2.9,-.035);ribbons.add(m);}
 const pose=new T.Object3D();let lastTime=0,residual=0,last={};
 function update(s,h,operating){
  const dt=Math.max(0,Math.min(.1,h.time-lastTime));if(h.time<lastTime)residual=0;lastTime=h.time;
  residual=h.rinse?1:Math.max(0,residual-dt*.42);level.value=h.dirtyLevel;clock.value=h.time;wetness.value=residual;
  beads.visible=operating;let visibleBeads=0;
  for(let i=0;i<96;i++){
   const a=i*.61803398875*TAU,x=-1.66+(i*.41421356%1)*3.17;
   const above=1.8+Math.cos(a+h.angle)*1.286>h.dirtyLevel+.045;
   pose.position.set(x,Math.cos(a)*1.286,Math.sin(a)*1.286);pose.rotation.set(a,0,0);
   const size=above?(.5+(i%5)*.16):0;pose.scale.set(size,.28*size,(1.1+(i%3)*.25)*size);pose.updateMatrix();beads.setMatrixAt(i,pose.matrix);if(above)visibleBeads++;
  }beads.instanceMatrix.needsUpdate=true;
  splash.visible=crowns.visible=operating&&h.rinse;ribbons.visible=operating&&residual>.02;
  const pressure=Math.sqrt(Math.max(0,s.pressure/100));
  for(let i=0;i<144;i++){
   const age=(h.time*(2.3+(i%4)*.13)+i*.618)%1,t=age*.25,angle=i*2.39996;
   const vx=Math.cos(angle)*(.28+(i%7)*.035)*pressure,vz=Math.sin(angle)*(.25+(i%5)*.04)*pressure;
   pose.position.set(nozzleXs[i%6]+vx*t,3.075+.65*pressure*t-4.9*t*t,-.045+vz*t);
   pose.rotation.set(angle,0,-vx);const k=(.3+(i%5)*.11)*(1-age*.65);pose.scale.set(k,k*(1.2+age),k);pose.updateMatrix();splash.setMatrixAt(i,pose.matrix);
  }splash.instanceMatrix.needsUpdate=true;
  for(let i=0;i<36;i++){
   const age=(h.time*3.4+i*.618)%1;pose.position.set(nozzleXs[i%6],3.082+Math.sin(age*Math.PI)*.035,-.035);
   pose.rotation.set(-Math.PI/2,age*.5,i*2.4);const r=.018+age*.095;pose.scale.set(r,r,(1-age)*.65);pose.updateMatrix();crowns.setMatrixAt(i,pose.matrix);
  }crowns.instanceMatrix.needsUpdate=true;
  last={clock:h.time,screenBeads:operating?visibleBeads:0,impactDrops:splash.visible?144:0,impactCrowns:crowns.visible?36:0,runoff:ribbons.visible,residual};
 }
 return {update,snapshot:()=>last};
}
