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
  burstBL:9,cruiseBL:1.2,stamina:1,fight:{runs:.9,jumps:.8,headshakes:.9,rolls:.1},spookRadius:7,count:8,depth:[.4,2.2]},
 smallmouth:{id:'smallmouth',name:'Smallmouth bass',latin:'Micropterus dolomieu',
  sizeRange:[.22,.52],classes:{young:[0,11*IN],common:[11*IN,16*IN],trophy:[16*IN,20*IN],legend:[20*IN,99]},
  weightKg:L=>Math.pow(L/IN,3)/1300*LB,
  diel:'crepuscular',boldness:[.5,.9],tempPref:[16,24],structure:['riprap','stump','dock','laydown'],
  detect:{sight:3.6,lateral:4.5},inspectDistance:.6,inspectSeconds:[.8,3],strikeDelay:.3,
  technique:{'stop & go':1.15,'twitching':1.1,'lift & drop':1.05,'walking the dog':1.0,'straight retrieve':.9,'slow roll':.95,'dead stick':.5,'idle':.4},
  lureFamily:{topwater:.95,soft:1.0,crank:1.15},
  burstBL:10,cruiseBL:1.5,stamina:1.15,fight:{runs:1.0,jumps:.95,headshakes:.8,rolls:.1},spookRadius:6,count:5,depth:[.6,3]},
 walleye:{id:'walleye',name:'Walleye',latin:'Sander vitreus',
  sizeRange:[.3,.7],classes:{young:[0,15*IN],common:[15*IN,22*IN],trophy:[22*IN,27*IN],legend:[27*IN,99]},
  weightKg:L=>Math.pow(L/IN,3)/2700*LB,
  diel:'nocturnal',boldness:[.3,.7],tempPref:[12,22],structure:['riprap','stump'],
  detect:{sight:2.2,lateral:5.5},inspectDistance:.8,inspectSeconds:[1.5,4],strikeDelay:.5,
  technique:{'lift & drop':1.15,'slow roll':1.15,'stop & go':1.0,'twitching':.9,'straight retrieve':.9,'walking the dog':.3,'dead stick':.6,'idle':.4},
  lureFamily:{topwater:.25,soft:1.1,crank:1.05},
  burstBL:6,cruiseBL:1.0,stamina:.9,fight:{runs:.6,jumps:0,headshakes:.7,rolls:.2},spookRadius:8,count:4,depth:[2.2,6]},
 bluegill:{id:'bluegill',name:'Bluegill',latin:'Lepomis macrochirus',
  sizeRange:[.12,.25],classes:{young:[0,6*IN],common:[6*IN,8*IN],trophy:[8*IN,10*IN],legend:[10*IN,99]},
  weightKg:L=>Math.pow(L/IN,3)/1000*LB,
  diel:'diurnal',boldness:[.6,.95],tempPref:[18,28],structure:['dock','pads','weedbed'],
  detect:{sight:2.0,lateral:2.5},inspectDistance:.35,inspectSeconds:[.5,2.5],strikeDelay:.25,
  technique:{'dead stick':1.0,'lift & drop':1.1,'twitching':1.0,'stop & go':.8,'slow roll':.8,'straight retrieve':.6,'walking the dog':.3,'idle':.6},
  lureFamily:{topwater:.08,soft:.55,crank:.12},
  burstBL:7,cruiseBL:1.4,stamina:.5,fight:{runs:.5,jumps:.1,headshakes:.5,rolls:.1},spookRadius:4,count:12,depth:[.3,1.6]}
};
export const ROSTER=['largemouth','smallmouth','walleye','bluegill'];
export function sizeClass(species,length){const c=species.classes;for(const k of ['legend','trophy','common','young'])if(length>=c[k][0])return k;return 'young';}
export function describeFish(species,length){const kg=species.weightKg(length),lb=kg/LB,inches=length/IN;return {lengthIn:+inches.toFixed(1),lengthCm:+(length*100).toFixed(1),weightKg:+kg.toFixed(2),weightLb:+lb.toFixed(2),weightText:`${Math.floor(lb)} lb ${Math.round((lb%1)*16)} oz`,sizeClass:sizeClass(species,length)};}
// Activity by local hour for a diel type: crepuscular fish peak at dawn and dusk, nocturnal after dark.
export function activityByHour(hour,diel='crepuscular',sunrise=6.6,sunset=19.2){
 const gauss=(x,c,w)=>Math.exp(-((x-c)*(x-c))/(2*w*w));
 if(diel==='crepuscular')return Math.min(1,.28+.72*Math.max(gauss(hour,sunrise+.3,1.4),gauss(hour,sunset-.4,1.4))+.1*gauss(hour,12.5,3));
 if(diel==='nocturnal')return hour<sunrise-.5||hour>sunset+.5?.9:.35;
 return Math.min(1,.3+.7*gauss(hour,12.5,4));
}
