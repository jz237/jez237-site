// Bodies for the living lake: a low-poly great blue heron on the bank, a skein of geese, swallows,
// a haze of insects over the water, and rises at dusk. The decisions live in wildlife-model.js;
// this file draws them and hands one-shot sound cues back to main.js.
import * as T from './vendor/three.module.js';
import {createHeron,stepHeron,createGeese,stepGeese,skeinOffsets,GEESE,swallowDensity,swallowPos,insectDensity,riseDue} from './wildlife-model.js';
function heronMesh(){const g=new T.Group();const grey=new T.MeshStandardMaterial({color:0x6d7b86,roughness:.85}),dark=new T.MeshStandardMaterial({color:0x2b3238,roughness:.9}),bill=new T.MeshStandardMaterial({color:0xd8b25a,roughness:.6});
 const body=new T.Mesh(new T.SphereGeometry(1,12,8),grey);body.scale.set(.13,.11,.27);body.position.y=.62;g.add(body);
 const neck=new T.Mesh(new T.CylinderGeometry(.028,.04,.34,8),grey);neck.position.set(0,.85,.16);neck.rotation.x=-.35;g.add(neck);
 const head=new T.Group();head.position.set(0,1.02,.24);g.add(head);const skull=new T.Mesh(new T.SphereGeometry(.05,10,8),grey);skull.scale.set(1,.9,1.3);head.add(skull);const beak=new T.Mesh(new T.ConeGeometry(.018,.16,8),bill);beak.rotation.x=Math.PI/2;beak.position.set(0,-.005,.13);head.add(beak);const crest=new T.Mesh(new T.BoxGeometry(.02,.03,.08),dark);crest.position.set(0,.04,-.03);head.add(crest);
 for(const side of [-1,1]){const leg=new T.Mesh(new T.CylinderGeometry(.008,.01,.5,6),dark);leg.position.set(side*.04,.27,-.02);g.add(leg);}
 const wings=[];for(const side of [-1,1]){const w=new T.Mesh(new T.PlaneGeometry(.62,.26),new T.MeshStandardMaterial({color:0x5f6d78,roughness:.9,side:T.DoubleSide}));w.position.set(side*.31,.66,0);w.rotation.x=-Math.PI/2*.9;const pivot=new T.Group();pivot.position.set(side*.1,.66,0);w.position.set(side*.31,0,0);pivot.add(w);g.add(pivot);wings.push({pivot,side});}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return {group:g,head,wings};}
