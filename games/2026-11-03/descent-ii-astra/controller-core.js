/* Browser joystick math is independent of native flight physics. */
((root,factory)=>{const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AstraControllerCore=api;})(globalThis,()=>{
  'use strict';
  const clamp=(n,a=-1,b=1)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:0));
  const axes=['pitch','yaw','roll','slide','lift','thrust'];
  const buttons=['primary','secondary','afterburner','rear','transfer','flare','bomb','cyclePrimary','cycleSecondary','headlight','automap','toggleBomb','pause'];
  const movement={pitchUp:[0,1],pitchDown:[0,-1],yawRight:[1,1],yawLeft:[1,-1],rollRight:[2,1],rollLeft:[2,-1],slideRight:[3,1],slideLeft:[3,-1],up:[4,1],down:[4,-1],forward:[5,1],reverse:[5,-1]};
  const key=p=>JSON.stringify([p.id||'Controller',p.mapping||'',p.axes.length,p.buttons.length]);
  function preset(p,kind=p.mapping==='standard'?'gamepad':'stick'){
    const profile={enabled:true,kind,deadzone:.09,curve:1.35,gain:1,axes:p.axes.map(v=>({action:'none',invert:false,mode:'centered',center:Math.abs(v)>1?v:0,min:-1,max:1})),buttons:p.buttons.map(()=> 'none')};
    const set=(i,action,invert=false,mode='centered')=>{if(profile.axes[i])Object.assign(profile.axes[i],{action,invert,mode});};
    if(kind==='gamepad'){
      set(0,'slide');set(1,'thrust',true);set(2,'yaw');set(3,'pitch');
      ['afterburner','flare','cyclePrimary','cycleSecondary','rollLeft','rollRight','secondary','primary','automap','pause','rear','headlight','up','down','slideLeft','slideRight'].forEach((v,i)=>{if(i<profile.buttons.length)profile.buttons[i]=v;});
    }else{
      set(0,'yaw');set(1,'pitch');set(2,'roll');
      if(profile.axes[3])set(3,Math.abs(p.axes[3])>1?'hat':'thrust',Math.abs(p.axes[3])<=1,Math.abs(p.axes[3])>1?'hat':'throttle');
      for(let i=4;i<p.axes.length;i++)if(Math.abs(p.axes[i])>1)set(i,'hat',false,'hat');
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
  function read(p,profile){
    const motion=[0,0,0,0,0,0],held=Object.fromEntries(buttons.map(n=>[n,false]));
    if(!p||!profile?.enabled||p.connected===false)return {motion,held};
    profile.axes.forEach((map,i)=>{
      const raw=p.axes[i];if(map.action==='hat'){
        if(!Number.isFinite(raw)||raw<-1.05||raw>1.05||Math.abs(raw-(map.center??3.28))<.1)return;
        const a=Math.round((raw+1)*3.5)*Math.PI/4;motion[3]+=Math.sin(a);motion[4]+=Math.cos(a);return;
      }
      const at=axes.indexOf(map.action);if(at>=0)motion[at]+=analog(raw,map,profile);
    });
    profile.buttons.forEach((action,i)=>{const b=p.buttons[i],pressed=typeof b==='number'?b>.5:!!b?.pressed||(b?.value||0)>.5;if(!pressed)return;
      if(movement[action]){const [axis,sign]=movement[action];motion[axis]+=sign;}else if(action in held)held[action]=true;
    });
    return {motion:motion.map(v=>clamp(v)),held};
  }
  function sanitize(p,saved){
    const base=preset(p);if(!saved||typeof saved!=='object')return base;
    base.enabled=saved.enabled!==false;for(const n of ['deadzone','curve','gain'])if(Number.isFinite(saved[n]))base[n]=saved[n];
    base.axes=base.axes.map((a,i)=>{const b=saved.axes?.[i];if(!b||!['none','hat',...axes].includes(b.action))return a;return {...a,...b,mode:['centered','throttle','hat'].includes(b.mode)?b.mode:'centered',invert:!!b.invert};});
    base.buttons=base.buttons.map((a,i)=>['none',...buttons,...Object.keys(movement)].includes(saved.buttons?.[i])?saved.buttons[i]:a);
    return base;
  }
  return {clamp,axes,buttons,movement,key,preset,analog,read,sanitize};
});
