export type FishPoint={radius?:number;id:number;x:number;y:number;z?:number;vx?:number;vy?:number};
export type FishSenses={food:FishPoint[];neighbors:FishPoint[];schoolGoal?:FishPoint};
export type FishIntent={kind:'explore'|'feed'|'school'|'rest'|'space';reason:string;target?:FishPoint};
export type FishBrain={hunger:number;energy:number;curiosity:number;decisionIn:number;biteIn:number;seed:number;intent:FishIntent;consumedFood:number|null;visited:{x:number;y:number;age:number}[]};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function createFishBrain():FishBrain{return {hunger:.6,energy:.85,curiosity:.65,decisionIn:0,biteIn:0,seed:723,intent:{kind:'explore',reason:'Exploring the planting.'},consumedFood:null,visited:[]};}
const random=(b:FishBrain)=>{b.seed=(Math.imul(b.seed,1664525)+1013904223)>>>0;return b.seed/4294967296;};
export function rememberPlant(b:FishBrain,x:number,y:number){b.visited.push({x,y,age:0});if(b.visited.length>6)b.visited.shift();b.curiosity*=.35;}
export function thinkFish(b:FishBrain,dt:number,x:number,y:number,speed:number,senses:FishSenses,z=.65){
 const distance=(f:FishPoint)=>Math.hypot(f.x-x,f.y-y,((f.z??z)-z)*180);
 if(dt<=0)return b.intent;
 b.hunger=clamp(b.hunger+dt*.0015);b.energy=clamp(b.energy+dt*(speed<2?.018:-.0015-speed*.00018));b.curiosity=clamp(b.curiosity+dt*.006);
 b.visited.forEach(v=>v.age+=dt);b.visited=b.visited.filter(v=>v.age<100);b.biteIn=Math.max(0,b.biteIn-dt);b.decisionIn-=dt;
 const food=senses.food.filter(f=>distance(f)<330).sort((a,c)=>distance(a)-distance(c))[0];
 if(food&&b.hunger>.18&&distance(food)<22&&b.biteIn===0){b.consumedFood=food.id;b.hunger=clamp(b.hunger-.23);b.energy=clamp(b.energy+.08);b.biteIn=1.2;b.decisionIn=0;}
 const close=senses.neighbors.filter(f=>distance(f)<26).sort((a,c)=>distance(a)-distance(c))[0];
 // Keep a chosen action long enough to be readable; food loss and crowding interrupt it.
 if(b.decisionIn>0&&!close&&!(food&&b.hunger>.35&&b.intent.kind!=='feed')&&!(b.intent.kind==='feed'&&!food)){
  if(b.intent.kind==='feed'&&food)b.intent.target=food;
  return b.intent;
 }
 b.decisionIn=.7+random(b)*.8;
 if(close)b.intent={kind:'space',reason:'Giving a nearby fish more room.',target:{id:-1,x:x+(x>=close.x?65:-65),y:y+(y>=close.y?22:-22),z:clamp(z+(z>=(close.z??z)?.09:-.09))}};
 else if(food&&b.hunger>.18)b.intent={kind:'feed',reason:'Food detected — approaching a flake.',target:food};
 else if(b.energy<.28||(b.intent.kind==='rest'&&b.energy<.62))b.intent={kind:'rest',reason:'Resting and fanning its fins to hold position.'};
 else {
  const school=senses.neighbors.filter(f=>distance(f)<260&&distance(f)>45);
  if((school.length>=2||senses.schoolGoal)&&random(b)<(senses.schoolGoal?.88:.48)){
   const count=Math.max(1,school.length),goal=senses.schoolGoal;
   const cx=school.length?school.reduce((v,f)=>v+f.x,0)/count:x,cy=school.length?school.reduce((v,f)=>v+f.y,0)/count:y,cz=school.length?school.reduce((v,f)=>v+(f.z??z),0)/count:z;
   const vx=school.reduce((v,f)=>v+(f.vx??0),0)/count;
   // Cohesion and heading alignment share a slowly roaming goal; individuals retain spacing and timing.
   b.intent={kind:'school',reason:`Swimming with the tetra school.`,target:{id:-2,x:goal?goal.x:cx+vx*5,y:goal?goal.y:cy,z:goal?(goal.z??cz):cz,vx:goal?.vx??vx}};b.decisionIn=1.8+random(b)*2;
  }
  else {b.intent={kind:'explore',reason:b.curiosity>.6?'Looking for an unfamiliar leaf to inspect.':'Exploring between the plants.'};b.decisionIn=4+random(b)*4;}
 }
 return b.intent;
}


