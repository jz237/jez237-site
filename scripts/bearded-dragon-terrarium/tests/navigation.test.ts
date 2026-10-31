import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {Nav} from '../lib/Nav';
import {Footholds} from '../lib/Footholds';
import {BASK,groundHeight} from '../lib/Ground';
import {habitat,Audit,SkinAudit} from './locomotion-fixture';

test('warm-rock routes reserve a whole-body corridor on both sides of the lower climb',()=>{
  const {nav}=habitat();
  assert.equal(nav.walkable(-.061,.118),false,'the observed rear-edge trap is not a hunting stance');
  assert.equal(nav.walkable(-.20,.19),false,'the front cliff remains excluded');
  const route:[number,number][]=[[-.40,.055],[-.31,.09],[-.20,.13],[-.08,.17],[.075,.23]];
  for(const p of route)assert.ok(nav.reachable(...p),`supported step ${p} remains connected`);
  for(let i=1;i<route.length;i++)assert.ok(nav.path(...route[i-1],...route[i]),'ascent and descent stay available');
});

test('steering and A* agree on clearance across a blocked grid corner',()=>{
  const nav=new Nav({heightAt:()=>.075,kindAt:()=>0} as any,[]);
  const x=.105,z=.105,k=nav.idx(x+.01,z);
  nav.cost[k]=Infinity;
  // The two endpoint samples are clear; the segment crosses the occupied
  // cell between them. This used to strand the animal at the same corner.
  assert.equal(nav.lineClear(x+.004,z+.001,x+.008,z+.008,Infinity),false);
  assert.equal(nav.lineClear(x,z,x,z+.02,Infinity),true);
  const route=nav.path(x+.004,z+.001,x+.04,z+.04)!;
  assert.ok(route);
  for(let i=1;i<route.length;i++)assert.ok(nav.lineClear(...route[i-1],...route[i],Infinity));
});

test('a blocked cave exit recovers even with a dormant head-lead timer and a suspended foot',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs;
  I.x=.485;I.z=.08;I.heading=-Math.PI/2;
  assert.ok(b.goTo(.47,.34,'idle'));b.boredom=1e6;
  assert.equal(b.caveExit,1);assert.ok(b.leadT>0);
  // Model a contact controller rejecting all body motion while a paw is
  // suspended. The behavior controller must still detect the failed advance.
  Object.defineProperty(r,'placingFoot',{get:()=>true});
  r.update=()=>{I.x=.485;I.z=.08;I.heading=-Math.PI/2;};
  let recovered=false;
  for(let i=0;i<150;i++){b.update(1/60);recovered ||= (b.retreatT>0||b.pivotRecovery)&&Math.abs(I.speed)+Math.abs(I.lateralSpeed??0)+Math.abs(I.turnRate)>0;}
  assert.ok(recovered,'the active cave movement is not hidden by unused route timers');
  assert.equal(b.mode,'travel');assert.ok(b.goal,'recovery preserves the requested destination');
});

test('a reachable toe-clearance step can cross a low corner while a tall obstruction stays rejected',()=>{
  let height=.04;
  const ground={heightAt:(x:number)=>Math.abs(x)<.012?height:0,
    normalAt:(_x:number,_z:number,out=new THREE.Vector3())=>out.set(0,1,0)};
  const finder=new Footholds(ground),wanted=new THREE.Vector3(.04,0,.035),shoulder=new THREE.Vector3(.01,.05,0),from=new THREE.Vector3(-.04,0,.035);
  const find=()=>finder.find(wanted,shoulder,.1,0,1,from,[],0,.005,0,h=>h.point.x>.025);
  const hold=find();assert.ok(hold);assert.equal(hold.top,.04);assert.equal(hold.point.y,0);
  height=.055;assert.equal(find(),null,'a high obstacle still requires another route');
});

test('a prey route from sand beside the rocks joins the low stair entrance',()=>{
  const a=habitat(),route=a.nav.path(-.068,.233,-.354,.009)!;
  assert.ok(route);
  const entrance=route.findIndex(([x,z])=>Math.hypot(x-.075,z-.23)<.025);
  const turningRoom=route.findIndex(([x,z])=>Math.hypot(x-.16,z-.34)<.025);
  const upper=route.findIndex(([x])=>x<-.15);
  assert.ok(turningRoom>=0&&turningRoom<entrance&&entrance<upper,'turn on open sand, then join the low entrance before ascending');
  for(let i=1;i<route.length;i++)assert.ok(a.nav.lineClear(...route[i-1],...route[i],Infinity));
});

test('a supported climbing pivot retains the uphill destination',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs;
  Object.assign(I,{x:-.09,z:.20,heading:2.05});
  b.goal=[-.4,.12];b.path=[[I.x,I.z],[-.4,.12]];b.pathI=1;b.mode='travel';b.stallT=2;
  r.maneuver='climb';r.motion.transferring=false;
  r.recoveryCost=(forward:number,_side:number,turn:number)=>turn?0:.01;
  b.travel(1/60);
  assert.ok(b.pivotRecovery,'use the supported turn when axial movement is blocked');
  const p=b.pivotRecovery,heading=I.heading+p.direction*p.remaining;
  const toward=(Math.cos(heading)*(b.goal[0]-I.x)-Math.sin(heading)*(b.goal[1]-I.z))*p.depart;
  assert.ok(toward>0,'the recovery must make space toward the uphill route instead of always descending');
});

