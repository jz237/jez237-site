/** Top-down damage readout for the HUD: body zones, each wheel (bent, flat or torn off) and the
 * engine. Pure string output so it can be tested without a DOM. */
export type DiagramState={
  zones:{front:number;rear:number;left:number;right:number;roof:number};
  structure?:readonly number[];
  wheelDamage:ArrayLike<number>;wheelLost:ArrayLike<number>;tyreFailure:readonly number[];
  engine:number;misfiring:boolean;rearEngine:boolean;wrecked:boolean;
  /** Bolt-on parts: intact, hanging loose or gone (omitted parts are not drawn). */
  parts?:{frontBumper?:PartState;rearBumper?:PartState;hood?:PartState;
    /** Front wings, the boot lid and the doors: drawn only once they hang loose or have gone. */
    wingLeft?:PartState;wingRight?:PartState;boot?:PartState;doorLeft?:PartState;doorRight?:PartState;doorRearLeft?:PartState;doorRearRight?:PartState};
  /** Leak severity 0..1: drops under the radiator (coolant), the engine (oil) and the fuel tank (fuel). */
  leaks?:{oil:number;coolant:number;fuel?:number};
  /** Mechanical faults drawn over the car: disc glow 0..1 per wheel, front steering links (0 = tie rod snapped), loose-nut
   * looseness per wheel, a broken diff's axle, a torn-off exhaust and a seized engine. */
  faults?:{hotDiscs?:ArrayLike<number>;steerLink?:ArrayLike<number>;looseWheels?:ArrayLike<number>;diff?:'front'|'rear'|null;exhaustGone?:boolean;seized?:boolean;
    /** Anti-roll bars front/rear (0 = snapped), propshaft state, wheel-bearing wear per wheel, fan belt and battery, short steering lock (signed). */
    rollBar?:ArrayLike<number>;propshaft?:'bent'|'snapped'|null;bearings?:ArrayLike<number>;belt?:'slipping'|'snapped'|null;battery?:number;steerSkew?:number;
    /** The fuel tank dragging on its neck or torn off, parted throttle and handbrake cables, and the battery thrown out. */
    tank?:'down'|'gone'|null;throttleCable?:boolean;handbrakeCable?:boolean;batteryOut?:boolean;
    /** A rod thrown through the block, and the tyres alight (a brake fire or a rubbing tyre), 1 per burning wheel. */
    rodThrown?:boolean;tyresAlight?:ArrayLike<number>};
};
export type PartState='ok'|'loose'|'gone';
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
/** Severity colours: intact, worn, damaged, critical. */
export const DIAGRAM_COLORS=['#7f8c7a','#d9c35a','#e08a3c','#d8412f'] as const;
export function severityColor(level:number){const s=clamp01(level);return DIAGRAM_COLORS[s<.2?0:s<.45?1:s<.75?2:3];}
const zoneLevel=(state:DiagramState,i:number,key:keyof DiagramState['zones'])=>Math.max(clamp01((state.structure?.[i]??0)*1.6),clamp01(state.zones[key]/45));
function partShape(cls:string,shape:string,s:PartState|undefined){
  if(!s)return '';
  if(s==='gone')return shape.replace('/>',` class="${cls} dd-gone" fill="none" stroke="${DIAGRAM_COLORS[3]}" stroke-dasharray="2 2"/>`);
  return shape.replace('/>',` class="${cls}${s==='loose'?' dd-loose':''}" fill="${s==='loose'?DIAGRAM_COLORS[2]:'#5d6a59'}"/>`);
}
const drop=(cls:string,x:number,y:number,fill:string)=>`<path class="${cls}" d="M${x} ${y-3.2} Q${x+2.4} ${y} ${x+2.2} ${y+.9} A2.2 2.2 0 1 1 ${x-2.2} ${y+.9} Q${x-2.4} ${y} ${x} ${y-3.2} Z" fill="${fill}" stroke="#101410" stroke-width=".6"/>`;
function leaks(state:DiagramState){
  const l=state.leaks;if(!l)return '';const ey=state.rearEngine?90:20;
  return (l.coolant>0?drop('dd-leak dd-leak-coolant',22,15,'#4fbf74'):'')+(l.oil>0?drop('dd-leak dd-leak-oil',38,ey+3,'#141210'):'')+((l.fuel??0)>0?drop('dd-leak dd-leak-fuel',state.rearEngine?38:30,state.rearEngine?14:96,'#d9a441'):'');
}
function parts(state:DiagramState){
  const p=state.parts;if(!p)return '';
  return partShape('dd-bumper-front','<rect x="17" y="2.5" width="26" height="4" rx="1.5"/>',p.frontBumper)+partShape('dd-bumper-rear','<rect x="17" y="103.5" width="26" height="4" rx="1.5"/>',p.rearBumper)+
    (p.hood&&p.hood!=='ok'?partShape('dd-hood','<rect x="20" y="11" width="20" height="16" rx="2"/>',p.hood):'')+
    BODY_PARTS.map(([key,cls,shape])=>p[key]&&p[key]!=='ok'?bodyPartShape(cls,shape,p[key]):'').join('');
}
/** Parts drawn over the body zones: a gone one leaves a dark gap with a dashed edge, a loose one is outlined, so both read
 * over a red zone. */
