/* Per-mine loading: the other campaigns never download Overload scenery. */
(function(){
  const base='campaign/';
  const read=async name=>{const r=await fetch(base+name);if(!r.ok)throw Error('Overload asset unavailable: '+name);return new Uint8Array(await r.arrayBuffer());};
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
      const m=Module;this.controller=null;this.restoreState=null;
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
        this.meta=meta;m.overloadChunks=meta.chunks;m.overloadRadii=actors.radii;m.overloadMotions=render.motions||{};
        m.overloadTransparent=render.transparent||[];m.overloadHidden=new Set(render.hidden||[]);
        for(const motion of Object.values(m.overloadMotions))motion.wall=meta.doors.find(d=>d.go===motion.owner)?.walls[0]??-1;
        m.overloadPending=true;
      }finally{window.astraTerminal?.loading(false);}
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
          m._astra_ov_robot(i,s.health,actors.radii[type]*4,s.speed*4,s.weapon,+s.melee,0);
          for(let g=0;g<Math.min(8,s.guns.length);g++)m._astra_ov_gun(i,g,...s.guns[g]);
          m._astra_ov_traits(i,+s.detonator,s.refire,s.burst,+s.stationary);
          const pointer=m._astra_ov_states();return {index:i,signature:window.astraOverloadHeap[(pointer>>2)+i*8+3]};
        },
        clearance:n=>this.notice('Security clearance '+n),
        finish:()=>{m.overloadFinish=true;},
        escape:()=>{m._astra_ov_escape();this.notice('Emergency exit unlocked · Escape the mine');},
        message:(kind,index)=>{
          const objectives={0:'Five robots remaining',1:'Return to the surface',2:'Enter the alien portal',3:'Escape the facility',4:'Destroy the reactor',11:'Shoot the energy switch',12:'Charge the energy switch with sustained fire',13:'Activate the energy cores'};
          if(kind==='ScriptObjectiveMessage'){this.objective=objectives[index]||this.objective;this.notice(this.objective);}
          else if(kind==='ScriptCommMessage'){
            const text=story[meta.scene]?.comms[index-1];if(text){this.comms??=[];this.comms.push(text);this.notice(text.split('\n')[0].replace(';',': '));}
          }
        },
        error:message=>{m.overloadErrors??=[];m.overloadErrors.push(message);console.error(message);},
        secret:r=>{m.overloadSecret=true;},
        challengeTime:seconds=>{if(seconds%30===0||seconds<=10)this.notice('Secret arena · '+seconds+' seconds remaining');},
        guide:()=>{},matcen:r=>this.notice('Robot factory active'),lockdownDone:()=>this.notice('Lockdown cleared')
      };
      const saved=this.restoreState;
      this.controller=new AstraOverloadMission(meta,bridge,saved?.mission);
      if(saved){
        const hidden=new Set(saved.visualHidden);for(const go of new Set([...m.overloadHidden,...hidden]))m._astra_ov_owner(go,+hidden.has(go));
        for(const go of this.controller.disabled)m._astra_ov_field_enable(go,0);
        this.restoreState=null;
      }
      const custom=meta.records.find(r=>r.class==='LevelCustomInfo')?.data;
      this.objective=meta.secret?'Survive the three-minute robot arena, then return to your mission':custom?.m_objective===1?'Destroy '+custom.m_custom_count+' robots, then return to the surface':custom?.m_objective===3?'Charge the alien cores with weapon fire to activate the warp portal':custom?.m_objective===2?'Secure the crash site and locate the escape route':meta.records.some(r=>r.class==='Reactor')?'Find the security keys, destroy the reactor and escape':'Defeat the command robot and escape';
      this.notice(meta.name+' · '+this.objective);
    },
    save(){return {mission:this.controller.serialize(),visualHidden:[...Module.overloadHidden]};},
    notice(text){
      if(!text)return;Module.overloadNotice={text,until:performance.now()+5000};
      let box=document.getElementById('overloadNotice');
      if(!box){box=document.createElement('div');box.id='overloadNotice';box.setAttribute('role','status');box.style.cssText='position:fixed;top:12%;left:50%;transform:translateX(-50%);padding:9px 16px;background:#071c26d9;color:#bbf9ff;border:1px solid #55cdd0;border-radius:5px;z-index:50;pointer-events:none;font:15px system-ui;max-width:70vw;text-align:center';document.body.append(box);}
      box.textContent=text;box.hidden=false;clearTimeout(this.noticeTimer);this.noticeTimer=setTimeout(()=>box.hidden=true,5000);
    },
    tick(dt,pointer,room,alive){
      if(!Module.overload||!this.controller)return;
      const heap=Module.HEAPF32; // The runtime view is passed below when not exported.
      const source=window.astraOverloadHeap||heap;
      if(!source)return;
      const raw=source.subarray(pointer>>2,(pointer>>2)+8000),states=this.states||(this.states=Array.from({length:1000},()=>({position:[0,0,0]})));
      for(let i=0;i<1000;i++){const at=i*8,s=states[i];s.type=raw[at];s.flags=raw[at+1];s.shields=raw[at+2];s.signature=raw[at+3];s.position[0]=raw[at+4];s.position[1]=raw[at+5];s.position[2]=raw[at+6];s.hidden=s.type!==5&&!!raw[at+7];s.playerShot=s.type===5&&!!raw[at+7];}
      this.controller.tick(dt,{alive:!!alive,room,position:states[0].position},states);
    }
  };
})();
