/* Overload mission events adapted to Astra's native simulation. Scene links
 * come from the owned campaign, not guessed room numbers or unlocked exits. */
(function(root){
  class MissionController {
    constructor(meta,bridge,saved=null){
      this.meta=meta;this.bridge=bridge;this.records=meta.records;this.parents=meta.parents;
      this.byId=new Map(this.records.map(r=>[r.id,r]));this.time=0;this.dead=new Set();this.counts=new Map();this.done=new Set();this.queue=[];this.triggerTimes=new Map();this.clearance=meta.scene==='sp_alien_16'?2:0;this.kills=0;this.escaping=false;this.finished=false;this.warpActive=new Set();this.disabled=new Set();this.objectSignatures=new Map();this.hidden=new Set();this.lockdowns=[];this.switchUntil=new Map();this.errors=[];
      this.targetsCache=new Map();this.listeners=new Map();this.ancestorCache=new Map();
      for(const r of this.records){
        if(r.class==='ScriptOnDestroy'||r.class==='ScriptOnPickup'){
          const links=this.links(r),target=links[0],classes=r.class==='ScriptOnPickup'?['Item']:['Destroyable','Robot','AlienPower','TimedSwitch'];
          const first=classes.map(c=>this.targets(target,[c])[0]).find(Boolean);for(const t of first?[first]:[]){
            const list=this.listeners.get(t.go)||[];list.push({event:r.class==='ScriptOnPickup'?'pickup':'destroy',links:links.slice(1)});this.listeners.set(t.go,list);
          }
        }
        if(r.object!=null&&(!r.active||r.data.m_init_hidden))this.hidden.add(r.go);
      }
      this.levelOne=this.records.find(r=>r.class==='ScriptLevel1');this.levelOnePhase=0;
      this.alienCharge=new Map();this.warpCooldown=0;this.factories=new Map();
      if(saved)this.restore(saved);else{
        for(const r of this.records)if(r.data.should_activate)this.activate(r);
        for(const d of this.records)if(d.walls&&d.data.LockType>0&&d.data.LockType<=this.clearance)this.setDoor(d,false);
      }
    }
    links(r){return (r.data.c_go_link||[]).map(p=>p.m_PathID).filter(Boolean);}
    ancestors(go){if(!this.ancestorCache.has(go)){const set=new Set();for(let n=go;n&&!set.has(n);n=this.parents[n])set.add(n);this.ancestorCache.set(go,set);}return this.ancestorCache.get(go);}
    targets(go,classes){
      if(!go)return [];
      if(!this.targetsCache.has(go))this.targetsCache.set(go,this.records.filter(r=>this.ancestors(r.go).has(go)));
      const list=this.targetsCache.get(go);return classes?list.filter(r=>classes.includes(r.class)):list;
    }
    signal(go){const scripts=this.targets(go).filter(r=>r.class.startsWith('Script')),direct=scripts.filter(r=>r.go===go);for(const r of direct.length?direct:scripts.slice(0,1))this.activate(r);}
    fireLinks(r,start=0){for(const go of this.links(r).slice(start))this.signal(go);}
    event(go,event){for(const l of this.listeners.get(go)||[])if(l.event===event)for(const target of l.links)this.signal(target);}
    activate(r){
      if(this.finished)return;
      if(r.class==='ScriptOnCount'){
        const n=(this.counts.get(r.id)||0)+1;this.counts.set(r.id,n);
        if(!this.done.has(r.id)&&n>=Math.max(r.data.special_index||0,Math.trunc((r.data.delay||0)+.0001))){this.done.add(r.id);this.fireLinks(r);}return;
      }
      if(['ScriptOnDestroy','ScriptOnPickup','ScriptAlienDoorLink','ScriptLevel1'].includes(r.class))return;
      if(r.class==='ScriptLevel12'){const count=(this.counts.get(r.id)||0)+1;this.counts.set(r.id,count);if(count>=2)this.escape();return;}
      if(this.done.has(r.id)||this.queue.some(q=>q.record.id===r.id))return;
      const immediate=['ScriptLockdownMaster','ScriptLockdownBoss'].includes(r.class);
      if(!immediate&&r.data.delay>0)this.queue.push({at:this.time+r.data.delay,record:r});else this.execute(r);
    }
    doors(go){return this.targets(go,['DoorAnimating','DoorExit','DoorAlienController','AlienSecretDoor']).filter(r=>r.walls);}
    setDoor(r,locked,open=false){for(const w of r.walls||[])this.bridge.door(w,locked,open);r.locked=!!locked;r.open=!!open;}
    reveal(go){for(const r of this.targets(go)){this.disabled.delete(r.go);this.hidden.delete(r.go);if(r.object!=null)this.bridge.reveal(r.object);this.bridge.activateProp(r.go);}}
    escape(){if(this.escaping)return;this.escaping=true;this.bridge.escape();for(const d of this.records)if(d.class==='DoorExit'||d.data.LockType===6)this.setDoor(d,false,true);}
    execute(r){
      if(this.done.has(r.id))return;this.done.add(r.id);const links=this.links(r);
      switch(r.class){
        case 'ScriptDoorUnlock':case 'ScriptDoorOpen':case 'ScriptDoorLock':
          for(const go of links)for(const d of this.doors(go))this.setDoor(d,r.class==='ScriptDoorLock',r.class==='ScriptDoorOpen');break;
        case 'ScriptActivateObject':case 'ScriptRevealRobot':case 'ScriptRobotAttack':
          for(const go of links)this.reveal(go);break;
        case 'ScriptDeactivateObject':
          for(const go of links)for(const t of this.targets(go)){this.disabled.add(t.go);this.hidden.add(t.go);this.bridge.hide(t.object,t.go);}break;
        case 'ScriptDisableShield':
          for(const go of links)for(const t of this.targets(go,['Reactor','PropShielded','RobotMatcen'])){t.invulnerable=false;this.bridge.shield(t.object,false);}break;
        case 'ScriptDisableForcefield':
          for(const go of links)for(const t of this.targets(go,['Forcefield'])){this.disabled.add(t.go);this.bridge.forcefield(t.go,false);}break;
        case 'ScriptActivateAlienWarp':
          for(const go of links)for(const t of this.targets(go,['AlienWarp','AlienPower'])){this.warpActive.add(t.go);this.bridge.activateProp(t.go);}break;
        case 'ScriptActivateMatcen':
          for(const go of links)for(const t of this.targets(go,['RobotMatcen']))if(!this.factories.has(t.go))this.factories.set(t.go,{record:t,next:this.time+1,spawned:[]});break;
        case 'ScriptLockdownMaster':case 'ScriptLockdownBoss':{
          const doors=[],robots=[];
          for(const go of links){
            for(const link of this.targets(go,['ScriptLockdownDoor']))for(const target of this.links(link))doors.push(...this.doors(target));
            for(const link of this.targets(go,['ScriptLockdownRobot']))for(const target of this.links(link))robots.push(...this.targets(target,['Robot']));
            if(r.class==='ScriptLockdownBoss')robots.push(...this.targets(go,['Robot']));
          }
          for(const d of doors)this.setDoor(d,true);
          const unique=[...new Map(robots.map(r=>[r.go,r])).values()],lockdown={record:r,doors,robots:unique,spawned:[],next:this.time+Math.max(1,r.data.delay||3),remaining:unique.length,interval:Math.max(1,r.data.delay||3),boss:r.class==='ScriptLockdownBoss'};
          const first=Math.min(unique.length,lockdown.boss?unique.length:Math.max(0,r.data.special_index||0));for(let i=0;i<first;i++){this.reveal(unique[i].go);lockdown.spawned.push(unique[i]);lockdown.remaining--;}
          if(!lockdown.remaining)lockdown.safety=this.time+90;this.lockdowns.push(lockdown);break;
        }
        case 'ScriptTeleportOut':this.complete();break;
        case 'ScriptSecretLevel':this.bridge.secret(r);break;
        case 'ScriptObjectiveMessage':case 'ScriptCommMessage':case 'ScriptTutorialMessage':
          this.bridge.message(r.class,r.data.special_index);break;
        case 'ScriptHologuidePosition':this.bridge.guide(r);break;
        case 'ScriptAnalyticsChokepoint':case 'ScriptDisableOcclusion':case 'ScriptLockdownDoor':case 'ScriptLockdownRobot':case 'ScriptLevel16':break;
        default:this.errors.push('Unimplemented mission action '+r.class);this.bridge.error(this.errors.at(-1));
      }
    }
    complete(){if(this.finished)return;this.finished=true;this.bridge.finish();}
    pickup(r){
      if(this.dead.has(r.go))return;this.dead.add(r.go);this.event(r.go,'pickup');
      if(r.data.m_type===25){this.clearance=Math.min(4,this.clearance+1);for(const d of this.records)if(d.walls&&d.data.LockType>0&&d.data.LockType<=this.clearance)this.setDoor(d,false);this.bridge.clearance(this.clearance);}
    }
    destroyed(r){
      if(this.dead.has(r.go))return;this.dead.add(r.go);this.event(r.go,'destroy');
      if(r.class==='Robot')this.kills++;
      if(r.class==='Reactor'){
        this.escape();
      }
      this.bridge.hide(null,r.go);
    }
    hit(go,damage=5){
      for(const r of this.targets(go,['TimedSwitch','AlienPower'])){
        if(r.class==='AlienPower'){
          if(this.dead.has(r.go))continue;
          const charge=(this.alienCharge.get(r.go)||0)+.1+damage*.03;this.alienCharge.set(r.go,charge);
          if(charge<=10)continue;this.dead.add(r.go);
        }
        if(r.class==='TimedSwitch')this.switchUntil.set(r.go,this.time+Math.min(10,Math.max(1,(this.switchUntil.get(r.go)||this.time)-this.time+.5+damage*.15)));
        this.event(r.go,'destroy');
      }
      for(const link of this.records.filter(r=>r.class==='ScriptAlienDoorLink')){
        const links=this.links(link),switches=links.slice(1).flatMap(id=>this.targets(id,['TimedSwitch']));
        if(switches.length&&switches.some(s=>(this.switchUntil.get(s.go)||0)>this.time))for(const d of this.doors(links[0]))this.setDoor(d,false,true);
      }
    }
    inside(r,p){
      if(r.inverse){const m=r.inverse,c=r.box?.m_Center||{x:0,y:0,z:0},x=m[0]*p[0]+m[1]*p[1]+m[2]*p[2]+m[3]-c.x,y=m[4]*p[0]+m[5]*p[1]+m[6]*p[2]+m[7]-c.y,z=m[8]*p[0]+m[9]*p[1]+m[10]*p[2]+m[11]-c.z,s=r.data.m_size||r.box?.m_Size;return s&&Math.abs(x)<=s.x/2&&Math.abs(y)<=s.y/2&&Math.abs(z)<=s.z/2;}
      const radius=r.data.m_size?.x||r.sphere?.m_Radius||2;return Math.hypot(...p.map((v,i)=>v-r.position[i]))<=radius;
    }
    tick(dt,player,states){
      if(this.finished||!player.alive||!(dt>0))return;this.time+=Math.min(dt,.25);
      for(const r of this.records)if(r.active&&!this.disabled.has(r.go)&&['TriggerEnergy','AlienTriggerEnergyWeak'].includes(r.class)&&this.inside(r,player.position))this.bridge.recharge(Math.min(dt,.25)*15,r.class==='AlienTriggerEnergyWeak'?10:100);
      if(this.meta.secret){
        this.challengeEnd??=180.99;this.challengeNext??=1;this.challengeRobots??=[];
        const remaining=Math.ceil(this.challengeEnd-this.time);
        if(remaining!==this.lastChallengeSecond){this.lastChallengeSecond=remaining;this.bridge.challengeTime(Math.max(0,remaining));}
        if(remaining<=0){this.complete();return;}
        this.challengeRobots=this.challengeRobots.filter(o=>states[o.index]?.type===2&&states[o.index]?.signature===o.signature);
        if(this.time>=this.challengeNext&&this.challengeRobots.length<8){
          this.challengeNext=this.time+Math.max(2.5,7-this.time/40);
          const points=this.meta.spawnPoints.filter(p=>Math.hypot(...p.position.map((v,i)=>v-player.position[i]))>8);
          if(points.length){const point=points[Math.floor(Math.random()*points.length)],types=this.time<45?[0,2,4,8]:[0,1,2,3,4,6,8,10,11,13,15,17],type=types[Math.floor(Math.random()*types.length)];
            const o=this.bridge.spawn({...point,challenge:true,data:{m_spawnable_probability_1:1,m_spawnable_probability_2:0,m_spawnable_robot_1:type,m_spawnable_robot_2:type}});if(o)this.challengeRobots.push(o);
          }
        }
      }
      for(const r of this.records){
        if(r.object==null||this.hidden.has(r.go)||this.dead.has(r.go))continue;const o=states[r.object];if(!o)continue;
        if(!this.objectSignatures.has(r.object))this.objectSignatures.set(r.object,o.signature);
        if(o.signature!==this.objectSignatures.get(r.object)||o.type===255||o.flags&3||o.shields<0){if(r.class==='Item')this.pickup(r);else this.destroyed(r);}
        if(r.class==='Item'&&[24,25,27,28].includes(r.data.m_type)&&Math.hypot(...player.position.map((v,i)=>v-r.position[i]))<2){this.bridge.consume(r.object);this.pickup(r);}
      }
      if(this.time>=this.warpCooldown)for(const r of this.records){
        if(r.class!=='TriggerWarper'||!r.active||!this.inside(r,player.position))continue;
        const target=this.targets(this.links(r).at(-1),['TriggerWarper','ScriptSecretLevel'])[0];
        if(target?.class==='TriggerWarper'){this.warpCooldown=this.time+2;this.bridge.warp(target);break;}
        if(target?.class==='ScriptSecretLevel'){this.warpCooldown=this.time+2;this.activate(target);break;}
      }
      for(const q of this.queue.filter(q=>q.at<=this.time)){this.queue=this.queue.filter(v=>v!==q);this.execute(q.record);}
      for(const [go,until] of this.switchUntil)if(until<=this.time){
        this.switchUntil.delete(go);
        for(const link of this.records.filter(r=>r.class==='ScriptAlienDoorLink')){
          const links=this.links(link),switches=links.slice(1).flatMap(id=>this.targets(id,['TimedSwitch']));
          if(switches.some(s=>s.go===go)&&!switches.some(s=>(this.switchUntil.get(s.go)||0)>this.time))for(const d of this.doors(links[0])){for(const w of d.walls||[])this.bridge.door(w,true,-1);d.open=false;d.locked=true;}
        }
      }
      if(!this.escaping)for(const factory of this.factories.values()){
        const r=factory.record;if(this.dead.has(r.go)||this.disabled.has(r.go)||this.time<factory.next)continue;
        factory.spawned=factory.spawned.filter(o=>states[o.index]?.type===2&&states[o.index]?.signature===o.signature);
        if(factory.spawned.length>=Math.max(1,r.data.m_matcen_max_robots_alive||4)||Math.hypot(...player.position.map((v,i)=>v-r.position[i]))>=50)continue;
        factory.next=this.time+Math.max(2,r.data.m_matcen_spawn_wait||7);const created=this.bridge.spawn(r);if(created)factory.spawned.push(created);
      }
      for(const r of this.records){
        if(r.class!=='TriggerEnter'||!r.active||this.disabled.has(r.go))continue;
        const previous=this.triggerTimes.get(r.id);if(previous!=null&&(r.data.m_one_time||this.time-previous<Math.max(.1,r.data.m_repeat_delay)))continue;
        if(this.inside(r,player.position)||(r.data.m_player_weapons&&states.some(s=>s?.playerShot&&this.inside(r,s.position)))){this.triggerTimes.set(r.id,this.time);this.fireLinks(r);}
      }
      if(this.levelOne){
        const r=this.levelOne,goal=r.data.special_index||40,links=this.links(r);
        if(this.levelOnePhase===0&&this.kills>=goal-5){this.levelOnePhase=1;this.levelOneTimer=this.time+300;}
        if(this.levelOnePhase===1&&(this.kills>=goal||this.time>=this.levelOneTimer)){this.signal(links[this.kills>=goal?0:1]);this.levelOnePhase=2;this.levelOneTimer=this.time+(this.kills>=goal?10:8);}
        if(this.levelOnePhase===2&&this.time>=this.levelOneTimer){this.levelOnePhase=3;if(player.position[1]<=r.position[1]-10)this.signal(links[2]);}
        if(this.levelOnePhase===3&&player.position[1]>r.position[1]){this.levelOnePhase=4;this.signal(links[4]);}
      }
      for(const lockdown of this.lockdowns){
        if(lockdown.done)continue;
        if(lockdown.remaining>0&&this.time>=lockdown.next&&lockdown.robots.length){
          const r=lockdown.robots[lockdown.spawned.length];this.reveal(r.go);lockdown.spawned.push(r);lockdown.remaining--;lockdown.next=this.time+lockdown.interval;if(!lockdown.remaining)lockdown.safety=this.time+90;
        }
        if(!lockdown.remaining&&(lockdown.spawned.every(r=>this.dead.has(r.go))||(!lockdown.boss&&this.time>=lockdown.safety))){lockdown.done=true;for(const d of lockdown.doors)this.setDoor(d,false,true);if(lockdown.boss)this.escape();this.bridge.lockdownDone(lockdown.record);}
      }
      if(this.escaping&&(this.meta.exitRooms||[]).includes(player.room))this.complete();
      for(const r of this.records.filter(r=>r.class==='AlienWarp'))if(this.warpActive.has(r.go)&&Math.hypot(...player.position.map((v,i)=>v-r.position[i]))<3)this.complete();
    }
    serialize(){
      const out={version:1,scene:this.meta.scene};
      for(const k of ['time','clearance','kills','escaping','finished','levelOnePhase','levelOneTimer','warpCooldown','challengeNext','challengeEnd'])out[k]=this[k];
      for(const k of ['dead','done','warpActive','disabled','hidden'])out[k]=[...this[k]];
      for(const k of ['counts','triggerTimes','objectSignatures','switchUntil','alienCharge'])out[k]=[...this[k]];
      out.queue=this.queue.map(q=>({at:q.at,id:q.record.id}));
      out.factories=[...this.factories].map(([go,f])=>[go,{id:f.record.id,next:f.next,spawned:f.spawned}]);
      out.lockdowns=this.lockdowns.map(l=>({...l,record:l.record.id,doors:l.doors.map(r=>r.id),robots:l.robots.map(r=>r.id),spawned:l.spawned.map(r=>r.id)}));
      out.challengeRobots=this.challengeRobots||[];
      return out;
    }
    restore(saved){
      if(saved.version!==1||saved.scene!==this.meta.scene)throw Error('Campaign save does not match this mine');
      for(const k of ['time','clearance','kills','escaping','finished','levelOnePhase','levelOneTimer','warpCooldown','challengeNext','challengeEnd'])if(saved[k]!=null)this[k]=saved[k];
      for(const k of ['dead','done','warpActive','disabled','hidden'])this[k]=new Set(saved[k]);
      for(const k of ['counts','triggerTimes','objectSignatures','switchUntil','alienCharge'])this[k]=new Map(saved[k]);
      this.queue=saved.queue.map(q=>({at:q.at,record:this.byId.get(q.id)}));
      this.factories=new Map(saved.factories.map(([go,f])=>[go,{record:this.byId.get(f.id),next:f.next,spawned:f.spawned}]));
      this.lockdowns=saved.lockdowns.map(l=>({...l,record:this.byId.get(l.record),doors:l.doors.map(id=>this.byId.get(id)),robots:l.robots.map(id=>this.byId.get(id)),spawned:l.spawned.map(id=>this.byId.get(id))}));
      this.challengeRobots=saved.challengeRobots||[];
    }
  }
  root.AstraOverloadMission=MissionController;
  if(typeof module!=='undefined')module.exports=MissionController;
})(typeof window!=='undefined'?window:globalThis);
