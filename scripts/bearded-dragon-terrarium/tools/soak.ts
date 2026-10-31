/** Seeded, continuous behavior run against the real habitat meshes.
 * node --import tsx tools/soak.ts --minutes 30 --seed 20261030 --out /absolute/report.json
 * Reproduce with --replay /absolute/report.json (same source revision required).
 * No forced route schedule: the brain chooses its own goals; only feeding,
 * lamp changes and refilling greens emulate visitor inputs. */
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import * as THREE from 'three';
import {habitat,Audit,SkinAudit} from '../tests/locomotion-fixture';
import {Cricket} from '../lib/Insects';
import {Dish} from '../lib/Dish';
import {BASK,groundHeight} from '../lib/Ground';
import {SimulationClock} from '../lib/SimulationClock';

const arg=(name:string,fallback:string)=>{const at=process.argv.indexOf('--'+name);return at<0?fallback:process.argv[at+1];};
const replay=arg('replay',''),previous=replay?JSON.parse(readFileSync(replay,'utf8')):null;
const seed=Number(arg('seed',String(previous?.config.seed??20261030)));
const minutes=Number(arg('minutes',String(previous?.config.minutes??30)));
const out=arg('out','soak-report.json');
const pattern:number[]=JSON.parse(arg('cadence',JSON.stringify(previous?.config.cadence??[1/60])));
if(!Number.isFinite(minutes)||minutes<=0||minutes>120||!Number.isInteger(seed)||!pattern.length||pattern.some(x=>!Number.isFinite(x)||x<=0||x>.2))throw Error('Invalid soak configuration');
const until=Number(arg('until',String(previous?.config.until??minutes*60)));
if(!Number.isFinite(until)||until<=0||until>minutes*60)throw Error('Invalid run duration');
const sourceHash=createHash('sha256');
const sources=readdirSync(new URL('../lib/',import.meta.url)).filter(f=>f.endsWith('.ts')).sort().map(f=>'lib/'+f)
  .concat(['tools/soak.ts','tests/locomotion-fixture.ts','package-lock.json','public/lizard/lizard.json']);
for(const f of sources){sourceHash.update(f+'\0');sourceHash.update(readFileSync(new URL('../'+f,import.meta.url),'utf8').replace(/\r\n?/g,'\n'));}
const mesh=JSON.parse(readFileSync(new URL('../public/lizard/lizard.json',import.meta.url),'utf8')).file;
for(const f of ['public/lizard/'+mesh,'tests/fixtures/habitat-collision.json.gz'])sourceHash.update(readFileSync(new URL('../'+f,import.meta.url)));
const fingerprint=sourceHash.digest('hex');
if(previous&&previous.fingerprint!==fingerprint)throw Error('Replay source differs; use the matching source revision');
let state=seed>>>0,eventState=(seed^0x9e3779b9)>>>0;
const original=Math.random;Math.random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
const visitor=()=>{eventState=(Math.imul(eventState,1664525)+1013904223)>>>0;return eventState/4294967296;};
const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs;
const audit=new Audit(),skin=new SkinAudit(a.lizard,true);
const g=new THREE.SphereGeometry(.001,4,2),m=new THREE.MeshBasicMaterial();
const parts={body:g,wing:g,eye:g,seg:g,femur:g,spines:g,antenna:g,cercus:g,ovipositor:g,mats:{body:m,femur:m,wing:m,eye:m,leg:m,dark:m}};
let crickets:Cricket[]=[];
b.insects.nearest=(p:THREE.Vector3)=>crickets.filter(c=>!c.eaten&&!c.caught&&(!c.airborne||c.pos.y<.4)).sort((c,d)=>c.pos.distanceToSquared(p)-d.pos.distanceToSquared(p))[0]??null;
b.dish=new Dish({heightAt:groundHeight},-.58,.362);
b.cameraPos.set(.015,.64,2.3);
const events:any[]=[],changes:any[]=[],issues:any[]=[],counts:Record<string,number>={},modes:Record<string,number>={};
const recent:any[]=[];let nextEvent=8,nextReport=30,frames=0,t=0,wall=0,previousMode='',caught=0,travel=0,maxStill=0,maxSwing=0;
let still=0,ref=new THREE.Vector3(I.x,I.z,I.heading),lastRoot=new THREE.Vector3(),haveRoot=false;
let attemptedStill=0,maxAttemptedStill=0;
const attemptRef=new THREE.Vector3(I.x,I.z,I.heading);
const swings=[0,0,0,0],footPrevious=new Map<number,THREE.Vector3>();
const forelegPrevious=new Map<number,THREE.Quaternion>();let maxForelegRotation=0,minPalmUp=1;
const captured=new WeakSet<Cricket>();
const poseHash=createHash('sha256');
const sample=()=>({frame:frames,time:t,randomState:state,mode:b.mode,status:b.status,maneuver:r.maneuver,phase:b.huntPhase,
  root:[I.x,r.bodyY,I.z,I.heading],goal:b.goal,head:r.snout.toArray(),prey:crickets.map(c=>({position:c.pos.toArray(),caught:c.caught,airborne:c.airborne})),
  legs:r.legs.map((l:any)=>({swing:l.swing,phase:l.swingT,stall:l.swingStall,returning:l.returning,anchor:l.planted.toArray(),target:l.to.toArray()})),
  bones:a.lizard.bones.map(bone=>bone.matrix.toArray())});
