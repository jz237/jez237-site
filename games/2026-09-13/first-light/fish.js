// The cove's fish: a small persistent population of largemouth living on the cover, each with a
// brain, a body that swims by its motion, and (when hooked) a fight that drives its position.
import * as T from './vendor/three.module.js';
import {SPECIES,activityByHour,describeFish,sizeClass} from './species.js';
import {createFishBrain,stepFishBrain,markEscape} from './fish-brain.js';
import {tempFactor,pressureFactor} from './season.js';
import {createFight,stepFight} from './fight.js';
import {makeFishMesh} from './fish-body.js';
import {makePhotoFishMesh} from './fish-photo.js';
import {rng} from './botany.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// assets: {speciesId: {profile,flank,fins}|null}; species without photo assets use the procedural body
export function makePopulation(scene,bathy,coverFeatures,{seed=2026,assets={},roster=Object.keys(SPECIES)}={}){
 const mesh=(len,sp)=>assets[sp.id]?makePhotoFishMesh(len,assets[sp.id]):makeFishMesh(len);
 const random=rng(seed),fish=[],species=SPECIES.largemouth;
 function spawn(x,z,length,boldness,name=null,sp=SPECIES.largemouth){const bed=bathy.height(x,z);if(bed>-.5)return null;const [d0,d1]=sp.depth||[.4,2.2];const y=clamp(-(d0+random()*(d1-d0)),bed+.3,-.25);
  const brain=createFishBrain({id:sp.id.slice(0,2)+fish.length,species:sp,length,home:{x,y:Math.max(bed+.3,y),z},boldness,random:rng(Math.floor(random()*1e9))});brain.name=name;
  const body=mesh(length,sp);scene.add(body.root);const f={brain,body,swimPhase:random()*6.28,fight:null,jaw:0,wet:0,species:sp};fish.push(f);return f;}
 for(const id of roster){const sp=SPECIES[id];const spots=coverFeatures.filter(f=>sp.structure.includes(f.type));if(!spots.length)continue;
  for(let i=0;i<(sp.count||6);i++){const [l0,l1]=sp.sizeRange;const length=l0+Math.pow(random(),1.6)*(l1-l0);const [b0,b1]=sp.boldness,bold=b0+random()*(b1-b0);
   // a few tries per fish: spots hugging the bank put some draws on a bed too shallow to hold one
   for(let tries=0;tries<6;tries++){const s=spots[Math.floor(random()*spots.length)];const a=random()*6.28,r=random()*Math.max(3,s.r*.6);if(spawn(s.x+Math.cos(a)*r,s.z+Math.sin(a)*r,length,bold,null,sp))break;}}}
 // the legend: a big largemouth that lives under the north laydown
 {const lay=coverFeatures.find(f=>f.type==='laydown');if(lay)spawn(lay.x+2,lay.z+2,.585,.42,'the Ridge Fish',SPECIES.largemouth);}
 let lastSplash=null;
 function nearest(x,z){let best=null,bd=1e9;for(const f of fish){const d=Math.hypot(f.brain.x-x,f.brain.z-z);if(d<bd){bd=d;best=f;}}return best;}
 // a fight, a lost fish or a botched set puts the neighbours off for a while: the spot goes quiet
 function disturb(x,z,t,radius=8,seconds=40){let n=0;for(const f of fish){const b=f.brain;if(b.state==='HOOKED'||b.state==='LANDED')continue;if(Math.hypot(b.x-x,b.z-z)<radius){b.state='REFUSE';b.stateTime=0;b.refuseUntil=Math.max(b.refuseUntil||0,t+seconds*(.6+random()*.8));n++;}}return n;}
 return {fish,species,spawn,nearest,disturb,
  splash(x,z,t){lastSplash={x,z,t};},
  update(dt,t,hour,sunrise,sunset,lure,kayak,clarity,bait=null,cond=null){
   const acts={};for(const id in SPECIES)acts[id]=activityByHour(hour,SPECIES[id].diel,sunrise,sunset)*(cond?tempFactor(SPECIES[id],cond.tempC)*pressureFactor(cond.pressureTrend)*(cond.activityScale||1):1);
   const base={lure,clarity,kayak,splash:lastSplash?{x:lastSplash.x,z:lastSplash.z,age:t-lastSplash.t}:null};
   for(const f of fish){const b=f.brain;const p={...base,activity:acts[b.species.id]*(bait?1+.35*bait(b.x,b.z):1)};
    if(b.state!=='HOOKED'&&b.state!=='LANDED'){stepFishBrain(b,dt,t,p);const bed=bathy.height(b.x,b.z);b.y=clamp(b.y,bed+.18,-.12);if(bathy.height(b.x,b.z)>-.3){b.x=b.home.x;b.z=b.home.z;}}
    // body: swim by speed, jaw on strike, wet only when lifted
    const speed=Math.hypot(b.vx,b.vy,b.vz);const beat=(.5+1.6*speed/b.length)*Math.PI*2;f.swimPhase+=dt*beat;const amp=clamp(.012+.05*speed/(b.length*3),.012,.07);
    let turn=0;const targetYaw=b.heading;let d=targetYaw-f.body.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));f.body.root.rotation.y+=d*Math.min(1,dt*6);turn=clamp(-d*2,-.8,.8);
    f.body.setSwim(f.swimPhase,amp,turn);f.jaw+=(((b.state==='STRIKE'||b.state==='BITE')?1:b.state==='LANDED'?.35:0)-f.jaw)*Math.min(1,dt*10);f.body.setJaw(f.jaw);
    f.body.root.position.set(b.x,b.y,b.z);f.body.root.rotation.x=clamp(-b.vy*.8,-.5,.5);f.body.root.rotation.z*=0;f.body.root.visible=b.state!=='LANDED';}
  },
  info:f=>({id:f.brain.id,species:f.brain.species.id,name:f.brain.name,state:f.brain.state,length:+f.brain.length.toFixed(3),...describeFish(f.brain.species,f.brain.length),x:+f.brain.x.toFixed(1),y:+f.brain.y.toFixed(2),z:+f.brain.z.toFixed(1),boldness:+f.brain.boldness.toFixed(2),aversion:f.brain.aversion,caught:f.brain.caught}),
  describe:f=>describeFish(f.brain.species,f.brain.length),speciesOf:f=>f.brain.species,markEscape:(f,family)=>markEscape(f.brain,family)};
}
