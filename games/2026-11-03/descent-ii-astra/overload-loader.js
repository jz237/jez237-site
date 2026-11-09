/* Per-mine loading: the other campaigns never download Overload scenery. */
(function(){
  const base='campaign/';
  const effectKey=e=>e[0]+':'+(e[0]==='hide'?e[2]:e[1]??'all');
  const read=async name=>{const revision=/\.render\.json$|\.mesh\d+\.bin$/.test(name)?'?v=48':'';const r=await fetch(base+name+revision);if(!r.ok)throw Error('Overload asset unavailable: '+name);return new Uint8Array(await r.arrayBuffer());};
  const json=async name=>JSON.parse(new TextDecoder().decode(await read(name)));
  const pool=async (list,fn)=>{let at=0;await Promise.all(Array.from({length:4},async()=>{while(at<list.length)await fn(list[at++]);}));};
  let manifest,actors,combat,story,files=new Set(),actorFiles=new Set();
  window.astraOverload={
    async install(mounted){
      [manifest,actors,combat,story]=await Promise.all([json('manifest.json'),json('actors/manifest.json'),json('robot-combat.json'),json('story.json')]);
      mounted.set('missions/overload.mn2',await read('overload.mn2'));
      await pool([...manifest.levels,...manifest.secrets],async level=>mounted.set('missions/'+level.file,await read(level.file)));
      return this;
    },
    async prepare(name){
      const m=Module;this.controller=null;this.restoreState=null;this.finishRequested=false;m.overloadLate=!!window.astraNet?.session?.late;this.effects=new Map();this.spawns=new Map();this.spawnLocal=new Map();this.spawnSerial=0;this.effectSerial=0;this.lastNetwork=0;this.appliedNetwork=null;this.networkReady=false;
      const discard=file=>{try{m.FS.unlink('/mine/'+file);}catch{}files.delete(file);};
      discard('overload.mesh');
      m.overload=/^ol\d{2}\.rl2$/i.test(name);
      if(!m.overload){for(const file of files)discard(file);return;}
      const id=name.slice(0,-4),entry=[...manifest.levels,...manifest.secrets].find(l=>l.file.toLowerCase()===name.toLowerCase());
      if(!entry)throw Error('Unknown Overload mine '+name);
      const status=document.getElementById('status');status.textContent='Loading Overload · '+entry.name;
      window.astraTerminal?.loading(true);
      try{
        const [meta,render]=await Promise.all([json(id+'.json'),json(id+'.render.json')]);
        const wanted=new Set(render.materials.flatMap(i=>['om'+i+'.png','on'+i+'.png']));
        // Retain only maps shared by the next mine. Memory remains bounded by
        // that mine, and returning from a secret need not re-fetch shared art.
        for(const file of files)if(!wanted.has(file))discard(file);
        const put=(n,bytes)=>{m.FS.writeFile('/mine/'+n,bytes,{canOwn:true});files.add(n);};
        const chunks=new Array(render.shards.length);
        await pool(render.shards.map((name,i)=>({name,i})),async shard=>{chunks[shard.i]=await read(shard.name);});
        const stream=new Blob(chunks).stream().pipeThrough(new DecompressionStream('gzip'));
        const mesh=new Uint8Array(await new Response(stream).arrayBuffer());
        if(mesh.length!==render.uncompressed)throw Error('Overload scenery length check failed');
        put('overload.mesh',mesh);
        await pool([...wanted].filter(n=>!files.has(n)),async n=>put(n,await read('art/'+n)));
        const types=new Set(meta.secret?[0,1,2,3,4,6,8,10,11,13,15,17]:meta.records.filter(r=>r.class==='Robot'&&r.object!=null).map(r=>r.data.robot_type));
        for(const r of meta.records.filter(r=>r.class==='RobotMatcen'))for(const type of [r.data.m_spawnable_robot_1,r.data.m_spawnable_robot_2])if(actors.models[type])types.add(type);
        const needed=new Set();for(const type of types){const model=actors.models[type];if(!model)throw Error('Missing Overload robot '+type);needed.add(model.mesh);for(const mat of model.materials){needed.add('oem'+mat+'.png');needed.add('oen'+mat+'.png');}}
        await pool([...needed].filter(n=>!actorFiles.has(n)),async n=>{
          let bytes=await read('actors/'+n),alias=n;
          if(n.endsWith('.bin')){bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());alias=n.slice(0,-4);}
          m.FS.writeFile('/mine/'+alias,bytes,{canOwn:true});actorFiles.add(n);
        });
        this.meta=meta;m.overloadChunks=meta.chunks;m.overloadRadii=actors.radii;m.overloadMotions=render.motions||{};m.overloadLights=render.lights||[];
        m.overloadTransparent=render.transparent||[];m.overloadHidden=new Set(render.hidden||[]);
        for(const motion of Object.values(m.overloadMotions))motion.wall=meta.doors.find(d=>d.go===motion.owner)?.walls[0]??-1;
        m.overloadPending=true;
      }finally{window.astraTerminal?.loading(false);}
    },
    resyncNetwork(){
      if(!Module.overload||!this.meta||!this.controller||this.authority())return;
      // A native reconnect replaces its object array. Rebind the mission to
      // those objects, then replay the host state without resetting health.
      this.effects=new Map();this.spawns=new Map();this.spawnLocal=new Map();this.effectSerial=0;
      this.networkReady=false;this.finishRequested=false;Module.overloadLate=true;this.begin();
    },
    networked(){return window.astraNet?.session?.campaign==='overload';},
    authority(){const s=window.astraNet?.session;return !this.networked()||s.self===s.host;},
    hit(go,damage){if(this.authority())this.controller?.hit(go,damage);else window.astraNet.campaignHit(go,damage);},
    networkHit(m){
      if(!this.authority()||m.level!==window.astraNet?.targetLevel)return;
      const p=Module.netPilots?.find(p=>p.id===m.from&&p.connected===1);
      if(!p)return;
      // Only a pilot already in this mine can operate its authored switches.
      if(this.meta.records.some(r=>r.go===m.go&&['TimedSwitch','AlienPower'].includes(r.class)))this.controller?.hit(m.go,m.damage);
    },
    configureSpawn(i,type){
      const s=combat[type],m=Module;if(!s||i<0)return;
      m._astra_ov_robot(i,s.health,actors.radii[type]*4,s.speed*4,s.weapon,+s.melee,0);
      for(let g=0;g<Math.min(8,s.guns.length);g++)m._astra_ov_gun(i,g,...s.guns[g]);
      m._astra_ov_traits(i,+s.detonator,s.refire,s.burst,+s.stationary);
    },
    publishNetwork(force=false){
      if(!this.networked()||!this.authority()||!this.controller||!this.networkReady)return;
      const now=performance.now();if(!force&&now-this.lastNetwork<1000)return;this.lastNetwork=now;
      const m=Module,pointer=m._astra_ov_states(),source=window.astraOverloadHeap;
      for(const [key,s] of this.spawns){
        const o=this.spawnLocal.get(key),at=(pointer>>2)+(o?.index||0)*8;
        if(o&&source[at]===2&&source[at+3]===o.signature&&source[at+2]>=0){s.alive=true;s.position=Array.from(source.slice(at+4,at+7));}
        else{s.alive=false;s.deadAt??=now;}
        if(!s.alive&&now-s.deadAt>10000){this.spawns.delete(key);this.spawnLocal.delete(key);}
      }
      const mission=this.controller.serialize();
      for(const f of mission.factories)f[1].spawned=f[1].spawned.map(o=>({...o,key:[...this.spawnLocal].find(([,v])=>v.index===o.index&&v.signature===o.signature)?.[0]}));
      mission.challengeRobots=mission.challengeRobots.map(o=>({...o,key:[...this.spawnLocal].find(([,v])=>v.index===o.index&&v.signature===o.signature)?.[0]}));
      const payload={version:1,scene:this.meta.scene,mission,effects:[...this.effects.values()],spawns:[...this.spawns.values()],objective:this.objective};
      window.astraNet.campaignState(payload);this.lastSnapshotBytes=JSON.stringify(payload).length;
    },
    receiveNetwork(message){
      const p=message?.payload;
      if(this.authority()||!this.controller||!this.networkReady||!p||p.scene!==this.meta.scene||message.level!==window.astraNet?.targetLevel)return;
      const m=Module,bridge=this.nativeBridge,previous=this.effects;
      for(const e of [...p.effects].sort((a,b)=>(a.at(-1)?.stamp||0)-(b.at(-1)?.stamp||0))){
        const [kind,...rest]=e,args=rest.slice(0,-1);if(!['door','reveal','hide','shield','forcefield','activateProp','consume','escape','clearance'].includes(kind))continue;
        const key=effectKey(e);if(JSON.stringify(previous.get(key))!==JSON.stringify(e))bridge[kind](...args);
      }
      this.effects=new Map(p.effects.map(e=>[effectKey(e),e]));this.effectSerial=Math.max(this.effectSerial,...p.effects.map(e=>e.at(-1)?.stamp||0));
      for(const s of p.spawns){
        if(typeof s.key!=='string'||!Array.isArray(s.position)||s.position.length!==3||!combat[s.type])continue;
        if(s.alive&&!this.spawnLocal.has(s.key)){
          let i=m._astra_ov_net_object(s.owner,s.remote);
          if(i<0){i=m._astra_ov_spawn(s.type,s.room,...s.position);if(i>=0){this.configureSpawn(i,s.type);m._astra_ov_net_map(i,s.owner,s.remote);}}
          if(i>=0){const ptr=m._astra_ov_states();this.spawnLocal.set(s.key,{index:i,signature:window.astraOverloadHeap[(ptr>>2)+i*8+3]});}
        }
        if(!s.alive&&this.spawns.get(s.key)?.alive){const o=this.spawnLocal.get(s.key);if(o){const ptr=m._astra_ov_states(),at=(ptr>>2)+o.index*8;if(window.astraOverloadHeap[at+3]===o.signature)m._astra_ov_remove(o.index);}}
      }
      this.spawns=new Map(p.spawns.map(s=>[s.key,s]));
      const saved=JSON.parse(JSON.stringify(p.mission));
      const remap=list=>list.map(o=>this.spawnLocal.get(o.key)).filter(Boolean);
      for(const f of saved.factories)f[1].spawned=remap(f[1].spawned);saved.challengeRobots=remap(saved.challengeRobots);
      // Object signatures are local runtime identifiers, never another pilot's.
      saved.objectSignatures=[...this.controller.objectSignatures];this.controller.restore(saved);
      if(this.objective!==p.objective){this.objective=p.objective;this.notice(p.objective);}
      this.appliedNetwork=message;this.networkSnapshots=(this.networkSnapshots||0)+1;
      if(saved.finished&&!this.finishRequested&&window.astraNet.session.mode==='coop'){this.finishRequested=true;m.overloadFinish=true;}
    },
    begin(){
      const m=Module,meta=this.meta;
      if(!m.overload||!meta)return;
      for(const [type,s] of Object.entries(combat)){
        m._astra_ov_profile(+type,s.health,s.speed*4,s.weapon,+s.melee,+s.detonator,s.refire,s.burst,+s.stationary);
        for(let g=0;g<Math.min(8,s.guns.length);g++)m._astra_ov_type_gun(+type,g,...s.guns[g]);
      }
      for(const r of meta.records){
        if(r.object==null)continue;
        if(r.class==='Robot'){
          const s=r.combat||{},radius=actors.radii[r.data.robot_type]*4;
          m._astra_ov_robot(r.object,s.health||r.data.m_hp||100,radius,(s.speed??r.data.AI_max_combat_speed??5)*4,s.weapon??13,+(s.melee??!!r.data.AI_robot_claw),!!(r.data.m_init_hidden||!r.active));
          if(r.data.m_init_stasis)m._astra_ov_stasis(r.object);
          if(s.guns)for(let i=0;i<Math.min(8,s.guns.length);i++)m._astra_ov_gun(r.object,i,...s.guns[i]);
          m._astra_ov_traits(r.object,+(s.detonator||false),s.refire||.5,s.burst||1,+(s.stationary||false));
        }
      }
      for(const item of meta.objects){
        const list=meta.records.filter(r=>r.object===item.index),r=list.find(r=>r.class===item.class)||list[0];
        if(!r.active)m._astra_ov_visibility(item.index,1);
        if(['Robot','Item'].includes(item.class))continue;
        const destroyable=list.find(r=>r.class==='Destroyable');
        const mode=r.class==='TimedSwitch'?2:r.class==='AlienPower'?3:1;
        m._astra_ov_prop(item.index,r.go,mode,+list.some(r=>r.data.m_invulnerable),r.class==='Reactor'?12:mode>1?4:6,Math.max(1,destroyable?.data.m_hp_starting||destroyable?.data.m_hp||100));
      }
      m.overloadFields=meta.records.filter(r=>r.class==='Forcefield'&&r.box&&r.inverse);m._astra_ov_fields_load();
      const bridge={
        door:(i,l,o)=>m._astra_ov_door(i,+l,+o),reveal:i=>m._astra_ov_reveal(i),
        hide:(i,go)=>{if(i!=null)m._astra_ov_visibility(i,1);m._astra_ov_owner(go,1);},
        shield:(i,on)=>{if(i!=null){m._astra_ov_shield(i,+on);for(const r of meta.records.filter(r=>r.object===i)){const shield=r.data.m_shield?.m_PathID;if(shield)m._astra_ov_owner(shield,+!on);}}},
        forcefield:(go,on)=>{m._astra_ov_owner(go,+!on);m._astra_ov_field_enable(go,+on);},
        activateProp:go=>m._astra_ov_owner(go,0),
        consume:i=>m._astra_ov_remove(i),
        recharge:(amount,cap)=>m._astra_ov_recharge(amount,cap),
        warp:r=>{
          const [x,y,z,w]=r.rotation,forward=[2*(x*z+w*y),2*(y*z-w*x),1-2*(x*x+y*y)],up=[2*(x*y-w*z),1-2*(x*x+z*z),2*(y*z+w*x)];
          m._astra_ov_warp(...r.position,r.room,...forward,...up);this.notice('Teleport complete');
        },
        spawn:r=>{
          const [x,y,z,w]=r.rotation,f=[2*(x*z+w*y),2*(y*z-w*x),1-2*(x*x+y*y)];
          const probability=r.data.m_spawnable_probability_1/Math.max(.0001,r.data.m_spawnable_probability_1+r.data.m_spawnable_probability_2);
          const type=Math.random()<probability?r.data.m_spawnable_robot_1:r.data.m_spawnable_robot_2,s=combat[type];if(!s)throw Error('Missing robot combat profile '+type);
          const position=r.position.map((v,i)=>v+f[i]*(r.challenge?0:2.5)),i=m._astra_ov_spawn(type,r.room,...position);if(i<0)return null;
          this.configureSpawn(i,type);
          const pointer=m._astra_ov_states(),o={index:i,signature:window.astraOverloadHeap[(pointer>>2)+i*8+3]};
          if(this.networked()){
            const owner=window.astraNet.session.self,key=owner+':'+i+':'+o.signature+':'+(++this.spawnSerial);
            this.spawns.set(key,{key,owner,remote:i,type,room:r.room,position,alive:true});this.spawnLocal.set(key,o);
            if(!this.spawnPublishQueued){this.spawnPublishQueued=true;queueMicrotask(()=>{this.spawnPublishQueued=false;this.publishNetwork(true);});}
          }return o;
        },
        clearance:n=>this.notice('Security clearance '+n),
        finish:()=>{this.finishRequested=true;if(this.networked())this.publishNetwork(true);if(!this.networked()||window.astraNet.session.mode==='coop')m.overloadFinish=true;},
        escape:()=>{m._astra_ov_escape();this.notice('Emergency exit unlocked · Escape the mine');},
        message:(kind,index)=>{
          const objectives={0:'Five robots remaining',1:'Return to the surface',2:'Enter the alien portal',3:'Escape the facility',4:'Destroy the reactor',11:'Shoot the energy switch',12:'Charge the energy switch with sustained fire',13:'Activate the energy cores'};
          if(kind==='ScriptObjectiveMessage'){this.objective=objectives[index]||this.objective;this.notice(this.objective);}
          else if(kind==='ScriptCommMessage'){
            const text=story[meta.scene]?.comms[index-1];if(text){this.comms??=[];this.comms.push(text);this.notice(text.split('\n')[0].replace(';',': '));}
          }
        },
        error:message=>{m.overloadErrors??=[];m.overloadErrors.push(message);console.error(message);},
        secret:r=>{if(this.networked()){this.notice('Bonus arenas are available in Solo play · Continue the co-op mission');return;}m.overloadSecret=true;},
        challengeTime:seconds=>{if(seconds%30===0||seconds<=10)this.notice('Secret arena · '+seconds+' seconds remaining');},
        guide:()=>{},matcen:r=>this.notice('Robot factory active'),lockdownDone:()=>this.notice('Lockdown cleared')
      };
      this.nativeBridge={...bridge};
      for(const kind of ['door','reveal','hide','shield','forcefield','activateProp','consume','escape','clearance']){
        const original=bridge[kind];bridge[kind]=(...args)=>{const e=[kind,...args,{stamp:++this.effectSerial}];this.effects.set(effectKey(e),e);return original(...args);};
      }
      const saved=this.restoreState;
      this.controller=new AstraOverloadMission(meta,bridge,saved?.mission);
      if(saved){
        const hidden=new Set(saved.visualHidden);for(const go of new Set([...m.overloadHidden,...hidden]))m._astra_ov_owner(go,+hidden.has(go));
        for(const go of this.controller.disabled)m._astra_ov_field_enable(go,0);
        this.restoreState=null;
      }
      const custom=meta.records.find(r=>r.class==='LevelCustomInfo')?.data;
      this.objective=meta.secret?'Survive the three-minute robot arena, then return to your mission':custom?.m_objective===1?'Destroy '+custom.m_custom_count+' robots, then return to the surface':custom?.m_objective===3?'Charge the alien cores with weapon fire to activate the warp portal':custom?.m_objective===2?'Secure the crash site and locate the escape route':meta.records.some(r=>r.class==='Reactor')?'Find the security keys, destroy the reactor and escape':'Defeat the command robot and escape';
      if(saved?.objective)this.objective=saved.objective;
      this.notice(meta.name+' · '+this.objective);
      this.networkReady=true;m.overloadLate=false;
      if(this.networked()){if(this.authority())this.publishNetwork(true);else{this.receiveNetwork(window.astraNet.campaignSnapshot);window.astraNet.campaignRequest();}}
    },
    save(){return {objective:this.objective,mission:this.controller.serialize(),visualHidden:[...Module.overloadHidden]};},
    notice(text){
      if(!text)return;Module.overloadNotice={text,until:performance.now()+5000};
      let box=document.getElementById('overloadNotice');
      if(!box){box=document.createElement('div');box.id='overloadNotice';box.setAttribute('role','status');box.style.cssText='position:fixed;top:12%;left:50%;transform:translateX(-50%);padding:9px 16px;background:#071c26d9;color:#bbf9ff;border:1px solid #55cdd0;border-radius:5px;z-index:50;pointer-events:none;font:15px system-ui;max-width:70vw;text-align:center';document.body.append(box);}
      box.textContent=text;box.hidden=false;clearTimeout(this.noticeTimer);this.noticeTimer=setTimeout(()=>box.hidden=true,5000);
    },
    tick(dt,pointer,room,alive,ownObject=0){
      if(!Module.overload||!this.controller)return;
      const heap=Module.HEAPF32; // The runtime view is passed below when not exported.
      const source=window.astraOverloadHeap||heap;
      if(!source)return;
      const raw=source.subarray(pointer>>2,(pointer>>2)+8000),states=this.states||(this.states=Array.from({length:1000},()=>({position:[0,0,0]})));
      for(let i=0;i<1000;i++){const at=i*8,s=states[i];s.type=raw[at];s.flags=raw[at+1];s.shields=raw[at+2];s.signature=raw[at+3];s.position[0]=raw[at+4];s.position[1]=raw[at+5];s.position[2]=raw[at+6];s.hidden=s.type!==5&&!!raw[at+7];s.playerShot=s.type===5&&!!raw[at+7];}
      const player={alive:!!alive,room,position:states[ownObject]?.position||states[0].position};
      this.controller.localTick(dt,player);
      if(!this.networked())this.controller.tick(dt,player,states);
      else if(this.authority()){
        const party=(Module.netPilots||[]).filter(p=>p.connected===1&&p.type===4&&p.shields>0).map(p=>({alive:true,room:p.room,position:[p.x/4,p.y/4,p.z/4]}));
        if(!party.length&&player.alive)party.push(player);
        this.controller.tick(dt,player,states,party);this.publishNetwork();
      }
    }
  };
})();