function issue(kind:string,detail:any){
  counts[kind]=(counts[kind]??0)+1;if(issues.some(i=>i.kind===kind)||issues.length>=8)return;
  const snapshot=arg('snapshot','');
  if(snapshot&&!issues.length){
    const encode=(v:any):any=>{
      if(!v||typeof v!=='object')return v;
      for(const name of ['Vector3','Vector2','Matrix4','Euler','Quaternion'])if(v['is'+name])return {$type:name,v:v.toArray()};
      if(Array.isArray(v))return v.map(encode);
      return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,encode(x)]));
    };
    const fields=Object.fromEntries(Object.entries(r).filter(([k])=>!['model','ground','collision','footholds','tailDynamics','stepSearch'].includes(k)));
    writeFileSync(snapshot,JSON.stringify(encode(fields)));
  }
  issues.push({kind,time:t,detail,frames:[...recent,sample()]});save(false);
}
function save(done:boolean){
  const report={schema:1,config:{seed,minutes,until,cadence:pattern},revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fingerprint,
    replayCommand:`node --import tsx tools/soak.ts --replay ${JSON.stringify(out)}`,done,seconds:t,wallSeconds:wall,frames,caught,travel,maxStill,maxAttemptedStill,maxSwing,maxForelegRotation,minPalmUp,
    modes,counts,events,changes,issues,audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst,samples:skin.samples},
    poseDigest:poseHash.copy().digest('hex'),final:sample()};
  writeFileSync(out,JSON.stringify(report));
}
const clock=new SimulationClock(),started=performance.now();
try{
  for(let display=0;t<Math.min(minutes*60,until)-1e-8;display++){
    clock.advance(pattern[display%pattern.length],dt=>{
      if(t>=Math.min(minutes*60,until)-1e-8)return;
      t=++frames/60;
      if(t>=nextEvent){
        nextEvent=t+55+visitor()*60;
        if(crickets.filter(c=>!c.caught&&!c.eaten).length<3){
          const nearby=visitor()<.65;
          const p=nearby?a.nav.nearestWalkable(I.x+(visitor()-.5)*.7,I.z+(visitor()-.5)*.45,a.nav.mainRegion):a.nav.randomPoint(visitor);
          if(p){const c=new Cricket(new THREE.Vector3(p[0],.61,p[1]),parts);crickets.push(c);events.push({time:t,type:'feed',position:c.pos.toArray(),duringTransfer:r.motion.transferring});}
        }else{events.push({time:t,type:'refill'});b.dish.refill();}
      }
      // One evening interval tests winding down, shelter and waking. Otherwise
      // visitor feeds interrupt whatever voluntary activity is in progress.
      const night=t>minutes*60*.65&&t<minutes*60*.75;
      if(night!==b.night){events.push({time:t,type:'lamps',night});b.night=night;if(night)b.restInHide();}
      const shade=a.surface.roofed(I.x,I.z),lamp=(1-THREE.MathUtils.smoothstep(Math.hypot(I.x-BASK.x,I.z-BASK.z),.05,.29))*(shade?.04:1)*(night?0:1);
      b.heat=night?0:1;b.lampOnIt=lamp;b.envTemp=THREE.MathUtils.clamp(.19+(night?0:.2)+.43*lamp-(shade?.04:0),0,1);
      for(const c of crickets)c.update(dt,a.surface,a.nav);
      const x=I.x,z=I.z;
      b.update(dt);travel+=Math.hypot(I.x-x,I.z-z);audit.sample(r,a.surface);
      for(const c of crickets)if(c.caught&&!captured.has(c)){caught++;captured.add(c);events.push({time:t,type:'capture'});}
      crickets=crickets.filter(c=>!c.eaten);
      modes[b.mode]=(modes[b.mode]??0)+dt;
      if(b.mode!==previousMode){changes.push({time:t,mode:b.mode,status:b.status});previousMode=b.mode;}
      const root=r.spinePoints()[3];
      if(haveRoot&&root.distanceTo(lastRoot)>.01)issue('body-jump',{distance:root.distanceTo(lastRoot)});
      lastRoot.copy(root);haveRoot=true;
      const moving=b.mode==='travel'||b.mode==='hunt'&&(b.huntPhase==='approach'||b.huntDeparture);
      const progressed=Math.hypot(I.x-ref.x,I.z-ref.y)>.003||Math.abs(Math.atan2(Math.sin(I.heading-ref.z),Math.cos(I.heading-ref.z)))>.06;
      if(progressed||!moving){still=0;ref.set(I.x,I.z,I.heading);}else still+=dt;
      maxStill=Math.max(maxStill,still);
      if(still>8)issue('navigation-stall',{seconds:still,status:b.status,goal:b.goal});
      // Giving up and waiting must not erase repeated failed movement. Count
      // active attempts across activity changes; idle time itself is harmless.
      if(Math.hypot(I.x-attemptRef.x,I.z-attemptRef.y)>.003||Math.abs(Math.atan2(Math.sin(I.heading-attemptRef.z),Math.cos(I.heading-attemptRef.z)))>.06){
        attemptedStill=0;attemptRef.set(I.x,I.z,I.heading);
      }else if(moving)attemptedStill+=dt;
      maxAttemptedStill=Math.max(maxAttemptedStill,attemptedStill);
      if(attemptedStill>15)issue('repeated-route-failure',{activeSeconds:attemptedStill,status:b.status,goal:b.goal});
      for(const [k,l] of r.legs.entries()){
        swings[k]=l.swing?swings[k]+dt:0;maxSwing=Math.max(maxSwing,swings[k]);
        if(swings[k]>2.5)issue('suspended-foot',{leg:k,seconds:swings[k]});
        const bone=a.lizard.bones[l.data.bones.hand].matrix,hand=new THREE.Vector3().setFromMatrixPosition(bone);
        const old=footPrevious.get(k);
        if(!l.swing&&old&&hand.distanceTo(old)>.0001)issue('foot-slide',{leg:k,distance:hand.distanceTo(old)});
        if(l.swing)footPrevious.delete(k);else footPrevious.set(k,hand);
        if(l.front){
          const up=new THREE.Vector3().setFromMatrixColumn(bone,1).normalize().y;minPalmUp=Math.min(minPalmUp,up);
          if(up<.45)issue('inverted-forepaw',{leg:k});
          for(const id of [l.data.bones.upper,l.data.bones.lower,l.data.bones.hand]){
            const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(a.lizard.bones[id].matrix)),old=forelegPrevious.get(id);
            if(old){const rotation=q.angleTo(old);maxForelegRotation=Math.max(maxForelegRotation,rotation);if(rotation>Math.PI/2)issue('foreleg-flip',{leg:k,bone:id,rotation});}
            forelegPrevious.set(id,q);
          }
        }
      }
      if(r.legs.filter((l:any)=>!l.swing).length<2)issue('unsupported-stance',{});
      if(audit.maxFloat>.0005||audit.maxPenetration>.0005)issue('sole-contact',{float:audit.maxFloat,penetration:audit.maxPenetration});
      if(audit.maxLimbError>.00015)issue('limb-length',audit.worstLimb);
      if(frames%12===0){skin.sample(r,a.surface,frames);if(skin.maxPenetration>.003)issue('skin-penetration',skin.worst);}
      if(frames%6===0){const s=sample();recent.push(s);if(recent.length>120)recent.shift();poseHash.update(JSON.stringify(s));}
      if(t>=nextReport){wall=(performance.now()-started)/1000;save(false);console.log(JSON.stringify({seconds:t,wall,mode:b.mode,caught,travel,issues:issues.map(i=>i.kind)}));nextReport+=30;}
    });
  }
  wall=(performance.now()-started)/1000;save(true);
  console.log(JSON.stringify({complete:true,seconds:t,wall,caught,travel,issues:issues.map(i=>i.kind),digest:poseHash.copy().digest('hex')}));
  if(issues.length)process.exitCode=1;
}finally{Math.random=original;}