test('repeated tours from varied resting states reach every destination without losing planted contacts',{timeout:1200000},t=>{
  const original=Math.random,results:any[]=[];
  try{
    for(const [seedValue,warmup] of [[20261014,8],[7,0],[77,3]].filter(([seed])=>!process.env.NAVIGATION_SEED||seed===Number(process.env.NAVIGATION_SEED))){
      let seed=seedValue;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
      const a=habitat(),b=a.brain as any,r=a.rig,audit=new Audit(),skin=new SkinAudit(a.lizard);
      b.dish={centre:new THREE.Vector3(-.58,groundHeight(-.58,.362),.362)};b.boredom=1e6;
      const update=()=>{
        const I=r.inputs,shade=a.surface.roofed(I.x,I.z);
        const lamp=(1-THREE.MathUtils.smoothstep(Math.hypot(I.x-BASK.x,I.z-BASK.z),.05,.29))*(shade?.04:1);
        b.lampOnIt=lamp;b.envTemp=THREE.MathUtils.clamp(.39+.43*lamp-(shade?.04:0),0,1);
        b.cameraPos.set(.015,.64,2.3);b.update(1/60);audit.sample(r,a.surface);
      };
      for(let i=0;i<warmup*60;i++)update();
      const drink=b.drinkSpot(),food=b.grazeSpot();
      const tour:[string,number,number][]=[['descent',.25,.25],['hide',.46,-.04],['water',drink[0],drink[1]],['food',food[0],food[1]],['ascent',b.baskSpot[0],b.baskSpot[1]]];
      for(let round=0;round<2;round++)for(const [name,x,z] of tour){
        assert.ok(b.goTo(x,z,'idle'),`${seedValue}/${round}/${name} plans`);b.hurry=true;b.boredom=1e6;
        const goal=[...b.goal];let seconds=0,still=0,maxStill=0,px=r.inputs.x,pz=r.inputs.z,heading=r.inputs.heading;
        // The dish-to-perch route includes the full sand crossing and ascent.
        // Use the same 140-second ceiling as the continuous habitat tour;
        // keep the separate five-second no-progress limit on every route.
        const limit=name==='ascent'?140:90;
        for(let frame=0;frame<limit*60&&b.mode==='travel';frame++){
          update();seconds=(frame+1)/60;
          if(name==='food'&&frame%6===0)skin.sample(r,a.surface,audit.frames);
          const I=r.inputs,turn=Math.atan2(Math.sin(I.heading-heading),Math.cos(I.heading-heading));
          if(Math.hypot(I.x-px,I.z-pz)>.001||Math.abs(turn)>.02){still=0;px=I.x;pz=I.z;heading=I.heading;}else still+=1/60;
          maxStill=Math.max(maxStill,still);
          if(process.env.NAVIGATION_REPORT&&frame%300===0)writeFileSync(process.env.NAVIGATION_REPORT,JSON.stringify({results,current:{seedValue,round,name,seconds,still,x:I.x,z:I.z,heading:I.heading,speed:I.speed,mode:b.mode,retreat:b.retreatT,retreatSign:b.retreatSign,blocked:b.blockedT,stall:b.stallT,pushed:b.pushedT,turnStall:b.turnStallT,pathI:b.pathI,path:b.path,pose:(r as any).poseState(),supportError:(r as any).supportError(),legs:(r as any).legs.map((l:any)=>({front:l.front,side:l.side,swing:l.swing,phase:l.swingT,returning:l.returning,stall:l.swingStall,planted:l.planted,extension:(r as any).shoulder(l).distanceTo(l.planted.clone().addScaledVector(l.normal,(.12+l.wristAbove)*.016))/l.reach}))}},null,2));
        }
        const distance=Math.hypot(r.inputs.x-goal[0],r.inputs.z-goal[1]),result={seedValue,round,name,seconds,distance,maxStill,
          ...(distance>=.04?{failure:{root:[r.inputs.x,r.inputs.z,r.inputs.heading],status:b.status,mode:b.mode,foodExit:b.foodExit,goal:b.goal,path:b.path,pathI:b.pathI,replans:b.replans,blocked:b.blockedT}}:{})};results.push(result);
        t.diagnostic(JSON.stringify(result));
        if(process.env.NAVIGATION_REPORT)writeFileSync(process.env.NAVIGATION_REPORT,JSON.stringify({results,audit:audit.report(),skin:{penetration:skin.maxPenetration,samples:skin.samples,worst:skin.worst}},null,2));
        if(distance>=.04&&process.env.NAVIGATION_SNAPSHOT){
          const encode=(v:any):any=>{
            if(!v||typeof v!=='object')return v;
            for(const name of ['Vector3','Vector2','Matrix4','Euler','Quaternion'])if(v['is'+name])return {$type:name,v:v.toArray()};
            if(Array.isArray(v))return v.map(encode);
            return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,encode(x)]));
          };
          const fields=Object.fromEntries(Object.entries(r).filter(([k])=>!['model','ground','collision','footholds','tailDynamics','stepSearch'].includes(k)));
          writeFileSync(process.env.NAVIGATION_SNAPSHOT,JSON.stringify(encode(fields)));
        }
        assert.equal(b.mode,'idle',`${seedValue}/${round}/${name} completes`);
        assert.ok(distance<.04,`${seedValue}/${round}/${name} actually arrives (${distance} m)`);
        assert.ok(maxStill<5,`${seedValue}/${round}/${name} stops making progress for ${maxStill} seconds`);
      }
      assert.ok(audit.maxSlide<.0001,'feet remain planted');
      assert.ok(audit.maxFloat<.0005&&audit.maxPenetration<.0005,'soles stay on real surfaces');
      assert.ok(audit.maxJump<.004,'body movement stays continuous');
      assert.ok(audit.maxLimbError<.00015,'limbs retain their length');
      assert.ok(skin.maxPenetration<.003,`raised steps clear the visible toes and limbs (${skin.maxPenetration} m)`);
    }
  }finally{Math.random=original;}
});
