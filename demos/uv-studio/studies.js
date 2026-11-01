import {defaults,physics,clamp,SERVICE_SECONDS} from './simulation.js?v=5';
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const ramp=(t,a,b)=>ease((t-a)/(b-a));
// Separate threaded rotation, axial withdrawal, dry connector release and
// sleeve handling. Values are teaching geometry, not a manufacturer's turns.
export function servicePose(progress){
 const t=clamp(progress)*SERVICE_SECONDS;
 const unscrew=ramp(t,1.8,3.8)*(1-ramp(t,19.2,20));
 const withdrawn=ramp(t,4,7.6)*(1-ramp(t,17.5,19.2));
 const unplugged=ramp(t,8,8.7)*(1-ramp(t,17.1,17.5));
 const lampAside=ramp(t,8.7,9.8)*(1-ramp(t,16.7,17.1));
 const sleeveOut=ramp(t,12,13.2)*(1-ramp(t,16,16.7));
 return {capAngle:-Math.PI*4*unscrew,capX:5.3*withdrawn+.32*unscrew,
  lampX:5.3*withdrawn,lampZ:1.15*lampAside,socketX:5.3*withdrawn+.5*unplugged,
  sleeveX:5.2*sleeveOut,sealCompression:1-.16*(1-unscrew),wet:sleeveOut,
  connectorDetached:unplugged>.95};
}

export const COMPARISONS={
 sleeve:{title:'Clean / fouled quartz',a:'Clean sleeve',b:'Fouled sleeve',left:{fouling:0},right:{fouling:80},note:'Only sleeve fouling differs. Water and lamp settings are identical.'},
 lamp:{title:'Fresh / aged lamp',a:'Fresh output',b:'Reduced output',left:{output:100},right:{output:35},note:'Both lamps can look lit. Violet rays illustrate relative UV output, not visible brightness or a measured dose.'},
 flow:{title:'Reference / faster flow',a:'Reference delivery',b:'Faster delivery',left:{flow:55},right:{flow:95},note:'The faster parcel exits sooner. Less time per pass also means more water passing through per unit time.'}
};
const reference=physics(defaults),referenceTransit=1/(defaults.flow/100*.12);
export function createComparison(){let kind='sleeve',elapsed=0,lanes=[];
 function reset(next=kind){kind=COMPARISONS[next]?next:'sleeve';elapsed=0;const c=COMPARISONS[kind];lanes=[c.left,c.right].map((props,i)=>({settings:{...defaults,...props},label:i?c.b:c.a,progress:0,contact:0,exposure:0,complete:false,travel:0}));}
 reset();return {reset,step(dt,controls){dt=clamp(dt,0,.1);elapsed+=dt;for(const lane of lanes){const p=physics({...lane.settings,pump:controls.pump,lamp:controls.lamp});lane.travel+=p.flow*dt;if(lane.complete)continue;const transit=p.flow>.01?Math.min(dt,(1-lane.progress)/(.12*p.flow)):dt;lane.contact+=transit;lane.exposure+=transit*p.intensity/(reference.intensity*referenceTransit);lane.progress=clamp(lane.progress+transit*p.flow*.12);lane.complete=lane.progress>=1-1e-9;if(lane.complete)lane.progress=1;}},snapshot(controls=defaults){return {kind,elapsed,title:COMPARISONS[kind].title,note:COMPARISONS[kind].note,lanes:lanes.map(l=>({...physics({...l.settings,pump:controls.pump,lamp:controls.lamp}),...l,settings:{...l.settings}}))};}};
}

const CASES=[
 {fault:'sleeve',settings:{fouling:86},observations:{flow:'The inlet and outlet have normal circulation.',sleeve:'A chalky film covers much of the wet quartz surface.',lamp:'The lamp is within its stated service interval; electrical supply is present.'},repair:{fouling:0},explanation:'Sleeve deposits attenuate UV before it reaches the water. Cleaning the optical barrier addresses this case.'},
 {fault:'lamp',settings:{output:22},observations:{flow:'Circulation is normal.',sleeve:'The quartz is clean and its seating surfaces appear intact.',lamp:'The lamp has exceeded its manufacturer-specified replacement interval. A visible glow does not establish UV output.'},repair:{output:100},explanation:'The lamp is overdue for replacement. A clean sleeve cannot restore diminished lamp output.'},
 {fault:'pump',settings:{pump:false},observations:{flow:'Neither inlet nor outlet shows circulation. The supply pump is stopped.',sleeve:'The quartz has no significant deposit buildup.',lamp:'UV is held off by this model’s no-flow teaching safeguard. This is not a feature claim for the real unit.'},repair:{pump:true},explanation:'The primary fault is stopped circulation. This demonstration restores flow before allowing its UV overlay to resume.'},
 {fault:'flow',settings:{flow:98},observations:{flow:'The parcel crosses much faster than the reference journey; delivery was increased.',sleeve:'The sleeve is reasonably clean.',lamp:'Lamp output is at the reference setting and its service record is current.'},repair:{flow:defaults.flow},explanation:'Higher delivery shortened contact time. Returning to the reference setting restores this comparison, not a validated treatment dose.'}
];
export function createInvestigation(){let index=-1,active=false,diagnosed=false,fixed=false,inspected=[],feedback='';
 return {start(){index=(index+1)%CASES.length;active=true;diagnosed=fixed=false;inspected=[];feedback='Inspect the evidence, then choose a diagnosis.';return {...defaults,...CASES[index].settings};},
 inspect(key){if(!active)return '';if(!inspected.includes(key))inspected.push(key);return CASES[index].observations[key]||'';},
 diagnose(fault){if(!active)return false;diagnosed=fault===CASES[index].fault;feedback=diagnosed?CASES[index].explanation:'That diagnosis does not fit this case. Inspect the other evidence and try again.';return diagnosed;},
 repair(){return active&&diagnosed?{...CASES[index].repair}:null;},markFixed(){if(diagnosed){fixed=true;feedback='Correction complete. Compare the current result with the starting condition.';}},clear(){active=false;},
 snapshot(){return {active,caseNumber:index+1,diagnosed,fixed,inspected:[...inspected],feedback,needsService:active&&['sleeve','lamp'].includes(CASES[index].fault)};}};
}
