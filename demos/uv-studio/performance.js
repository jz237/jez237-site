// Reduce render cost, never simulation state. Slow startup/shader compilation
// and hidden-tab gaps are excluded from the sustained-frame-time sample.
// Auto also steps up: a display that stays smooth at the balanced setting for two
// sample windows gets the detailed one, and gives it back for good if it cannot hold it.
export function createPerformanceGovernor(initial='balanced'){
 let tier=initial,preference='auto',age=0,windowAge=0,samples=[],smooth=0,settled=false;
 return {choose(value){preference=value;tier=value==='auto'?initial:value;age=windowAge=0;samples=[];smooth=0;settled=false;return tier;},
 sample(dt){if(preference!=='auto'||tier==='diagram'||!Number.isFinite(dt)||dt<=0||dt>2)return null;age+=dt;if(age<5)return null;windowAge+=dt;samples.push(dt);if(windowAge<3||samples.length<12)return null;const sorted=[...samples].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];windowAge=0;samples=[];
  if(tier==='high'){if(median>1/45){tier='balanced';settled=true;age=0;return tier;}return null;}
  if(tier==='balanced'&&median>1/26){tier='light';age=0;return tier;}if(tier==='light'&&median>1/10){tier='diagram';return tier;}
  if(tier==='balanced'&&initial==='balanced'&&!settled){smooth=median<1/50?smooth+1:0;if(smooth>=2){tier='high';smooth=0;age=0;return tier;}}
  return null;},snapshot:()=>({tier,preference})};
}
