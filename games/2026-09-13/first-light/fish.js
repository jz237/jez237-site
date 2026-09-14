// The cove's fish: a small persistent population of largemouth living on the cover, each with a
// brain, a body that swims by its motion, and (when hooked) a fight that drives its position.
import * as T from './vendor/three.module.js';
import {SPECIES,activityByHour,describeFish,sizeClass} from './species.js';
import {createFishBrain,stepFishBrain,markEscape} from './fish-brain.js';
import {createFight,stepFight} from './fight.js';
import {makeFishMesh} from './fish-body.js';
import {rng} from './botany.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function makePopulation(scene,bathy,coverFeatures,{count=10,seed=2026}={}){
 const random=rng(seed),fish=[],species=SPECIES.largemouth;
 const spots=coverFeatures.filter(f=>species.structure.includes(f.type));
 function spawn(x,z,length,boldness,name=null){const bed=bathy.height(x,z);if(bed>-.6)return null;const y=clamp(bed+.4+random()*Math.max(.2,-bed-.9),bed+.35,-.35);
  const brain=createFishBrain({id:'lm'+fish.length,species,length,home:{x,y,z},boldness,random:rng(Math.floor(random()*1e9))});brain.name=name;
  const body=makeFishMesh(length);scene.add(body.root);const f={brain,body,swimPhase:random()*6.28,fight:null,jaw:0,wet:0};fish.push(f);return f;}
 for(let i=0;i<count;i++){const s=spots[Math.floor(random()*spots.length)];const a=random()*6.28,r=random()*Math.max(3,s.r*.6);const x=s.x+Math.cos(a)*r,z=s.z+Math.sin(a)*r;
  const length=.28+Math.pow(random(),1.6)*.26;spawn(x,z,length,.4+random()*.45);}
 // the legend: a big fish that lives under the north laydown
 {const lay=coverFeatures.find(f=>f.type==='laydown');if(lay)spawn(lay.x+2,lay.z+2,.585,.42,'the Ridge Fish');}
 let lastSplash=null;
 function nearest(x,z){let best=null,bd=1e9;for(const f of fish){const d=Math.hypot(f.brain.x-x,f.brain.z-z);if(d<bd){bd=d;best=f;}}return best;}
 return {fish,species,spawn,nearest,
  splash(x,z,t){lastSplash={x,z,t};},
  update(dt,t,hour,sunrise,sunset,lure,kayak,clarity){
   const activity=activityByHour(hour,species.diel,sunrise,sunset);
   const p={lure,clarity,activity,kayak,splash:lastSplash?{x:lastSplash.x,z:lastSplash.z,age:t-lastSplash.t}:null};
   for(const f of fish){const b=f.brain;
    if(b.state!=='HOOKED'&&b.state!=='LANDED'){stepFishBrain(b,dt,t,p);const bed=bathy.height(b.x,b.z);b.y=clamp(b.y,bed+.18,-.12);if(bathy.height(b.x,b.z)>-.3){b.x=b.home.x;b.z=b.home.z;}}
    // body: swim by speed, jaw on strike, wet only when lifted
    const speed=Math.hypot(b.vx,b.vy,b.vz);const beat=(.5+1.6*speed/b.length)*Math.PI*2;f.swimPhase+=dt*beat;const amp=clamp(.012+.05*speed/(b.length*3),.012,.07);
    let turn=0;const targetYaw=b.heading;let d=targetYaw-f.body.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));f.body.root.rotation.y+=d*Math.min(1,dt*6);turn=clamp(-d*2,-.8,.8);
    f.body.setSwim(f.swimPhase,amp,turn);f.jaw+=((b.state==='STRIKE'||b.state==='BITE')?1:0-f.jaw)*Math.min(1,dt*10);f.body.setJaw(f.jaw);
    f.body.root.position.set(b.x,b.y,b.z);f.body.root.rotation.x=clamp(-b.vy*.8,-.5,.5);f.body.root.rotation.z*=0;f.body.root.visible=b.state!=='LANDED';}
  },
  info:f=>({id:f.brain.id,name:f.brain.name,state:f.brain.state,length:+f.brain.length.toFixed(3),...describeFish(species,f.brain.length),x:+f.brain.x.toFixed(1),y:+f.brain.y.toFixed(2),z:+f.brain.z.toFixed(1),boldness:+f.brain.boldness.toFixed(2),aversion:f.brain.aversion,caught:f.brain.caught}),
  describe:f=>describeFish(species,f.brain.length),markEscape:(f,family)=>markEscape(f.brain,family)};
}
