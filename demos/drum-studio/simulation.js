// Qualitative gravity-fed teaching model. No flow capacity or installation prediction.
export const SECTORS=72, TAU=Math.PI*2;
export const defaults={flow:65,solids:55,aperture:60,pressure:100,auto:true,pump:true,wasteBlocked:false};
export function createSimulation(){
 let s,loads;function reset(){loads=new Float64Array(SECTORS).fill(.12);s={time:0,angle:0,phase:'filter',phaseTime:0,cycles:0,exported:0,captured:0,passed:0,head:.09,cleanLevel:2.31,dirtyLevel:2.4,alarm:null,rinse:false,turning:false,trigger:false,flow:0,meanLoad:.12};}reset();
 const mean=()=>loads.reduce((a,b)=>a+b,0)/SECTORS;
 function request(){if(s.phase==='filter'||s.phase==='settle'){s.phase='sense';s.phaseTime=0;return true;}return false;}
 function step(dt,c){
  if(!(dt>0))return;s.time+=dt;s.phaseTime+=dt;
  const flow=c.pump?c.flow/100:0,capture=c.aperture<=60?.86:c.aperture<=100?.62:.38;
  s.flow=flow;s.rinse=false;s.turning=false;
  for(let i=0;i<SECTORS;i++){const a=i/SECTORS*TAU+s.angle;const below=1.8+1.28*Math.cos(a)<s.dirtyLevel;
   if(below&&flow>0){const add=dt*.065*(c.solids/100)*flow*capture;loads[i]=Math.min(.98,loads[i]+add);s.captured+=add/SECTORS;}
  }
  s.passed+=dt*.065*(c.solids/100)*flow*(1-capture);
  s.meanLoad=mean();const target=flow*(.055+1.18*s.meanLoad*s.meanLoad);
  s.head+=(target-s.head)*Math.min(1,dt*1.6);s.cleanLevel=s.dirtyLevel-s.head;s.trigger=s.head>.27;
  if(s.phase==='filter'&&s.trigger&&c.auto&&c.pump)request();
  if(s.phase==='sense'&&s.phaseTime>=.8){s.phase='rinse';s.phaseTime=0;}
  if(s.phase==='rinse'){
   if(c.wasteBlocked){s.phase='fault';s.alarm='Waste route obstructed';s.phaseTime=0;}
   else if(!c.pump){s.phase='fault';s.alarm='Water supply stopped';s.phaseTime=0;}
   else {s.turning=true;s.rinse=c.pressure>0;s.angle+=dt*TAU/11;
    for(let i=0;i<SECTORS;i++){const a=(i/SECTORS*TAU+s.angle)%TAU,nearTop=Math.min(a,TAU-a)<.23;
     if(nearTop){const removed=Math.min(loads[i],dt*2.3*c.pressure/100*loads[i]);loads[i]-=removed;s.exported+=removed/SECTORS;}}
    if(s.phaseTime>=11.8){if(mean()>.38){s.phase='fault';s.alarm='Screen still restricted';}else{s.phase='settle';s.cycles++;}s.phaseTime=0;s.rinse=false;s.turning=false;}
   }
  }else if(s.phase==='settle'&&s.phaseTime>2){s.phase='filter';s.phaseTime=0;}
  s.meanLoad=mean();
 }
 function preset(id){reset();if(id==='loaded'||id==='no-rinse'||id==='blocked-waste'){loads.fill(.65);s.head=.36;s.cleanLevel=2.04;}if(id==='pump-off'){s.head=.24;s.cleanLevel=2.16;}}
 return {step,reset,request,preset,loads:()=>loads,snapshot:()=>({...s,loads:Array.from(loads)})};
}