function bodyPartShape(cls:string,shape:string,s:PartState){
  return s==='gone'?shape.replace('/>',` class="${cls} dd-gone" fill="#151815" stroke="${DIAGRAM_COLORS[3]}" stroke-width=".7" stroke-dasharray="1.6 1.2"/>`)
    :shape.replace('/>',` class="${cls} dd-loose" fill="${DIAGRAM_COLORS[1]}" stroke="#101410" stroke-width=".6"/>`);
}
const BODY_PARTS:readonly [keyof NonNullable<DiagramState['parts']>,string,string][]=[
  ['wingLeft','dd-wing dd-wing-left','<rect x="15.5" y="11" width="3.5" height="18" rx="1"/>'],['wingRight','dd-wing dd-wing-right','<rect x="41" y="11" width="3.5" height="18" rx="1"/>'],
  ['boot','dd-boot','<rect x="20" y="84" width="20" height="13" rx="2"/>'],
  ['doorLeft','dd-door dd-door-left','<rect x="15.5" y="33" width="5" height="20" rx="1"/>'],['doorRight','dd-door dd-door-right','<rect x="39.5" y="33" width="5" height="20" rx="1"/>'],
  ['doorRearLeft','dd-door dd-door-rear-left','<rect x="15.5" y="55" width="5" height="20" rx="1"/>'],['doorRearRight','dd-door dd-door-rear-right','<rect x="39.5" y="55" width="5" height="20" rx="1"/>'],
];
const WHEEL_AT=[[5,17],[49,17],[5,75],[49,75]] as const;
function faults(state:DiagramState){
  const f=state.faults;if(!f)return '';let out='';
  WHEEL_AT.forEach(([x,y],i)=>{
    if(state.wheelLost[i])return;
    if((f.looseWheels?.[i]??0)>=.35)out+=`<rect class="dd-loose-wheel" x="${x-1}" y="${y-1}" width="8" height="18" rx="2.5" fill="none" stroke="${DIAGRAM_COLORS[1]}" stroke-width=".8" stroke-dasharray="1.5 1.2"/>`;
    const glow=clamp01(f.hotDiscs?.[i]??0);if(glow>0)out+=`<circle class="dd-hot" cx="${x+3}" cy="${y+8}" r="2.3" fill="#ff6a1f" opacity="${(.35+.65*glow).toFixed(2)}"/>`;
    if(i<2&&f.steerLink&&f.steerLink[i]===0)out+=`<line class="dd-tierod" x1="${i?x:x+6}" y1="${y+11}" x2="${i?x-4:x+10}" y2="${y+14}" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.4" stroke-linecap="round"/>`;
  });
  if(f.diff){const y=f.diff==='front'?25:83;out+=`<path class="dd-diff" d="M26 ${y-4} L34 ${y+4} M34 ${y-4} L26 ${y+4}" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.6" stroke-linecap="round"/>`;}
  // A snapped anti-roll bar: the bar across that axle, broken in the middle.
  [25,83].forEach((y,a)=>{if(f.rollBar&&f.rollBar[a]===0)out+=`<path class="dd-rollbar" d="M12 ${y} L27 ${y-1.5} M33 ${y+1.5} L48 ${y}" stroke="${DIAGRAM_COLORS[2]}" stroke-width="1.1" stroke-linecap="round"/>`;});
  // The propshaft down the middle: kinked when bent, broken when snapped.
  if(f.propshaft==='bent')out+=`<path class="dd-prop dd-prop-bent" d="M30 ${state.rearEngine?30:26} L30 50 L32.5 55 L30 60 L30 82" fill="none" stroke="${DIAGRAM_COLORS[1]}" stroke-width="1.1" stroke-linejoin="round"/>`;
  else if(f.propshaft==='snapped')out+=`<path class="dd-prop dd-prop-snapped" d="M30 26 L30 51 M31.5 59 L30 82" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.3" stroke-linecap="round"/>`;
  // A failing bearing rings its wheel: amber while it growls, red once seized.
  WHEEL_AT.forEach(([x,y],i)=>{const w=f.bearings?.[i]??0;if(state.wheelLost[i]||w<.2)return;
    out+=`<rect class="dd-bearing${w>=1?' dd-bearing-seized':''}" x="${x-1.6}" y="${y-1.6}" width="9.2" height="19.2" rx="3" fill="none" stroke="${w>=1?DIAGRAM_COLORS[3]:DIAGRAM_COLORS[2]}" stroke-width="${w>=1?1.2:.8}"/>`;});
  // The fan belt in front of the engine, and the battery beside it once the belt has gone.
  if(f.belt){const ey=state.rearEngine?90:20,by=state.rearEngine?ey+6.5:ey-6.5;
    out+=`<ellipse class="dd-belt dd-belt-${f.belt}" cx="30" cy="${by}" rx="4.2" ry="1.6" fill="none" stroke="${f.belt==='snapped'?DIAGRAM_COLORS[3]:DIAGRAM_COLORS[1]}" stroke-width=".9"${f.belt==='snapped'?' stroke-dasharray="2.2 1.4"':''}/>`;
    if(f.belt==='snapped'){const b=clamp01(f.battery??1);out+=`<rect class="dd-battery" x="38" y="${state.rearEngine?92:12}" width="5" height="3.4" rx=".5" fill="${b<=0?DIAGRAM_COLORS[3]:b<.35?DIAGRAM_COLORS[2]:DIAGRAM_COLORS[1]}" stroke="#101410" stroke-width=".4"/>`;}}
  // Short lock: a stop mark on the inside of the front wheel on the side that will not turn fully.
  if(Math.abs(f.steerSkew??0)>=.15){const left=(f.steerSkew??0)<0,x=left?12.5:47.5;out+=`<line class="dd-short-lock" x1="${x}" y1="18" x2="${x}" y2="32" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.3" stroke-linecap="round"/>`;}
  // The fuel tank under the tank end: an amber dashed box while it drags, a red crossed-out box once it has torn off.
  if(f.tank){const ty=state.rearEngine?9:96,gone=f.tank==='gone';out+=`<rect class="dd-tank dd-tank-${f.tank}" x="25" y="${ty}" width="10" height="5" rx="1" fill="none" stroke="${gone?DIAGRAM_COLORS[3]:DIAGRAM_COLORS[2]}" stroke-width=".9" stroke-dasharray="${gone?'.8 1.2':'1.6 1'}"/>`;
    if(gone)out+=`<path class="dd-tank-gone" d="M25 ${ty} L35 ${ty+5} M35 ${ty} L25 ${ty+5}" stroke="${DIAGRAM_COLORS[3]}" stroke-width=".7"/>`;}
  // A parted throttle cable: broken from the engine towards the cabin; parted handbrake cables: broken towards the rear axle.
  if(f.throttleCable){const ey=state.rearEngine?90:20,d=state.rearEngine?-1:1;out+=`<path class="dd-throttle-cable" d="M33.5 ${ey+5*d} L33.5 ${ey+9*d} M33.5 ${ey+11*d} L33.5 ${ey+15*d}" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.1" stroke-linecap="round"/>`;}
  // The battery thrown out: an empty crossed-out box in the engine bay where it sat (dark, to show on any zone colour).
  if(f.batteryOut){const by=state.rearEngine?86:20;out+=`<rect class="dd-battery-out" x="16" y="${by}" width="6" height="4" rx=".6" fill="none" stroke="#141210" stroke-width=".8" stroke-dasharray=".9 .8"/><path d="M16 ${by} L22 ${by+4} M22 ${by} L16 ${by+4}" stroke="#141210" stroke-width=".7"/>`;}
  if(f.handbrakeCable)out+=`<path class="dd-handbrake-cable" d="M26.5 62 L26.5 70 M26.5 73 L26.5 81" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.1" stroke-linecap="round"/>`;
  // Tyres on fire: a flame beside each burning wheel.
  if(f.tyresAlight)WHEEL_AT.forEach(([x,y],i)=>{if(!f.tyresAlight![i])return;const cx=x<30?2.6:57.4,cy=y+8;
    out+=`<path class="dd-tyre-fire" d="M${cx} ${cy+3.5} Q${cx-2.3} ${cy} ${cx} ${cy-3.5} Q${cx+2.3} ${cy} ${cx} ${cy+3.5} Z" fill="#ff8a1a"/><path d="M${cx} ${cy+2.5} Q${cx-1} ${cy+.5} ${cx} ${cy-1.2} Q${cx+1} ${cy+.5} ${cx} ${cy+2.5} Z" fill="#ffd34a"/>`;});
  // A rod through the block: a crack across the engine and the chunk it threw out.
  if(f.rodThrown){const ey=state.rearEngine?90:20;out+=`<path class="dd-rod" d="M27.4 ${ey-3} L30.4 ${ey-.6} L28.8 ${ey+.8} L32.4 ${ey+3.4}" stroke="${DIAGRAM_COLORS[3]}" stroke-width=".9" fill="none" stroke-linejoin="round"/><circle class="dd-rod-chunk" cx="35" cy="${ey-4.2}" r="1.1" fill="#141210" stroke="${DIAGRAM_COLORS[3]}" stroke-width=".45"/>`;}
  if(f.exhaustGone)out+=`<line class="dd-exhaust-gone" x1="${state.rearEngine?36:24}" y1="104" x2="${state.rearEngine?36:24}" y2="109" stroke="${DIAGRAM_COLORS[3]}" stroke-width="1.2" stroke-dasharray="1.2 1"/>`;
  return out;
}
export function damageDiagramSvg(state:DiagramState){
  const z=(i:number,key:keyof DiagramState['zones'])=>state.wrecked?DIAGRAM_COLORS[3]:severityColor(zoneLevel(state,i,key));
  const wheels=WHEEL_AT.map(([x,y],i)=>{
    if(state.wheelLost[i])return `<rect class="dd-wheel dd-lost" x="${x}" y="${y}" width="6" height="16" rx="2" fill="none" stroke="${DIAGRAM_COLORS[3]}" stroke-dasharray="2 2"/>`;
    const flat=(state.tyreFailure[i]??0)>=.9;
    return `<rect class="dd-wheel${flat?' dd-flat':''}" x="${x}" y="${y}" width="6" height="16" rx="2" fill="${flat?'#2a2a28':severityColor(state.wheelDamage[i]??0)}"${flat?` stroke="${DIAGRAM_COLORS[3]}"`:''}/>`;
  }).join('');
  const ey=state.rearEngine?90:20,seized=!!state.faults?.seized,engine=`<circle class="dd-engine${state.misfiring?' dd-misfire':''}${seized?' dd-seized':''}" cx="30" cy="${ey}" r="4" fill="${state.wrecked?DIAGRAM_COLORS[3]:seized?'#1a1a18':severityColor(state.engine)}" stroke="${seized?DIAGRAM_COLORS[3]:'#101410'}" stroke-width="1"/>`;
  return `<svg viewBox="0 0 60 110" width="60" height="110" role="img" aria-label="Damage diagram">`+
    `<path class="dd-front" d="M15 30 L15 14 Q15 8 21 8 L39 8 Q45 8 45 14 L45 30 Z" fill="${z(0,'front')}"/>`+
    `<path class="dd-rear" d="M15 80 L45 80 L45 96 Q45 102 39 102 L21 102 Q15 102 15 96 Z" fill="${z(1,'rear')}"/>`+
    `<rect class="dd-left" x="15" y="31" width="6" height="48" fill="${z(2,'left')}"/>`+
    `<rect class="dd-right" x="39" y="31" width="6" height="48" fill="${z(3,'right')}"/>`+
    `<rect class="dd-roof" x="22" y="37" width="16" height="36" rx="2" fill="${z(4,'roof')}"/>`+
    parts(state)+wheels+engine+leaks(state)+faults(state)+`</svg>`;
}
