/** Top-down damage readout for the HUD: body zones, each wheel (bent, flat or torn off) and the
 * engine. Pure string output so it can be tested without a DOM. */
export type DiagramState={
  zones:{front:number;rear:number;left:number;right:number;roof:number};
  structure?:readonly number[];
  wheelDamage:ArrayLike<number>;wheelLost:ArrayLike<number>;tyreFailure:readonly number[];
  engine:number;misfiring:boolean;rearEngine:boolean;wrecked:boolean;
};
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
/** Severity colours: intact, worn, damaged, critical. */
export const DIAGRAM_COLORS=['#7f8c7a','#d9c35a','#e08a3c','#d8412f'] as const;
export function severityColor(level:number){const s=clamp01(level);return DIAGRAM_COLORS[s<.2?0:s<.45?1:s<.75?2:3];}
const zoneLevel=(state:DiagramState,i:number,key:keyof DiagramState['zones'])=>Math.max(clamp01((state.structure?.[i]??0)*1.6),clamp01(state.zones[key]/45));
export function damageDiagramSvg(state:DiagramState){
  const z=(i:number,key:keyof DiagramState['zones'])=>state.wrecked?DIAGRAM_COLORS[3]:severityColor(zoneLevel(state,i,key));
  const wheels=[[5,17],[49,17],[5,75],[49,75]].map(([x,y],i)=>{
    if(state.wheelLost[i])return `<rect class="dd-wheel dd-lost" x="${x}" y="${y}" width="6" height="16" rx="2" fill="none" stroke="${DIAGRAM_COLORS[3]}" stroke-dasharray="2 2"/>`;
    const flat=(state.tyreFailure[i]??0)>=.9;
    return `<rect class="dd-wheel${flat?' dd-flat':''}" x="${x}" y="${y}" width="6" height="16" rx="2" fill="${flat?'#2a2a28':severityColor(state.wheelDamage[i]??0)}"${flat?` stroke="${DIAGRAM_COLORS[3]}"`:''}/>`;
  }).join('');
  const ey=state.rearEngine?90:20,engine=`<circle class="dd-engine${state.misfiring?' dd-misfire':''}" cx="30" cy="${ey}" r="4" fill="${state.wrecked?DIAGRAM_COLORS[3]:severityColor(state.engine)}" stroke="#101410" stroke-width="1"/>`;
  return `<svg viewBox="0 0 60 110" width="60" height="110" role="img" aria-label="Damage diagram">`+
    `<path class="dd-front" d="M15 30 L15 14 Q15 8 21 8 L39 8 Q45 8 45 14 L45 30 Z" fill="${z(0,'front')}"/>`+
    `<path class="dd-rear" d="M15 80 L45 80 L45 96 Q45 102 39 102 L21 102 Q15 102 15 96 Z" fill="${z(1,'rear')}"/>`+
    `<rect class="dd-left" x="15" y="31" width="6" height="48" fill="${z(2,'left')}"/>`+
    `<rect class="dd-right" x="39" y="31" width="6" height="48" fill="${z(3,'right')}"/>`+
    `<rect class="dd-roof" x="22" y="37" width="16" height="36" rx="2" fill="${z(4,'roof')}"/>`+
    wheels+engine+`</svg>`;
}
