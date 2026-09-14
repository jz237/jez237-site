// A 3.6 m sit-on-top fishing kayak: lofted hull, seat, bungees, hatch, rod holder and a paddle that
// dips when you stroke. Rides the water on the shared four-point float, drifts with the wind, stops
// on the bank, leaves a wake and stirs the ripple field with each paddle stroke.
import * as T from './vendor/three.module.js';
import {floatingPose} from './course-environment.js';
import {recordWake} from './wake-field.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const KAYAK={length:3.6,beam:.76,eyeHeight:.62,eyeForward:.35,maxSpeed:2.3,thrust:1.9,turnRate:1.05};
// the loft: the hull below the sheer, a cedar-strip deck above it with an upswept bow and stern, as
// in the concept art; u runs bow to stern, v around the ring, so strips run the length of the boat
const hullW=t=>KAYAK.beam/2*Math.pow(Math.sin(Math.PI*t),.62),hullDepth=t=>.17*Math.pow(Math.sin(Math.PI*t),.5),deckH=t=>.11+.17*Math.pow(Math.abs(t-.5)*2,2.6);
function hullGeometry(part='all'){
 const L=KAYAK.length,stations=28,ring=18,pos=[],uv=[],idx=[];
 for(let i=0;i<=stations;i++){const t=i/stations,z=(t-.5)*L;for(let j=0;j<ring;j++){const a=j/ring*Math.PI*2,c=Math.cos(a),s=Math.sin(a);const y=s<0?-hullDepth(t)*Math.pow(-s,.9):deckH(t)*Math.pow(s,.6);pos.push(hullW(t)*c*(s<0?1:.96),y,z);uv.push(t,j/ring);}}
 const deckJ=j=>Math.sin(j/ring*Math.PI*2)>=-1e-6;
 for(let i=0;i<stations;i++)for(let j=0;j<ring;j++){const j2=(j+1)%ring;const onDeck=deckJ(j)&&deckJ(j2);if(part==='deck'&&!onDeck)continue;if(part==='hull'&&onDeck)continue;const a=i*ring+j,b=i*ring+j2,c=(i+1)*ring+j,d=(i+1)*ring+j2;idx.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
// cedar strips: alternating warm tones with dark seams and a grain along the length, varnished
let woodTex=null;
export function cedarTexture(){if(woodTex)return woodTex;const W=512,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const tones=['#c9a26a','#b8894f','#d3b27a','#a97c47','#c39a63','#b28653'];const strips=12,sh=H/strips;let seed=11;const r=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<strips;i++){g.fillStyle=tones[Math.floor(r()*tones.length)];g.fillRect(0,i*sh,W,sh);
  // grain: long faint streaks
  for(let k=0;k<14;k++){const y=i*sh+r()*sh;g.strokeStyle=`rgba(${r()<.5?60:200},${r()<.5?40:150},${r()<.5?20:90},${.08+.12*r()})`;g.lineWidth=.6+r()*1.2;g.beginPath();g.moveTo(0,y);for(let x=0;x<=W;x+=32)g.lineTo(x,y+(r()-.5)*2.2);g.stroke();}
  g.fillStyle='rgba(40,24,12,.55)';g.fillRect(0,i*sh,W,1.4);}
 woodTex=new T.CanvasTexture(c);woodTex.colorSpace=T.SRGBColorSpace;woodTex.wrapS=woodTex.wrapT=T.RepeatWrapping;woodTex.anisotropy=8;return woodTex;}
// the gunwale: a dark rail along the sheer on each side, and a stem cap at each end
function railCurve(side){const pts=[];for(let i=0;i<=28;i++){const t=i/28;pts.push(new T.Vector3(side*hullW(t)*.96+side*.006,.004,(t-.5)*KAYAK.length));}return new T.CatmullRomCurve3(pts);}
export function makeKayak(scene){
 const group=new T.Group();scene.add(group);
 const shell=new T.MeshPhysicalMaterial({color:0x2f5a3e,roughness:.42,clearcoat:.45,clearcoatRoughness:.25});
 const deckMat=new T.MeshPhysicalMaterial({map:cedarTexture(),color:0xffffff,roughness:.34,clearcoat:.65,clearcoatRoughness:.18});deckMat.map.repeat.set(1,1);
 const hull=new T.Mesh(hullGeometry('hull'),shell);hull.castShadow=hull.receiveShadow=true;group.add(hull);
 const deck=new T.Mesh(hullGeometry('deck'),deckMat);deck.castShadow=deck.receiveShadow=true;group.add(deck);
 const railMat=new T.MeshStandardMaterial({color:0x2a1c12,roughness:.55,metalness:.05});for(const side of [-1,1]){const rail=new T.Mesh(new T.TubeGeometry(railCurve(side),56,.013,6,false),railMat);rail.castShadow=true;group.add(rail);}
 for(const zEnd of [-1,1]){const cap=new T.Mesh(new T.CylinderGeometry(.02,.026,.12,8),railMat);cap.position.set(0,deckH(zEnd>0?1:0)*.55,zEnd*KAYAK.length/2);cap.rotation.x=zEnd*.35;group.add(cap);}
 const dark=new T.MeshStandardMaterial({color:0x1b1b1b,roughness:.8}),grey=new T.MeshStandardMaterial({color:0x5a5f66,roughness:.7});
 const seat=new T.Mesh(new T.BoxGeometry(.42,.06,.42),dark);seat.position.set(0,.13,-.15);group.add(seat);
 const back=new T.Mesh(new T.BoxGeometry(.42,.34,.05),dark);back.position.set(0,.31,-.38);back.rotation.x=-.18;group.add(back);
 const hatchMat=new T.MeshStandardMaterial({color:0x2c3a33,roughness:.7});const hatch=new T.Mesh(new T.CylinderGeometry(.17,.19,.025,24),hatchMat);hatch.position.set(0,.145,1.05);group.add(hatch);const hatchRim=new T.Mesh(new T.TorusGeometry(.19,.012,8,28),dark);hatchRim.rotation.x=Math.PI/2;hatchRim.position.set(0,.152,1.05);group.add(hatchRim);
 const hatch2=new T.Mesh(new T.CylinderGeometry(.13,.13,.03,20),dark);hatch2.position.set(0,.16,-1.15);group.add(hatch2);
 for(const [x1,z1,x2,z2] of [[-.24,.55,.24,1.35],[.24,.55,-.24,1.35]]){const a=new T.Vector3(x1,.15,z1),b=new T.Vector3(x2,.19,z2);const len=a.distanceTo(b);const m=new T.Mesh(new T.CylinderGeometry(.006,.006,len,5),dark);m.position.copy(a).lerp(b,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());group.add(m);}
 for(const side of [-1,1]){const holder=new T.Mesh(new T.CylinderGeometry(.025,.025,.22,10),grey);holder.position.set(side*.27,.22,-.55);holder.rotation.z=side*.35;group.add(holder);}
 const paddle=new T.Group();group.add(paddle);const shaftMat=new T.MeshPhysicalMaterial({map:cedarTexture(),color:0xd9c39a,roughness:.4,clearcoat:.5});const shaft=new T.Mesh(new T.CylinderGeometry(.015,.015,2.25,8),shaftMat);shaft.rotation.z=Math.PI/2;paddle.add(shaft);
 const bladeMat=new T.MeshPhysicalMaterial({map:cedarTexture(),color:0xe6cf9e,roughness:.45,clearcoat:.5});
 for(const side of [-1,1]){const blade=new T.Mesh(new T.BoxGeometry(.42,.18,.012),bladeMat);blade.position.set(side*1.15,0,0);blade.rotation.y=side*.5;paddle.add(blade);const edge=new T.Mesh(new T.BoxGeometry(.44,.02,.016),railMat);edge.position.set(side*1.15,-.09,0);edge.rotation.y=side*.5;paddle.add(edge);}
 paddle.position.set(0,.36,.15);
 const state={x:0,z:0,heading:0,speed:0,turn:0,anchored:false,pitch:0,roll:0,y:0,strokeClock:0,strokeSide:1,wakeClock:0};
 return {group,state,paddle,
  place(x,z,heading){state.x=x;state.z=z;state.heading=heading;state.speed=0;},
  step(dt,input,env){
   // input: {paddle:-1..1, turn:-1..1, anchor:boolean}; env: {windMs, windDir(rad, toward), time, surface(x,z,t), depth(x,z), ripple(x,z,r,a)}
   if(input.anchorToggle)state.anchored=!state.anchored;
   const power=clamp(input.paddle||0,-1,1),turn=clamp(input.turn||0,-1,1);
   state.speed+=power*KAYAK.thrust*dt;state.speed-=state.speed*.85*dt+Math.sign(state.speed)*state.speed*state.speed*.18*dt;state.speed=clamp(state.speed,-1.2,KAYAK.maxSpeed);
   if(state.anchored)state.speed*=Math.exp(-dt*3);
   const rate=turn*KAYAK.turnRate*(.55+.45*Math.min(1,Math.abs(state.speed)/1.5));state.turn+=(rate-state.turn)*(1-Math.exp(-dt*5));state.heading+=state.turn*dt;
   const fx=Math.sin(state.heading),fz=Math.cos(state.heading);
   const drift=state.anchored?0:env.windMs*.028;const dx=(fx*state.speed+Math.cos(env.windDir)*drift)*dt,dz=(fz*state.speed+Math.sin(env.windDir)*drift)*dt;
   const nx=state.x+dx,nz=state.z+dz;
   if(env.depth(nx+fx*1.6,nz+fz*1.6)>.32&&env.depth(nx-fx*1.6,nz-fz*1.6)>.32&&env.depth(nx,nz)>.32){state.x=nx;state.z=nz;}else{state.speed*=-.15;}
   // paddle strokes: alternate sides while power is applied; each blade entry stirs the water
   if(Math.abs(power)>.1){state.strokeClock+=dt*1.15;if(state.strokeClock>=1){state.strokeClock-=1;state.strokeSide*=-1;const rx=Math.cos(state.heading),rz=-Math.sin(state.heading);env.ripple(state.x+rx*state.strokeSide*.75+fx*.4,state.z+rz*state.strokeSide*.75+fz*.4,.22,.006*Math.abs(power));}}
   else state.strokeClock+=(0-state.strokeClock)*(1-Math.exp(-dt*4));
   state.wakeClock+=dt;if(state.wakeClock>.25&&Math.abs(state.speed)>.45){state.wakeClock=0;recordWake(state.x-fx*1.5,state.z-fz*1.5,env.time,state.heading,Math.min(1.02,.4+Math.abs(state.speed)/KAYAK.maxSpeed*.6));}
   const pose=floatingPose(state.x,state.z,env.time,env.surface,1.2,state.heading);
   state.y+=(pose.y-state.y)*(1-Math.exp(-dt*6));state.pitch+=(pose.pitch*.8-state.pitch)*(1-Math.exp(-dt*4));state.roll+=(pose.roll*.8+state.turn*.06-state.roll)*(1-Math.exp(-dt*4));
   group.position.set(state.x,state.y+.02,state.z);group.rotation.set(state.pitch,state.heading,state.roll,'YXZ');
   const stroke=Math.abs(power)>.1?Math.sin(state.strokeClock*Math.PI*2):0;paddle.rotation.set(stroke*.25*state.strokeSide,stroke*.12,stroke*.55*state.strokeSide+.1*state.strokeSide);paddle.position.set(0,.36+Math.abs(stroke)*.05,.15);
  }};
}
