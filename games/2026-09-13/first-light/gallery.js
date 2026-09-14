// Species Gallery data: the size-class slider mapping, the field marks shown as callouts, and the
// card text. Pure module (node-testable); the DOM lives in gallery-ui.js.
import {SPECIES,ROSTER,describeFish,sizeClass} from './species.js';
export const CLASS_ORDER=['young','common','trophy','legend'];
export const CLASS_LABEL={young:'Young',common:'Common',trophy:'Trophy',legend:'Legend'};
// Real identification marks, three per species, the kind a guide points at in the net.
export const FIELD_MARKS={
 largemouth:['Upper jaw reaches past the back of the eye','Dark, blotchy stripe along the flank','Deep notch between the spiny and soft dorsal'],
 smallmouth:['Upper jaw ends below the eye','Bronze flanks with dark vertical bars','Red eye; the dorsal fins are barely notched'],
 walleye:['Large glassy eye that gathers light','White tip on the lower lobe of the tail','Dark blotch at the rear of the spiny dorsal'],
 bluegill:['Solid black ear flap','Dark blotch at the base of the soft dorsal','Small mouth; faint vertical bars'],
 musky:['Dark bars and spots on a light ground','Six or more pores under each side of the jaw','Pointed tail lobes; scales only on the upper cheek'],
 pickerel:['Chain-link pattern along the flank','Dark vertical bar below the eye','Fully scaled cheek and gill cover'],
 striper:['Stripes broken and offset below the lateral line','Deeper body and higher back than a pure striper','Two separate dorsal fins; tooth patches on the tongue'],
 catfish:['Deeply forked tail','Scattered dark spots on silver-grey sides','Four pairs of barbels; sharp pectoral and dorsal spines'],
 carp:['Two barbels at each corner of the mouth','Long dorsal fin with a serrated leading spine','Large, dark-edged scales'],
 crappie:['Seven or eight dorsal spines','Irregular black speckles rather than bars','Dorsal and anal fins nearly the same size'],
 perch:['Six to eight dark vertical bars on gold','Orange to red pelvic and anal fins','Two separate dorsal fins'],
 pumpkinseed:['Red or orange spot on the black ear flap','Wavy blue lines across the cheek','Orange belly, speckled flanks']
};
const DIEL={crepuscular:'dawn and dusk',diurnal:'daylight',nocturnal:'night'};
const STRUCT={laydown:'laydowns',dock:'the dock',weedbed:'the weed bed',stump:'stumps',pads:'the pads',riprap:'riprap'};
// Class bounds for a species: [young top, common top, trophy top, legend top (display maximum)].
export function classBounds(sp){const c=sp.classes;const legendTop=Math.max(sp.sizeRange[1],c.legend[0]*1.15);return [c.young[1],c.common[1],c.trophy[1],legendTop];}
// Slider t in [0,1] → length in metres: each quarter of the slider spans one size class.
export function lengthForSlider(sp,t){
 t=Math.max(0,Math.min(1,t));const [a,b,c,d]=classBounds(sp);const lo=[sp.sizeRange[0],a,b,c],hi=[a,b,c,d];
 const i=Math.min(3,Math.floor(t*4)),f=t*4-i;return lo[i]+(hi[i]-lo[i])*f;
}
export function sliderForLength(sp,L){
 const [a,b,c,d]=classBounds(sp);const lo=[sp.sizeRange[0],a,b,c],hi=[a,b,c,d];
 for(let i=0;i<4;i++){if(L<hi[i]||i===3){const f=Math.max(0,Math.min(1,(L-lo[i])/Math.max(1e-6,hi[i]-lo[i])));return (i+f)/4;}}
 return 1;
}
function topTechniques(sp,n=3){return Object.entries(sp.technique).filter(([k])=>k!=='idle').sort((x,y)=>y[1]-x[1]).slice(0,n).map(([k])=>k);}
function topFamilies(sp){return Object.entries(sp.lureFamily).filter(([,v])=>v>=.9).sort((x,y)=>y[1]-x[1]).map(([k])=>({topwater:'topwater',soft:'soft plastics',crank:'crankbaits',blade:'bucktails'})[k]||k);}
// Everything the panel prints for one species at one length.
export function galleryCard(id,L,journal){
 const sp=SPECIES[id];const d=describeFish(sp,L);const catches=(journal&&journal.catches||[]).filter(c=>c.species===id);
 const best=catches.reduce((m,c)=>Math.max(m,c.lengthIn||0),0);
 const fam=topFamilies(sp);
 return {id,name:sp.name,latin:sp.latin,sizeClass:d.sizeClass,classLabel:CLASS_LABEL[d.sizeClass],lengthIn:d.lengthIn,weightText:d.weightText,
  sizeText:`${CLASS_LABEL[d.sizeClass]} · ${d.lengthIn} in · ${d.weightText}`,
  holds:sp.structure.map(s=>STRUCT[s]||s).join(', '),takes:topTechniques(sp).join(', ')+(fam.length?' · '+fam.join(', '):''),
  hours:DIEL[sp.diel]||sp.diel,temp:`${sp.tempPref[0]}–${sp.tempPref[1]} °C`,
  notes:[sp.follow?'Follows the lure to the boat before it commits':null,sp.teeth?'Teeth: use the wire leader':null,sp.paperMouth?'Paper mouth: play it gently':null].filter(Boolean),
  marks:FIELD_MARKS[id]||[],count:sp.count,caught:catches.length,best:best?best.toFixed(1)+' in':null};
}
export function galleryList(){return ROSTER.map(id=>({id,name:SPECIES[id].name}));}
export {sizeClass};
