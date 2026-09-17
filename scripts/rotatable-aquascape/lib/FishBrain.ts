export type FishPoint={radius?:number;foodTarget?:number|null;id:number;x:number;y:number;z?:number;vx?:number;vy?:number;vz?:number};
export type FishSenses={reachable?:(food:FishPoint)=>boolean;food:FishPoint[];neighbors:FishPoint[];mouth?:{x:number;y:number;z:number};heading?:number;schoolGoal?:FishPoint;browseSites?:FishPoint[];daylight?:number;schoolAffinity?:number;depthBounds?:[number,number]};
export type FishIntent={kind:'explore'|'feed'|'school'|'rest'|'space'|'browse';reason:string;target?:FishPoint};
export type FishBrain={hunger:number;energy:number;curiosity:number;decisionIn:number;biteIn:number;seed:number;intent:FishIntent;consumedFood:number|null;foodDistance:number;foodStall:number;browseIn:number;visited:{x:number;y:number;age:number}[]};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function createFishBrain():FishBrain{return {hunger:.6,energy:.85,curiosity:.65,decisionIn:0,biteIn:0,seed:723,intent:{kind:'explore',reason:'Exploring the planting.'},consumedFood:null,foodDistance:Infinity,foodStall:0,browseIn:0,visited:[]};}
const random=(b:FishBrain)=>{b.seed=(Math.imul(b.seed,1664525)+1013904223)>>>0;return b.seed/4294967296;};
export function rememberPlant(b:FishBrain,x:number,y:number){b.visited.push({x,y,age:0});if(b.visited.length>6)b.visited.shift();b.curiosity*=.35;b.browseIn=8+random(b)*10;b.decisionIn=0;b.intent={kind:'explore',reason:'Leaving a feeding patch to rejoin companions.'};}
export function thinkFish(b:FishBrain,dt:number,x:number,y:number,speed:number,senses:FishSenses,z=.65){
 const distance=(f:FishPoint)=>Math.hypot(f.x-x,f.y-y,((f.z??z)-z)*180);
 if(dt<=0)return b.intent;
 b.hunger=clamp(b.hunger+dt*.0015);b.energy=clamp(b.energy+dt*(speed<2?.018:speed<24?.009:-.0003*(speed-24)));b.curiosity=clamp(b.curiosity+dt*.006);
 b.visited.forEach(v=>v.age+=dt);b.visited=b.visited.filter(v=>v.age<100);b.browseIn=Math.max(0,b.browseIn-dt);b.biteIn=Math.max(0,b.biteIn-dt);b.decisionIn-=dt;
 // Keep a live target through the approach. Allocate no sorted food list each
 // frame; choose individual nearby morsels and discount those others reach first.
 let food:FishPoint|undefined,best=Infinity;
 const previous=b.intent.kind==='feed'?b.intent.target?.id:null;
 const liveTarget=senses.food.find(f=>f.id===previous);
 if(liveTarget){const d=distance(liveTarget);b.foodStall+=dt;if(d<b.foodDistance-3){b.foodDistance=d;b.foodStall=0;}}
 else {b.foodDistance=Infinity;b.foodStall=0;}
 for(const candidate of senses.food){
  const d=distance(candidate);if(d>=650||candidate.id===b.consumedFood||senses.reachable&&!senses.reachable(candidate))continue;
  if(candidate.id===previous){if(b.foodStall<2.5||senses.food.length<2){food=candidate;break;}continue;}
  let score=d;
  if(senses.heading!==undefined){const dx=candidate.x-x,dz=((candidate.z??z)-z)*180;score+=(1-(dx*Math.cos(senses.heading)-dz*Math.sin(senses.heading))/Math.max(1,Math.hypot(dx,dz)))*32;}
  for(const other of senses.neighbors)if(other.foodTarget===candidate.id&&Math.hypot(other.x-candidate.x,other.y-candidate.y,((other.z??z)-(candidate.z??z))*180)<d+25)score+=90;
  if(score<best){best=score;food=candidate;}
 }
 if(food&&food.z===undefined)food={...food,z:food.id===previous?(b.intent.target?.z??z):z};
 if(food&&food.id!==previous){b.foodDistance=distance(food);b.foodStall=0;}
 const mouth=senses.mouth;
 const withinReach=food&&(mouth?Math.hypot(food.x-mouth.x,food.y-mouth.y,((food.z??z)-mouth.z)*180)<8&&speed<65:distance(food)<22);
 if(food&&b.hunger>.18&&withinReach&&b.biteIn===0){b.consumedFood=food.id;b.hunger=clamp(b.hunger-.23);b.energy=clamp(b.energy+.08);b.biteIn=.20+random(b)*.35;b.decisionIn=0;}
 const close=senses.neighbors.filter(f=>distance(f)<26).sort((a,c)=>distance(a)-distance(c))[0];
 // Keep a chosen action long enough to be readable; food loss and crowding interrupt it.
 if(b.decisionIn>0&&!(b.intent.kind==='rest'&&(senses.daylight??0)>=.4)&&!close&&!(food&&b.hunger>.35&&b.intent.kind!=='feed')&&!(b.intent.kind==='feed'&&!food)){
  if(b.intent.kind==='feed'&&food)b.intent.target=food;
  return b.intent;
 }
 b.decisionIn=.7+random(b)*.8;
 if(close)b.intent={kind:'space',reason:'Giving a nearby fish more room.',target:{id:-1,x:x+(x>=close.x?65:-65),y:y+(y>=close.y?22:-22),z:clamp(z+(z>=(close.z??z)?.09:-.09))}};
 else if(food&&b.hunger>.18)b.intent={kind:'feed',reason:'Pursuing an individual food particle.',target:food};
 else if((senses.daylight??0)<.4&&(b.energy<.28||((senses.daylight??1)<.4)||(b.intent.kind==='rest'&&b.energy<.62)))b.intent={kind:'rest',reason:'Resting and fanning its fins to hold position.'};
 else {
  // Cardinal field diet: small animal prey around roots, litter and submerged plants.
  const patches=(senses.browseSites??[]).filter(f=>distance(f)<230&&!b.visited.some(v=>Math.hypot(v.x-f.x,v.y-f.y)<48)).sort((a,c)=>distance(a)-distance(c)).slice(0,5);
  if(patches.length&&b.browseIn===0&&b.curiosity>.25&&random(b)<.58){b.intent={kind:'browse',reason:'Searching a planted feeding patch for tiny prey.',target:patches[Math.floor(random(b)*patches.length)]};b.decisionIn=12+random(b)*6;return b.intent;}
  const school=senses.neighbors.filter(f=>distance(f)<260&&distance(f)>45);
  if((school.length>=2||senses.schoolGoal)&&random(b)<(senses.schoolAffinity??(senses.schoolGoal?.78:.48))){
   const count=Math.max(1,school.length),goal=senses.schoolGoal;
   const cx=school.length?school.reduce((v,f)=>v+f.x,0)/count:x,cy=school.length?school.reduce((v,f)=>v+f.y,0)/count:y,cz=school.length?school.reduce((v,f)=>v+(f.z??z),0)/count:z;
   const vx=school.reduce((v,f)=>v+(f.vx??0),0)/count;
   // Cohesion and heading alignment share a slowly roaming goal; individuals retain spacing and timing.
   b.intent={kind:'school',reason:`Swimming with the tetra school.`,target:{id:-2,x:goal?goal.x*.8+(cx+vx*3)*.2:cx+vx*5,y:goal?goal.y*.6+cy*.4:cy,z:goal?(goal.z??cz)*.65+cz*.35:cz,vx:goal?.vx??vx}};b.decisionIn=1.8+random(b)*2;
  }
  else {b.intent={kind:'explore',reason:b.curiosity>.6?'Looking for an unfamiliar leaf to inspect.':'Exploring between the plants.'};b.decisionIn=4+random(b)*4;}
 }
 return b.intent;
}


