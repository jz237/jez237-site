/** Top-down damage readout for the HUD: body zones, each wheel (bent, flat or torn off) and the
 * engine. Pure string output so it can be tested without a DOM. */
export type DiagramState={
  zones:{front:number;rear:number;left:number;right:number;roof:number};
  structure?:readonly number[];
  wheelDamage:ArrayLike<number>;wheelLost:ArrayLike<number>;tyreFailure:readonly number[];
  engine:number;misfiring:boolean;rearEngine:boolean;wrecked:boolean;
  /** Bolt-on parts: intact, hanging loose or gone (omitted parts are not drawn). */
  parts?:{frontBumper?:PartState;rearBumper?:PartState;hood?:PartState};
  /** Leak severity 0..1: drops under the radiator (coolant), the engine (oil) and the fuel tank (fuel). */
  leaks?:{oil:number;coolant:number;fuel?:number};
  /** Mechanical faults drawn over the car: disc glow 0..1 per wheel, front steering links (0 = tie rod snapped), loose-nut
   * looseness per wheel, a broken diff's axle, a torn-off exhaust and a seized engine. */
  faults?:{hotDiscs?:ArrayLike<number>;steerLink?:ArrayLike<number>;looseWheels?:ArrayLike<number>;diff?:'front'|'rear'|null;exhaustGone?:boolean;seized?:boolean};
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
    (p.hood&&p.hood!=='ok'?partShape('dd-hood','<rect x="20" y="11" width="20" height="16" rx="2"/>',p.hood):'');
}
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
