// Accelerated teaching model, not ReefMat firmware or measured hydraulics.
export const defaults={pump:true,flow:55,load:45,sump:20,jammed:false,autoCare:true};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function rollRadii(remaining){return {clean:Math.sqrt(.19**2+(.68**2-.19**2)*clamp(remaining)),dirty:Math.sqrt(.19**2+(.68**2-.19**2)*(1-clamp(remaining)))};}
export function servicePose(progress){if(progress<0)return {lift:0,opacity:1};return {lift:progress<.3?progress/.3*1.15:progress<.7?1.15:(1-progress)/.3*1.15,opacity:progress<.3?1:progress<.45?1-(progress-.3)/.15:progress<.55?0:progress<.7?(progress-.55)/.15:1};}
export function createSimulation(){
 let time,waterPhase,loading,level,remaining,travel,cycles,services,pulse,delay,service,renewed,manual,exported;
 function reset(){time=0;waterPhase=0;loading=.31;level=2.04;remaining=.82;travel=0;cycles=0;services=0;pulse=0;delay=0;service=-1;renewed=false;manual=false;exported=0;}
 function replace(){if(service<0){service=0;pulse=0;manual=false;renewed=false;}}
 function snapshot(p=defaults){const outside=.75+p.sump/100*2.55,high=outside>=2.95,servicing=service>=0,empty=remaining<=0,advancing=pulse>0&&!p.jammed&&!high&&!servicing&&!empty&&p.pump;
  const bypass=level>=3.28&&p.pump&&!servicing,regime=servicing?'Replacing the roll':!p.pump?'Inflow stopped':high?'High sump • drive inhibited':p.jammed?'Drive jam • inspect':empty?'Roll exhausted':advancing?'Advancing fresh fleece':bypass?'Emergency bypass':level>2.82?'Level sensor wet':'Filtering';
  return {time,waterPhase,loading,level,remaining,travel,cycles,services,exported,advancing,servicing,serviceProgress:service<0?-1:service/9,high,bypass,outside,regime,pulse,velocity:p.pump&&!servicing?p.flow:0,...rollRadii(remaining)};
 }
 function step(dt,p){if(!(dt>0)||!Number.isFinite(dt))return;for(let left=dt;left>1e-8;){const h=Math.min(left,.05);left-=h;time+=h;delay=Math.max(0,delay-h);
   if(service>=0){service+=h;if(service>=4.5&&!renewed){remaining=1;loading=.04;renewed=true;level=1.85;}if(service>=9){service=-1;services++;}continue;}
   if(p.autoCare&&remaining<.055){replace();continue;}
   const s=snapshot(p),inflow=p.pump?p.flow/100:0;waterPhase+=h*inflow;
   loading=clamp(loading+h*inflow*p.load/100*.052);
   const target=p.pump?Math.max(s.outside+.18,1.55+inflow*.45+loading*1.75):Math.max(1.2,s.outside);
   level+= (Math.min(3.38,target)-level)*(1-Math.exp(-h*1.8));
   if((level>=2.90||manual)&&delay===0&&pulse<=0&&!s.high&&!p.jammed&&remaining>0&&p.pump){pulse=2.2;cycles++;manual=false;}
   if(pulse>0){if(s.high||p.jammed||!p.pump||remaining<=0){pulse=0;delay=1;}else{const delta=Math.min(remaining,h*.024);remaining=clamp(remaining-delta);travel+=delta*28;exported+=delta*loading;loading=clamp(loading-h*.31);pulse=Math.max(0,pulse-h);if(!pulse)delay=2.5;}}
  }}
 reset();return {step,snapshot,reset,replace,advance(){manual=true;},seed(values){if(values.loading!==undefined)loading=clamp(values.loading);if(values.remaining!==undefined)remaining=clamp(values.remaining);if(values.level!==undefined)level=clamp(values.level,1.2,3.38);}};
}