function birdMesh(scale,color){const g=new T.Group();const m=new T.MeshStandardMaterial({color,roughness:.9,side:T.DoubleSide});const body=new T.Mesh(new T.SphereGeometry(1,8,6),m);body.scale.set(.09*scale,.07*scale,.2*scale);g.add(body);const wings=[];for(const side of [-1,1]){const pivot=new T.Group();g.add(pivot);const w=new T.Mesh(new T.PlaneGeometry(.42*scale,.14*scale),m);w.position.set(side*.21*scale,0,0);w.rotation.x=-Math.PI/2;pivot.add(w);wings.push({pivot,side});}return {group:g,wings};}
export function makeWildlife(scene,{perch,cove}){
 const root=new T.Group();scene.add(root);
 const heron=createHeron(perch),hm=heronMesh();root.add(hm.group);hm.group.position.set(perch.x,perch.y,perch.z);hm.group.rotation.y=perch.heading||0;
 const geese=createGeese(),skein=skeinOffsets(GEESE.count).map(()=>birdMesh(1.6,0x3a3a3a)),skeinRoot=new T.Group();root.add(skeinRoot);for(const b of skein){skeinRoot.add(b.group);}skeinRoot.visible=false;
 const swallows=[];for(let i=0;i<8;i++){const b=birdMesh(.55,0x1e2428);root.add(b.group);b.group.visible=false;swallows.push(b);}
 const N=320,ipos=new Float32Array(N*3),iseed=new Float32Array(N);for(let i=0;i<N;i++){ipos[i*3]=(Math.random()-.5)*24;ipos[i*3+1]=.6+Math.random()*2.2;ipos[i*3+2]=(Math.random()-.5)*24;iseed[i]=Math.random();}
 const ig=new T.BufferGeometry();ig.setAttribute('position',new T.BufferAttribute(ipos,3));ig.setAttribute('seed',new T.BufferAttribute(iseed,1));
 const iu={time:{value:0},density:{value:0},center:{value:new T.Vector3()}};
 const im=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:iu,vertexShader:`attribute float seed;uniform float time,density;uniform vec3 center;varying float a;void main(){vec3 p=position;p.x+=sin(time*.7+seed*6.28)*.6;p.y+=sin(time*1.9+seed*9.1)*.25;p.z+=cos(time*.6+seed*4.4)*.6;p=center+(mod(p-center+12.,24.)-12.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=max(1.,-mv.z);gl_PointSize=clamp(28./d,1.,4.);a=density*(.35+.65*abs(sin(time*3.+seed*20.)))*smoothstep(14.,4.,d)*step(seed,density);}`,fragmentShader:`varying float a;void main(){vec2 c=gl_PointCoord-.5;float r=dot(c,c);if(r>.25)discard;gl_FragColor=vec4(.95,.9,.75,a*(1.-r*4.));}`});
 const insects=new T.Points(ig,im);insects.frustumCulled=false;insects.userData.skipReflection=true;insects.userData.skipRefraction=true;root.add(insects);
 const rise={nextAt:0};let rises=0;
 return {heron,geese,root,
  update(dt,{t,elevation,wind,kayak,camera,random=Math.random,ripple}){
   const events=[];
   for(const e of stepHeron(heron,dt,{kayak,t,random}))events.push(e);
   hm.group.visible=heron.state!=='gone';hm.group.position.set(heron.x,heron.y,heron.z);hm.group.rotation.y=heron.heading;hm.head.rotation.y=heron.headTurn;
   const flap=heron.state==='standing'?0:heron.wing;for(const w of hm.wings){w.pivot.rotation.z=-w.side*(heron.state==='standing'?.2:flap*.9+.1);}
   for(const e of stepGeese(geese,dt,{t,elevation,cove,random}))events.push(e);
   skeinRoot.visible=geese.active;if(geese.active){const off=skeinOffsets(GEESE.count);const sx=Math.sin(geese.heading),cz=Math.cos(geese.heading),rx=cz,rz=-sx;skein.forEach((b,i)=>{const o=off[i];b.group.position.set(geese.x-sx*o.back+rx*o.side,geese.y-o.drop,geese.z-cz*o.back+rz*o.side);b.group.rotation.y=geese.heading;const f=Math.sin(geese.flap+i*.7)*.75;for(const w of b.wings)w.pivot.rotation.z=-w.side*f;});}
   const sd=swallowDensity(elevation,wind);const nS=Math.round(sd*swallows.length);swallows.forEach((b,i)=>{const on=i<nS;b.group.visible=on;if(!on)return;const c={x:kayak.x,z:kayak.z};const p=swallowPos(i,t,c),q=swallowPos(i,t+.05,c);b.group.position.set(p.x,p.y,p.z);b.group.rotation.y=Math.atan2(q.x-p.x,q.z-p.z);const f=Math.sin(t*22+i)*.8;for(const w of b.wings)w.pivot.rotation.z=-w.side*f;});
   iu.time.value=t;iu.density.value=insectDensity(elevation,wind);iu.center.value.set(camera.x,0,camera.z);insects.visible=iu.density.value>.02;
   if(ripple&&riseDue(rise,t,elevation,random)){const a=random()*6.283,r=6+random()*22;ripple(kayak.x+Math.cos(a)*r,kayak.z+Math.sin(a)*r,'dimple');rises++;events.push('rise');}
   return events;},
  state(kayak){return {heron:{state:heron.state,x:+heron.x.toFixed(1),z:+heron.z.toFixed(1),y:+heron.y.toFixed(2),dist:kayak?+Math.hypot(kayak.x-heron.x,kayak.z-heron.z).toFixed(1):null,visible:hm.group.visible},geese:{active:geese.active,x:+geese.x.toFixed(0),z:+geese.z.toFixed(0),y:+geese.y.toFixed(0),flown:+geese.flown.toFixed(0),nextAt:+geese.nextAt.toFixed(0)},swallows:swallows.filter(b=>b.group.visible).length,insects:+iu.density.value.toFixed(2),rises};},
  spookHeron(kayak){if(heron.state!=='standing')return false;heron.x=heron.perch.x;heron.z=heron.perch.z;heron.state='standing';const k=kayak||{x:heron.x+5,z:heron.z};heron.state='takeoff';heron.t=0;heron.heading=Math.atan2(heron.x-k.x,heron.z-k.z);return true;},
  flyGeese(t){geese.nextAt=t;return true;}};
}
