const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);

// Anatomical joint targets shared by the detailed seated and stunt riders.
// Hands remain on the rotating grips while the torso absorbs hull motion.
export function riderPose(pose='',time=0,turn=0,{speed=0,impact=0,steering=turn*.3}={}){
 const compression=clamp(impact/10,0,1),breath=Math.sin(time*1.7)*.003;
 let hip=[0,.765,-.34],shoulder=[0,1.405,.075],neck=[0,1.430,.14],crown=[0,1.745,.17];
 let shoulders=[[-.225,1.392,.075],[.225,1.392,.075]],elbows=[[-.335,1.155,.355],[.335,1.155,.355]],hands=[[-.445,1.132,.704],[.445,1.132,.704]],knees=[[-.395,.635,.12],[.395,.635,.12]],feet=[[-.5,.44,-.34],[.5,.44,-.34]];
 if(!pose){
  const shift=[turn*.023,-compression*.055+breath,clamp(speed/30,0,1)*.022];
  hip=add(hip,[turn*.008,-compression*.02,0]);shoulder=add(shoulder,shift);neck=add(neck,shift);crown=add(crown,shift);shoulders=shoulders.map(p=>add(p,shift));
  hands=hands.map(([x,y,z])=>[x*Math.cos(steering)+(z-.66)*Math.sin(steering),y,-x*Math.sin(steering)+(z-.66)*Math.cos(steering)+.66]);
  elbows=elbows.map((p,i)=>add(p,mix(shift,hands[i].map((v,k)=>v-[-.445+i*.89,1.132,.704][k]),.5)));
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
