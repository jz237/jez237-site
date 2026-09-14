// A procedural largemouth bass: a lofted body with a station attribute so a vertex wave swims it,
// flat fins with the same attribute, eyes and a hinged lower jaw. The material paints the fish in
// the shader: olive back to white belly, brassy flanks, the broken lateral band, a wet sheen.
// This is the fallback tier of the art pipeline; the Blender hero model replaces it in 2.4.
import * as T from './vendor/three.module.js';
import {Shape} from './botany.js';
const RING=18,STATIONS=26;
function bodyProfile(s){ // s 0 tail .. 1 nose; height and width as fractions of length
 const peduncle=Math.exp(-((s-.12)*(s-.12))/.01);
 // a largemouth: deepest just behind the head, a long taper to a narrow peduncle, a big blunt-nosed head
 const depth=.245*Math.pow(Math.sin(Math.PI*Math.pow(s,1.15)),.9)*(1-.6*peduncle)+.035*(1-s)+.018;
 const head=s>.78?1-Math.pow((s-.78)/.22,1.6)*.5:1;
 return {h:depth*head*(s>.97?.45:1),w:depth*.46*head*(s<.15?.75:1)};
}
function bodyGeometry(){
 const pos=[],st=[],belly=[],idx=[];
 for(let i=0;i<=STATIONS;i++){const s=i/STATIONS,{h,w}=bodyProfile(s),z=s-.5;
  for(let j=0;j<RING;j++){const a=j/RING*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);const flat=sn<0?.92:1;pos.push(w*c*(1+.15*Math.abs(sn)),h*sn*flat+h*.06,z);st.push(s);belly.push(sn);}}
 for(let i=0;i<STATIONS;i++)for(let j=0;j<RING;j++){const a=i*RING+j,b=i*RING+(j+1)%RING,c=(i+1)*RING+j,d=(i+1)*RING+(j+1)%RING;idx.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('station',new T.Float32BufferAttribute(st,1));g.setAttribute('belly',new T.Float32BufferAttribute(belly,1));g.setIndex(idx);g.computeVertexNormals();return g;
}
function finGeometry(points,stationOf){ // fan of triangles in the local x=0 plane (or given), station per vertex
 const pos=[],st=[],bl=[];const c=points.reduce((a,p)=>[a[0]+p[0]/points.length,a[1]+p[1]/points.length,a[2]+p[2]/points.length],[0,0,0]);
 for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length];for(const v of [c,p,q]){pos.push(v[0],v[1],v[2]);st.push(stationOf(v));bl.push(0);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('station',new T.Float32BufferAttribute(st,1));g.setAttribute('belly',new T.Float32BufferAttribute(bl,1));g.computeVertexNormals();return g;
}
let shared=null;
function sharedGeometry(){
 if(shared)return shared;
 const sz=z=>z+.5;
 const dorsalSpiny=finGeometry([[0,.12,.02],[0,.19,.06],[0,.25,.1],[0,.22,.13],[0,.24,.16],[0,.2,.19],[0,.13,.22],[0,.12,.02]],p=>sz(p[2]));
 const dorsalSoft=finGeometry([[0,.12,-.14],[0,.19,-.1],[0,.22,-.04],[0,.16,.0],[0,.13,-.12]],p=>sz(p[2]));
 const anal=finGeometry([[0,-.1,-.12],[0,-.2,-.09],[0,-.19,-.03],[0,-.11,-.02]],p=>sz(p[2]));
 const caudal=finGeometry([[0,.04,-.42],[0,.2,-.58],[0,.12,-.62],[0,0,-.56],[0,-.12,-.62],[0,-.2,-.58],[0,-.04,-.42]],p=>Math.max(0,sz(p[2])));
 const pectoral=finGeometry([[0,0,0],[.09,-.02,-.06],[.11,-.05,-.1],[.06,-.06,-.09]],p=>.72);
 const pelvic=finGeometry([[0,0,0],[.02,-.07,-.06],[.03,-.09,-.09],[0,-.05,-.08]],p=>.58);
 shared={body:bodyGeometry(),dorsalSpiny,dorsalSoft,anal,caudal,pectoral,pelvic,eye:new T.SphereGeometry(.028,10,8),jaw:new T.BoxGeometry(.11,.028,.14)};
 return shared;
}
export function fishMaterial(u){
 const m=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.38,metalness:.02,sheen:.45,sheenColor:new T.Color(.7,.7,.5),clearcoat:.5,clearcoatRoughness:.25,side:T.DoubleSide});
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,{swimPhase:u.swimPhase,swimAmp:u.swimAmp,turnBend:u.turnBend,bodyLen:u.bodyLen,wet:u.wet});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute float station;attribute float belly;uniform float swimPhase,swimAmp,turnBend,bodyLen;varying float vStation,vBelly;varying vec3 vLocal;')
   .replace('#include <begin_vertex>',`#include <begin_vertex>
vStation=station;vBelly=belly;vLocal=position;
float env=pow(clamp(1.-station,0.,1.),1.25);
float wave=sin(swimPhase-(1.-station)*3.3)*swimAmp*env;
transformed.x+=wave+turnBend*env*env*.35;`);
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vStation,vBelly;varying vec3 vLocal;uniform float wet;\nfloat fh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float fn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(fh(i),fh(i+vec2(1,0)),f.x),mix(fh(i+vec2(0,1)),fh(i+1.),f.x),f.y);}')
   .replace('#include <color_fragment>',`#include <color_fragment>
vec3 back=vec3(.10,.20,.08),flank=vec3(.40,.47,.22),bellyC=vec3(.86,.86,.70);
float side=smoothstep(-.25,.55,vBelly);
vec3 skin=mix(bellyC,mix(flank,back,smoothstep(.25,.9,vBelly)),smoothstep(-.6,.1,vBelly));
float band=smoothstep(.26,.06,abs(vBelly+.02))*smoothstep(.08,.2,vStation)*smoothstep(.95,.86,vStation);
float blotch=smoothstep(.36,.6,fn(vec2(vStation*14.,vBelly*4.))*.65+fn(vec2(vStation*36.,vBelly*10.))*.35);
skin=mix(skin,vec3(.05,.07,.04),band*(.45+.55*blotch)*.9);
skin=mix(skin,vec3(.06,.1,.05),smoothstep(.3,.75,vBelly)*(.25+.3*fn(vec2(vStation*22.,vBelly*9.))));
float scales=fn(vec2(vStation*90.,vBelly*40.))*.12-.06;skin*=1.+scales*(1.-smoothstep(.85,1.,vStation));
skin=mix(skin,vec3(.35,.3,.18),smoothstep(.9,1.,vStation)*.35);
diffuseColor.rgb*=skin;`)
   .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.12,wet);');
 };m.customProgramCacheKey=()=>'first-light-bass-v2';return m;
}
export function makeFishMesh(length=.42){
 const g=sharedGeometry();const u={swimPhase:{value:0},swimAmp:{value:.02},turnBend:{value:0},bodyLen:{value:length},wet:{value:0}};
 const mat=fishMaterial(u);const finMat=fishMaterial(u);finMat.transparent=true;finMat.opacity=.9;finMat.sheen=.2;finMat.color.setRGB(.55,.55,.45);
 const root=new T.Group();root.scale.setScalar(length);
 const body=new T.Mesh(g.body,mat);body.castShadow=true;root.add(body);
 for(const [geo,x,y,z,ry,rz] of [[g.dorsalSpiny,0,0,0,0,0],[g.dorsalSoft,0,0,0,0,0],[g.anal,0,0,0,0,0],[g.caudal,0,0,0,0,0]]){const f=new T.Mesh(geo,finMat);f.position.set(x,y,z);root.add(f);}
 for(const side of [-1,1]){const p=new T.Mesh(g.pectoral,finMat);p.position.set(side*.07,-.03,.2);p.scale.x=side;p.rotation.y=side*.5;root.add(p);const v=new T.Mesh(g.pelvic,finMat);v.position.set(side*.03,-.09,.1);v.scale.x=side;root.add(v);
  const eye=new T.Mesh(g.eye,new T.MeshStandardMaterial({color:0x2a2418,roughness:.25,metalness:.1}));eye.position.set(side*.055,.055,.36);eye.scale.setScalar(.85);root.add(eye);}
 const jawPivot=new T.Group();jawPivot.position.set(0,-.03,.33);root.add(jawPivot);const jaw=new T.Mesh(g.jaw,new T.MeshStandardMaterial({color:0x9a8f70,roughness:.6}));jaw.position.set(0,-.01,.07);jawPivot.add(jaw);
 return {root,u,jawPivot,setJaw(open){jawPivot.rotation.x=open*.55;},setSwim(phase,amp,turn){u.swimPhase.value=phase;u.swimAmp.value=amp;u.turnBend.value=turn;},setWet(w){u.wet.value=w;}};
}
