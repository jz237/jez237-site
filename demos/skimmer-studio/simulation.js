// Accelerated qualitative marine-skimmer study; not a hydraulic or chemistry solver.
export const defaults={air:65,outlet:45,depth:50,organics:60,pump:true,blocked:false,autoCare:true};
export const SERVICE_SECONDS=8,SERVICE_THRESHOLD=.78;
export function cupServicePose(progress){
 const ease=(a,b)=>{const t=Math.max(0,Math.min(1,(progress-a)/(b-a)));return t*t*(3-2*t);};
 return {lift:.72*ease(.18,.30)*(1-ease(.70,.82)),x:progress<.5?-1.7*ease(.30,.46):1.7*(1-ease(.54,.70)),visible:progress<.47||progress>.53};
}
export function createSimulation(){
 let time=0,delivery=1,airflow=65,level=4.255,foam=.637,cup=.18,concentration=.58,disturbance=0,phase=0,neckFilm=.08,exported=0,serviceElapsed=-1,serviceCount=0;
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
 function beginService(){if(serviceElapsed<0)serviceElapsed=0;}
 function snapshot(p=defaults){
  const servicing=serviceElapsed>=0,serviceProgress=servicing?serviceElapsed/SERVICE_SECONDS:0;
  const foamTop=Math.min(6.14,level+foam*2.6),flooding=level>5.52&&delivery>.1,spilling=!servicing&&cup>=.999,wetness=clamp((level-3.7)/1.65,0,1),production=!servicing&&foamTop>5.76&&foam>.04;
  return {time,delivery,airflow,level,foam,foamTop,cup,concentration,disturbance,phase,neckFilm,exported,wetness,production,flooding,spilling,servicing,serviceProgress,serviceCount,
   regime:servicing?(serviceProgress<.18?'Stopping for service':serviceProgress<.5?'Removing full cup':serviceProgress<.82?'Fitting empty cup':'Ready to restart'):!p.pump&&delivery<.02?'Stopped':flooding?'Flooding':spilling?'Cup full':disturbance>.2?'Foam disrupted':airflow<10?'Air starved':!production?'Building foam':wetness>.5?'Wet skim':'Dry / balanced',sumpLevel:.65+p.depth*.007};
 }
 return {snapshot,serviceCup:beginService,
  reset(){time=0;delivery=1;airflow=65;level=4.255;foam=.637;cup=.18;concentration=.58;disturbance=0;phase=0;neckFilm=.08;exported=0;serviceElapsed=-1;serviceCount=0;},
  empty(){cup=0;},clean(){neckFilm=0;},feed(){disturbance=1;},
  step(dt,p){
   if(!Number.isFinite(dt)||dt<=0)return snapshot(p);dt=Math.min(.1,dt);time+=dt;
   if(p.autoCare!==false&&cup>=SERVICE_THRESHOLD)beginService();
   if(serviceElapsed>=0){const before=serviceElapsed;serviceElapsed+=dt;if(before<SERVICE_SECONDS*.5&&serviceElapsed>=SERVICE_SECONDS*.5){cup=0;concentration=.58;neckFilm=0;}if(serviceElapsed>=SERVICE_SECONDS){serviceElapsed=-1;serviceCount++;}}
   const running=p.pump&&serviceElapsed<0;
   delivery+=((running?1:0)-delivery)*(1-Math.exp(-dt*2));airflow+=(p.air*delivery*(p.blocked?.12:1)-airflow)*(1-Math.exp(-dt*2.5));phase+=dt*delivery;
   const sump=.65+p.depth*.007,target=running?3.4+p.outlet*.019+(p.depth-50)*.015:sump;level+=(target-level)*(1-Math.exp(-dt*.8));disturbance=Math.max(0,disturbance-dt/14);
   const stable=(1-disturbance*.94)*(1-neckFilm*.28),targetFoam=airflow/100*(.5+p.organics*.008)*stable;foam+=(targetFoam-foam)*(1-Math.exp(-dt*1.2));
   const s=snapshot(p),rate=s.servicing?0:s.flooding?.095:Math.max(0,s.foamTop-5.76)*foam*.05,add=rate*dt,strength=s.flooding?.08:clamp(.92-s.wetness*.8,.12,.9);
   if(add>0){concentration=(concentration*cup+strength*add)/Math.max(.0001,cup+add);cup=Math.min(p.autoCare!==false?SERVICE_THRESHOLD:1,cup+add);exported+=add*strength;neckFilm=Math.min(1,neckFilm+add*.07);}
   if(p.autoCare!==false&&cup>=SERVICE_THRESHOLD)beginService();
   return snapshot(p);
  }
 };
}
