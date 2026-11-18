/* Browser joystick math is independent of native flight physics. */
((root,factory)=>{const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AstraControllerCore=api;})(globalThis,()=>{
  'use strict';
  const clamp=(n,a=-1,b=1)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:0));
  const axes=['pitch','yaw','roll','slide','lift','thrust'];
  const buttons=['primary','secondary','afterburner','rear','transfer','flare','bomb','cyclePrimary','cycleSecondary','headlight','automap','toggleBomb','pause'];
  const movement={pitchUp:[0,1],pitchDown:[0,-1],yawRight:[1,1],yawLeft:[1,-1],rollRight:[2,1],rollLeft:[2,-1],slideRight:[3,1],slideLeft:[3,-1],up:[4,1],down:[4,-1],forward:[5,1],reverse:[5,-1]};
  const key=p=>JSON.stringify([p.id||'Controller',p.mapping||'',p.axes.length,p.buttons.length]);
  function deviceKind(p){
    if(p.mapping==='standard')return 'gamepad';
    if(/rudder pedals|flight pedals|t-rudder|flight rudder/i.test(p.id))return 'pedals';
    if(/throttle quadrant|twcs throttle|standalone throttle/i.test(p.id))return 'throttle';
    if(p.axes.length>=6&&/3dconnexion|spacemouse|spacenavigator/i.test(p.id))return 'six';
    return 'stick';
  }
  function preset(p,kind=deviceKind(p)){
    const profile={enabled:true,kind,deadzone:.09,curve:1.35,gain:1,axes:Array.from(p.axes,v=>({action:'none',invert:false,mode:'centered',center:Math.abs(v)>1?v:0,min:-1,max:1})),buttons:Array.from(p.buttons,()=> 'none')};
    const set=(i,action,invert=false,mode='centered')=>{if(profile.axes[i])Object.assign(profile.axes[i],{action,invert,mode});};
    if(kind==='gamepad'){
      set(0,'slide');set(1,'thrust',true);set(2,'yaw');set(3,'pitch');
      ['afterburner','flare','cyclePrimary','cycleSecondary','rollLeft','rollRight','secondary','primary','automap','pause','rear','headlight','up','down','slideLeft','slideRight'].forEach((v,i)=>{if(i<profile.buttons.length)profile.buttons[i]=v;});
    }else if(kind==='six'){
      set(0,'slide');set(1,'lift',true);set(2,'thrust',true);set(3,'pitch');set(4,'yaw');set(5,'roll');
      if(profile.buttons.length)profile.buttons[0]='primary';
      if(profile.buttons.length>1)profile.buttons[1]='secondary';
    }else if(kind==='throttle'){
      set(0,'thrust',true,'throttle');
    }else if(kind==='pedals'){
      set(0,'yaw');
    }else if(kind==='stick'){
      set(0,'yaw');set(1,'pitch');set(2,'roll');
      if(profile.axes[3])set(3,Math.abs(p.axes[3])>1?'hat':'thrust',Math.abs(p.axes[3])<=1,Math.abs(p.axes[3])>1?'hat':'throttle');
      for(let i=0;i<p.axes.length;i++)if(Math.abs(p.axes[i])>1)set(i,'hat',false,'hat');
      ['primary','secondary','flare','afterburner','cyclePrimary','cycleSecondary','rear','automap','headlight','bomb','pause','transfer'].forEach((v,i)=>{if(i<profile.buttons.length)profile.buttons[i]=v;});
    }
    return profile;
  }
  function analog(raw,map,profile){
    if(!Number.isFinite(raw))return 0;
    const lo=Number.isFinite(map.min)?map.min:-1,hi=Number.isFinite(map.max)?map.max:1,c=clamp(map.center??0,lo,hi);
    let v=map.mode==='throttle'?clamp((raw-lo)/Math.max(.05,hi-lo),0,1):clamp((raw-c)/Math.max(.05,raw>=c?hi-c:c-lo));
    if(map.invert)v=map.mode==='throttle'?1-v:-v;
    const dz=clamp(profile.deadzone,.01,.4),m=Math.max(0,(Math.abs(v)-dz)/(1-dz));
    return clamp(Math.sign(v)*Math.pow(m,clamp(profile.curve,1,2.5))*clamp(profile.gain,.25,1.5));
  }
  function buttonValue(b){
    const value=typeof b==='number'?b:b?.value;
    return Number.isFinite(value)&&value>0?clamp(value,0,1):Number(b===true||b?.pressed===true);
  }
  function hatStep(raw,map){
    if(!Number.isFinite(raw)||Math.abs(raw)>1.05||Math.abs(raw-map.center)<.1)return -1;
    return Math.round((raw+1)*3.5);
  }
  // Each control becomes live independently. A parked throttle must never
  // prevent the pilot from steering or firing after a menu or a reconnect.
  function locksFor(p,profile){
    return {
      axes:profile.axes.map((map,i)=>{
        const raw=p.axes[i];
        if(!Number.isFinite(raw)||map.action==='none')return null;
        const value=map.action==='hat'?hatStep(raw,map)>=0:analog(raw,map,profile);
        const displaced=buttons.includes(map.action)?value>.5:Math.abs(value)>.035;
        return displaced?raw:null;
      }),
      buttons:Array.from(p.buttons,b=>buttonValue(b)>.5)
    };
  }
  function read(p,profile,locks){
    const motion=[0,0,0,0,0,0],held=Object.fromEntries(buttons.map(n=>[n,false]));
    if(!p||!profile?.enabled||p.connected===false)return {motion,held};
    profile.axes.forEach((map,i)=>{
      const raw=p.axes[i];if(map.action==='none'||!Number.isFinite(raw))return;
      if(map.action==='hat'){
        const step=hatStep(raw,map);
        if(locks&&locks.axes[i]!==null){if(step<0)locks.axes[i]=null;return;}
        if(step<0)return;
        const a=step*Math.PI/4;motion[3]+=Math.sin(a);motion[4]+=Math.cos(a);return;
      }
      const value=analog(raw,map,profile),at=axes.indexOf(map.action);
      if(locks&&locks.axes[i]!==null){
        if(at<0?value>.5:map.mode==='throttle'?Math.abs(raw-locks.axes[i])<.06&&value>.035:Math.abs(value)>.035)return;
        locks.axes[i]=null;
      }
      if(at>=0)motion[at]+=value;else if(value>.5&&map.action in held)held[map.action]=true;
    });
    profile.buttons.forEach((action,i)=>{const value=buttonValue(p.buttons[i]);
      if(locks?.buttons[i]){if(value<=.035)locks.buttons[i]=false;return;}
      if(movement[action]){const [axis,sign]=movement[action];if(value>profile.deadzone)motion[axis]+=sign*value;}
      else if(value>.5&&action in held)held[action]=true;
    });
    return {motion:motion.map(v=>clamp(v)),held};
  }
  function sanitize(p,saved){
    const base=preset(p);if(!saved||typeof saved!=='object')return base;
    base.enabled=saved.enabled!==false;
    if(['stick','gamepad','six','throttle','pedals','blank'].includes(saved.kind))base.kind=saved.kind;
    for(const [n,lo,hi] of [['deadzone',.01,.4],['curve',1,2.5],['gain',.25,1.5]])if(Number.isFinite(saved[n]))base[n]=clamp(saved[n],lo,hi);
    base.axes=base.axes.map((a,i)=>{
      const b=saved.axes?.[i];if(!b||!['none','hat',...axes,...buttons].includes(b.action))return a;
      const calibrated=Number.isFinite(b.min)&&Number.isFinite(b.max)&&b.max>b.min;
      return {action:b.action,mode:b.action==='hat'?'hat':b.mode==='throttle'?'throttle':'centered',invert:!!b.invert,
        center:Number.isFinite(b.center)?b.center:a.center,min:calibrated?b.min:-1,max:calibrated?b.max:1};
    });
    base.buttons=base.buttons.map((a,i)=>['none',...buttons,...Object.keys(movement)].includes(saved.buttons?.[i])?saved.buttons[i]:a);
    return base;
  }
  return {clamp,axes,buttons,movement,key,preset,analog,buttonValue,locksFor,read,sanitize};
});
