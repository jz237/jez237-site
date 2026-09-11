const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);

// Two-link inverse kinematics: articulated limbs keep their lengths while grips
// and boots remain fixed to the craft during suspension and counter-lean.
export function jointBetween(a,b,l1,l2,pole){
 const delta=b.map((v,i)=>v-a[i]),raw=Math.hypot(...delta),d=clamp(raw,.001,l1+l2-.0001),axis=delta.map(v=>v/Math.max(raw,.001));
 const along=(l1*l1-l2*l2+d*d)/(2*d),reach=Math.sqrt(Math.max(0,l1*l1-along*along));
 const towards=pole.map((v,i)=>v-a[i]),dot=towards.reduce((n,v,i)=>n+v*axis[i],0);let bend=towards.map((v,i)=>v-axis[i]*dot),len=Math.hypot(...bend);
 if(len<1e-5){bend=[axis[1],-axis[0],.01];len=Math.hypot(...bend);}
 return a.map((v,i)=>v+axis[i]*along+bend[i]/len*reach);
}
// Anatomical joint targets shared by the detailed seated and stunt riders.
// Hands remain on the rotating grips while the torso absorbs hull motion.
export function riderPose(pose='',time=0,turn=0,{speed=0,impact=0,compression=clamp(impact*.035,0,.38),load=1,airborne=false,pitch=0,roll=0,steering=turn*.3}={}){
 const crouch=clamp(compression,0,.38),breath=Math.sin(time*1.7)*.003;
 let hip=[0,.765,-.34],shoulder=[0,1.405,.075],neck=[0,1.430,.14],crown=[0,1.745,.17];
 let shoulders=[[-.225,1.392,.075],[.225,1.392,.075]],elbows=[[-.335,1.155,.355],[.335,1.155,.355]],hands=[[-.445,1.132,.704],[.445,1.132,.704]],knees=[[-.395,.635,.12],[.395,.635,.12]],feet=[[-.5,.44,-.34],[.5,.44,-.34]];
 if(!pose){
  const stance=clamp(speed/30,0,1)*.075;const shift=[turn*.10-roll*.06,stance-crouch*.85+breath,(airborne?-.06:0)+clamp(speed/30,0,1)*.06];
  hip=add(hip,[turn*.035,stance-crouch*.48,0]);shoulder=add(shoulder,shift);neck=add(neck,shift);crown=add(crown,shift);shoulders=shoulders.map(p=>add(p,shift));
  hands=hands.map(([x,y,z])=>[x*Math.cos(steering)+(z-.66)*Math.sin(steering),y,-x*Math.sin(steering)+(z-.66)*Math.cos(steering)+.66]);
  // Lean the upper body toward any grip which would otherwise overextend an
  // arm. The solver never fakes longer forearms to reach the handlebars.
  for(let pass=0;pass<4;pass++)for(let i=0;i<2;i++){const reach=hands[i].map((v,k)=>v-shoulders[i][k]),length=Math.hypot(...reach);if(length>.744){const adjust=reach.map(v=>v/length*(length-.744));shoulder=add(shoulder,adjust);neck=add(neck,adjust);crown=add(crown,adjust);shoulders=shoulders.map(p=>add(p,adjust));}}
  elbows=elbows.map((p,i)=>jointBetween(shoulders[i],hands[i],.382974,.366647,add(p,shift)));
  knees=knees.map((p,i)=>jointBetween(add(hip,[(i?1:-1)*.14,-.02,0]),feet[i],.537331,.510539,p));
  // The neck counters a fraction of hull attitude without moving the hands.
  crown=add(crown,[roll*.10,0,pitch*.11]);
 }else if(pose==='handstand'){
  hip=[0,2.12,.63];shoulder=[0,1.68,.68];neck=[0,1.55,.71];crown=[0,1.25,.73];
  shoulders=[[-.225,1.68,.68],[.225,1.68,.68]];elbows=[[-.34,1.42,.7],[.34,1.42,.7]];knees=[[-.14,2.64,.48],[.14,2.64,.48]];feet=[[-.16,3.09,.27],[.16,3.09,.27]];
 }else{
  hip=[0,1.24,-.29];shoulder=[0,1.8,-.06];neck=[0,1.875,.015];crown=[0,2.19,.045];
  shoulders=[[-.225,1.787,-.06],[.225,1.787,-.06]];elbows=[[-.35,1.45,.34],[.35,1.45,.34]];knees=[[-.32,.88,-.17],[.32,.88,-.17]];
  if(pose==='backwards'){hands=[[-.38,1.08,-.02],[.38,1.08,-.02]];elbows=[[-.35,1.46,-.11],[.35,1.46,-.11]];}
 }
 const targets={torso:[hip,shoulder],head:[neck,crown],pelvis:[hip,add(hip,[0,pose==='handstand'?-.15:.15,.015])]};
 for(let i=0;i<2;i++){
  const sign=i?1:-1,L=i?'R':'L',thigh=add(hip,[sign*.14,-.02,0]);
  targets['upperArm'+L]=[shoulders[i],elbows[i]];targets['forearm'+L]=[elbows[i],hands[i]];
  targets['hand'+L]=[hands[i],add(hands[i],[Math.sin(steering)*.095,0,Math.cos(steering)*.095])];
  targets['thigh'+L]=[thigh,knees[i]];targets['shin'+L]=[knees[i],feet[i]];
  targets['foot'+L]=[feet[i],add(feet[i],[0,pose==='handstand'?.025:-.025,pose==='handstand'?-.17:.17])];
 }
 if(pose==='somersault'){
  const a=time/1.05*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
  const rotate=p=>{const y=p[1]-1.7,z=p[2]+.25;return [p[0],1.7+y*c-z*s,-.25+y*s+z*c];};
  for(const k in targets)targets[k]=targets[k].map(rotate);
 }
 return {targets,yaw:pose==='backwards'?Math.PI:0,headYaw:pose?0:turn*.12};
}
