// Species tables: behaviour tunables, size classes and length-weight curves. Largemouth first;
// the rest of the roster lands in M3. Lengths in metres, weights in kg, ages in in-game days.
const IN=0.0254,LB=0.45359237;
export const SPECIES={
 largemouth:{id:'largemouth',name:'Largemouth bass',latin:'Micropterus salmoides',
  sizeRange:[.22,.62],classes:{young:[0,12*IN],common:[12*IN,18*IN],trophy:[18*IN,22*IN],legend:[22*IN,99]},
  // classic bass formula: pounds = inches^3 / 1600
  weightKg:L=>Math.pow(L/IN,3)/1600*LB,
  diel:'crepuscular',boldness:[.35,.8],tempPref:[18,27],structure:['laydown','dock','weedbed','stump','pads'],
  detect:{sight:3.2,lateral:4.5},inspectDistance:.7,inspectSeconds:[1,4],strikeDelay:.35,
  technique:{'walking the dog':1.15,'stop & go':1.1,'twitching':1.05,'lift & drop':1.0,'straight retrieve':.85,'slow roll':.95,'dead stick':.55,'idle':.4},
  lureFamily:{topwater:1.1,soft:1.0,crank:.95},
  burstBL:9,cruiseBL:1.2,stamina:1,fight:{runs:.9,jumps:.8,headshakes:.9,rolls:.1},spookRadius:7}
};
export function sizeClass(species,length){const c=species.classes;for(const k of ['legend','trophy','common','young'])if(length>=c[k][0])return k;return 'young';}
export function describeFish(species,length){const kg=species.weightKg(length),lb=kg/LB,inches=length/IN;return {lengthIn:+inches.toFixed(1),lengthCm:+(length*100).toFixed(1),weightKg:+kg.toFixed(2),weightLb:+lb.toFixed(2),weightText:`${Math.floor(lb)} lb ${Math.round((lb%1)*16)} oz`,sizeClass:sizeClass(species,length)};}
// Activity by local hour for a diel type: crepuscular fish peak at dawn and dusk, nocturnal after dark.
export function activityByHour(hour,diel='crepuscular',sunrise=6.6,sunset=19.2){
 const gauss=(x,c,w)=>Math.exp(-((x-c)*(x-c))/(2*w*w));
 if(diel==='crepuscular')return Math.min(1,.28+.72*Math.max(gauss(hour,sunrise+.3,1.4),gauss(hour,sunset-.4,1.4))+.1*gauss(hour,12.5,3));
 if(diel==='nocturnal')return hour<sunrise-.5||hour>sunset+.5?.9:.35;
 return Math.min(1,.3+.7*gauss(hour,12.5,4));
}
