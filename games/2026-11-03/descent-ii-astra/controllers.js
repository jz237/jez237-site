/* Hot-plug setup and per-device profiles; native controls own flight and weapons. */
(()=>{
  'use strict';const C=AstraControllerCore,store='astra.controllers.v1';
  let saved={profiles:{},selected:''};try{const v=JSON.parse(localStorage.getItem(store));if(v?.profiles&&typeof v.profiles==='object'&&!Array.isArray(v.profiles))saved={profiles:v.profiles,selected:typeof v.selected==='string'?v.selected:''};}catch{}
  const devices=new Map();
  let pad=null,profile=null,currentKey=saved.selected,armed=false,last={},dialog=null,calibrating=false,calibration=null,lastDevices=null,learning=null,accessError='';
  const empty=()=>Array(24).fill(0);
  function safePads(){
    try{const list=navigator.getGamepads?.()||[];accessError='';return Array.from(list).filter(p=>p&&p.connected!==false);}
    catch(e){accessError=e.name==='SecurityError'?'Joystick access is blocked. Open Astra directly in a browser tab.':'The browser could not read the controllers.';return [];}
  }
  const labels={none:'Unassigned',pitch:'Pitch · pull back to climb',yaw:'Turn left / right',roll:'Roll left / right',slide:'Slide left / right',lift:'Slide up / down',thrust:'Forward / reverse',hat:'POV hat · slide',primary:'Fire primary',secondary:'Fire missile',afterburner:'Afterburner',rear:'Rear view',transfer:'Energy → shields',flare:'Fire flare',bomb:'Drop bomb',cyclePrimary:'Next primary',cycleSecondary:'Next missile',headlight:'Headlight',automap:'Automap',toggleBomb:'Switch bomb type',pause:'Flight menu',pitchUp:'Pitch up',pitchDown:'Pitch down',yawLeft:'Turn left',yawRight:'Turn right',rollLeft:'Roll left',rollRight:'Roll right',slideLeft:'Slide left',slideRight:'Slide right',up:'Slide up',down:'Slide down',forward:'Forward thrust',reverse:'Reverse thrust'};
  const q=id=>document.getElementById(id),text=(id,value)=>{const el=q(id);if(el&&el.textContent!==value)el.textContent=value;};
  function save(){
    for(const device of devices.values())saved.profiles[device.key]=device.profile;
    saved.selected=currentKey||saved.selected;
    try{localStorage.setItem(store,JSON.stringify(saved));}catch{text('controllerMessage','Settings could not be saved in this browser.');}
  }
  function reset(){armed=false;last={};for(const device of devices.values())device.locks=null;}
  function cancelCalibration(){calibrating=false;calibration=null;if(q('controllerCalibrate'))q('controllerCalibrate').textContent='Calibrate ranges';}
  function discover(){
    const pads=safePads();
    for(const [index,device] of devices){
      const next=pads.find(p=>p.index===index),prev=device.pad;
      if(!next||next.id!==prev.id||next.mapping!==prev.mapping||next.axes.length!==prev.axes.length||next.buttons.length!==prev.buttons.length){
        devices.delete(index);
        if(device.key===currentKey){cancelCalibration();stopLearning();pad=profile=null;}
      }
    }
    for(const p of pads){
      const existing=devices.get(p.index);
      if(existing){existing.pad=p;continue;}
      const base=C.key(p);let key=base,slot=1;
      while([...devices.values()].some(d=>d.key===key))key=base+' #'+(++slot);
      const stored=saved.profiles[key],binding=C.sanitize(p,stored);
      if(!stored)binding.enabled=key===saved.selected||(![...devices.values()].some(d=>d.profile.enabled)&&!pads.some(other=>other!==p&&C.key(other)===saved.selected));
      devices.set(p.index,{key,pad:p,profile:binding,locks:null});
    }
    if(!devices.size){pad=profile=null;return pads;}
    let found=pad&&devices.get(pad.index);
    if(!found||found.key!==currentKey)found=[...devices.values()].find(d=>d.key===currentKey)||[...devices.values()].find(d=>d.key===saved.selected)||devices.values().next().value;
    if(found){pad=found.pad;profile=found.profile;currentKey=found.key;}
    else{pad=profile=null;}
    return pads;
  }
  function active(){const m=window.Module;return !!m&&typeof flightActive!=='undefined'&&flightActive&&!m.autopilot&&!m.demo&&!window.astraPreview?.active&&!document.hidden&&document.hasFocus()&&!document.body.classList.contains('native-open')&&!window.astraNet?.menuOpen&&!dialog?.open&&!calibrating;}
  function sample(){
    discover();const out=empty();if(!active()||!devices.size){if(armed)reset();return out;}
    const held={};armed=false;
    for(const device of devices.values()){
      if(!device.profile.enabled)continue;
      armed=true;
      if(!device.locks)device.locks=C.locksFor(device.pad,device.profile);
      const state=C.read(device.pad,device.profile,device.locks);
      for(let i=0;i<6;i++)out[i]+=state.motion[i];
      for(const key of C.buttons)if(state.held[key])held[key]=true;
    }
    for(let i=0;i<6;i++)out[i]=C.clamp(out[i]);
    for(let i=0;i<C.buttons.length;i++){const key=C.buttons[i],down=!!held[key];out[6+i]=i<5?+down:+(down&&!last[key]);}
    if(out[18]){window.releaseFlightMouse?.();window.Module.menuCommand=1;reset();return empty();}
    last=held;return out;
  }
  function stopLearning(){learning=null;if(q('controllerLearn')){q('controllerLearn').textContent='Learn input';text('controllerLearnStatus','');}}
  const positive=['pitchUp','yawRight','rollRight','slideRight','up','forward'];
  function learnInput(){
    if(!learning)return;
    const action=learning.action,axis=C.axes.indexOf(action);
    const button=Array.from(pad.buttons).findIndex((b,i)=>C.buttonValue(b)>.55&&learning.buttons[i]<.25);
    let message='';
    if(button>=0){
      profile.buttons[button]=axis>=0?positive[axis]:action;
      message='Button '+(button+1);
    }else{
      let best=-1,largest=.32;
      pad.axes.forEach((v,i)=>{
        const start=learning.axes[i],delta=Math.abs(v-start);
        if(Number.isFinite(v)&&Number.isFinite(start)&&Math.abs(v)<=1&&Math.abs(start)<=1&&profile.axes[i].action!=='hat'&&delta>largest){best=i;largest=delta;}
      });
      if(best<0)return;
      // A direction-only button action (e.g. reverse) is bound with a button.
      if(axis<0&&!C.buttons.includes(action))return;
      const map=profile.axes[best],start=learning.axes[best];
      if(axis>=0)for(const other of profile.axes)if(other!==map&&other.action===action)other.action='none';
      map.action=action;map.invert=pad.axes[best]<start;
      if(Math.abs(start)>.75&&(axis<0||action==='thrust'))map.mode='throttle';
      else if(Math.abs(start)<.7){map.mode='centered';map.center=start;}
      message='Axis '+(best+1);
    }
    stopLearning();save();reset();render();text('controllerLearnStatus',message+' assigned to '+labels[action]+'.');
  }
  function beginLearning(){
    if(!pad)return;
    if(learning){stopLearning();return;}
    cancelCalibration();const action=q('controllerLearnAction').value,axis=C.axes.indexOf(action);
    learning={action,axes:Array.from(pad.axes),buttons:Array.from(pad.buttons,C.buttonValue)};
    q('controllerLearn').textContent='Cancel learning';
    const directions=['pull back to pitch up','turn right','roll right','slide right','slide up','move toward forward thrust'];
    text('controllerLearnStatus',axis>=0?'Move one control to '+directions[axis]+', or press a button for that direction.':C.buttons.includes(action)?'Press a button or move a trigger for '+labels[action]+'.':'Press a button for '+labels[action]+'.');
  }
  function select(options,value,change){const el=document.createElement('select');for(const [v,label] of options){const option=document.createElement('option');option.value=v;option.textContent=label;el.append(option);}el.value=value;el.onchange=()=>change(el.value);return el;}
  function render(){
    if(!dialog?.open)return;const host=q('controllerBindings');host.replaceChildren();
    if(!pad||!profile){q('controllerOptions').hidden=true;return;}q('controllerOptions').hidden=false;
    q('controllerEnabled').checked=profile.enabled;q('controllerDeadzone').value=profile.deadzone;q('controllerCurve').value=profile.curve;q('controllerGain').value=profile.gain;
    for(const [id,key] of [['Deadzone','deadzone'],['Curve','curve'],['Gain','gain']])q('controller'+id+'Value').value=key==='deadzone'?Math.round(profile[key]*100)+'%':profile[key].toFixed(2);
    text('controllerDeviceName',pad.id);q('controllerPreset').value=profile.kind;
    const axes=document.createElement('section');axes.innerHTML='<h3>Axes</h3><p>Move each control to identify it. For a single POV axis, select “POV hat” and capture its neutral position.</p>';
    profile.axes.forEach((a,i)=>{const row=document.createElement('div');row.className='controller-axis';const label=document.createElement('label');label.textContent='Axis '+(i+1);const meter=document.createElement('meter');meter.id='controllerAxis'+i;meter.min=-1;meter.max=1;meter.low=-.1;meter.high=.1;meter.optimum=0;label.append(meter);row.append(label);
      const action=select(['none',...C.axes,'hat',...C.buttons].map(n=>[n,labels[n]]),a.action,v=>{a.action=v;if(v==='hat'){a.mode='hat';a.center=pad.axes[i];}else if(a.mode==='hat'){a.mode='centered';a.center=0;}save();reset();render();});action.setAttribute('aria-label','Axis '+(i+1)+' action');row.append(action);
      const mode=select([['centered','Centered axis'],['throttle','Throttle · 0–100%']],a.mode==='hat'?'centered':a.mode,v=>{a.mode=v;save();reset();});mode.disabled=a.action==='hat';mode.setAttribute('aria-label','Axis '+(i+1)+' range');row.append(mode);
      const invert=document.createElement('label');invert.className='controller-invert';const check=document.createElement('input');check.type='checkbox';check.checked=a.invert;check.onchange=()=>{a.invert=check.checked;save();reset();};invert.append(check,' Invert');row.append(invert);axes.append(row);
    });host.append(axes);
    const buttons=document.createElement('section');buttons.innerHTML='<h3>Buttons</h3><p>Pressed buttons light up below. A hat may appear as buttons or an axis, depending on its driver.</p>';
    profile.buttons.forEach((action,i)=>{const row=document.createElement('label');row.className='controller-button';const badge=document.createElement('span');badge.id='controllerButton'+i;badge.textContent='Button '+(i+1);row.append(badge,select(['none',...C.buttons,...Object.keys(C.movement)].map(n=>[n,labels[n]]),action,v=>{profile.buttons[i]=v;save();reset();}));buttons.append(row);});host.append(buttons);
  }
  function tick(){
    if(!dialog?.open)return;const pads=discover(),signature=pads.map(p=>C.key(p)+'@'+p.index).join('|');
    if(signature!==lastDevices){lastDevices=signature;const device=q('controllerDevice');device.replaceChildren();
      const option=document.createElement('option');option.value='';option.textContent=pads.length?'Choose a controller':'No controller detected';device.append(option);
      pads.forEach(p=>{const option=document.createElement('option');option.value=String(p.index);option.textContent=p.id+' · input '+(p.index+1);device.append(option);});device.value=pad?String(pad.index):'';render();}
    text('controllerStatus',accessError||(!navigator.getGamepads?'This browser does not expose joystick input.':!pad?'Plug in your controller, then press a button while this page is focused.':calibrating?'Move every stick, twist, slider and pedal through its full range, then finish calibration.':`${pad.axes.length} axes · ${pad.buttons.length} buttons · ${[...devices.values()].filter(d=>d.profile.enabled).length} enabled of ${pads.length} connected`));
    if(!pad)return;
    if(learning)learnInput();
    if(calibrating)pad.axes.forEach((v,i)=>{if(profile.axes[i]?.action!=='hat'&&Number.isFinite(v)&&Math.abs(v)<=1.1){calibration[i].min=Math.min(calibration[i].min,v);calibration[i].max=Math.max(calibration[i].max,v);}});
    pad.axes.forEach((v,i)=>{const meter=q('controllerAxis'+i);if(meter){meter.value=C.clamp(v);meter.title=Number.isFinite(v)?v.toFixed(3):'Unavailable';}});
    pad.buttons.forEach((b,i)=>q('controllerButton'+i)?.classList.toggle('pressed',C.buttonValue(b)>.5));
  }
  function open(){
    if(!dialog){dialog=document.createElement('dialog');dialog.id='controllerDialog';dialog.innerHTML=`<div class="controller-shell"><header><div><small>FLIGHT HARDWARE</small><h2>Joysticks &amp; controllers</h2></div><button id="controllerClose" aria-label="Close controller setup">Close ×</button></header><p id="controllerStatus" role="status"></p><label class="controller-device">Configure device<select id="controllerDevice"></select></label><p class="controller-note">Press a button on each device to reveal it. Enable each stick, throttle or set of pedals you want to fly with. Older game-port SideWinders need a compatible adapter and driver.</p><div id="controllerOptions" hidden><h3 id="controllerDeviceName"></h3><div class="controller-tools"><label><input id="controllerEnabled" type="checkbox"> Enable this controller</label><label>Layout <select id="controllerPreset"><option value="stick">Flight stick with twist</option><option value="gamepad">Standard gamepad</option><option value="six">Six-axis 3D controller</option><option value="throttle">Separate throttle</option><option value="pedals">Rudder pedals</option><option value="blank">Unassigned</option></select></label><button id="controllerApplyPreset">Apply layout</button></div><div class="controller-tuning"><label>Dead zone <input id="controllerDeadzone" type="range" min=".01" max=".3" step=".01"><output id="controllerDeadzoneValue"></output></label><label>Response curve <input id="controllerCurve" type="range" min="1" max="2.5" step=".05"><output id="controllerCurveValue"></output></label><label>Sensitivity <input id="controllerGain" type="range" min=".25" max="1.5" step=".05"><output id="controllerGainValue"></output></label></div><div class="controller-tools"><button id="controllerCenter">Capture neutral positions</button><button id="controllerCalibrate">Calibrate ranges</button><button id="controllerResetRange">Reset calibration</button></div><p class="controller-note">Release sticks and buttons before capturing neutral positions. A throttle already above idle takes effect when you move it. Settings are saved separately for each device.</p><div class="controller-tools"><label>Bind by movement <select id="controllerLearnAction"></select></label><button id="controllerLearn">Learn input</button></div><p id="controllerLearnStatus" role="status"></p><div id="controllerBindings"></div></div><p id="controllerMessage" role="status"></p></div>`;document.body.append(dialog);
      q('controllerClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{cancelCalibration();stopLearning();reset();window.Module?._astra_reset_flight_input?.();});for(const type of ['keydown','keyup'])dialog.addEventListener(type,e=>e.stopPropagation());
      q('controllerDevice').onchange=()=>{const value=q('controllerDevice').value,device=devices.get(Number(value));if(!device||value==='')return;cancelCalibration();stopLearning();currentKey=device.key;pad=null;discover();save();reset();render();};
      q('controllerEnabled').onchange=()=>{profile.enabled=q('controllerEnabled').checked;save();reset();};
      for(const [id,key] of [['Deadzone','deadzone'],['Curve','curve'],['Gain','gain']])q('controller'+id).oninput=()=>{profile[key]=Number(q('controller'+id).value);q('controller'+id+'Value').value=key==='deadzone'?Math.round(profile[key]*100)+'%':profile[key].toFixed(2);save();reset();};
      q('controllerApplyPreset').onclick=()=>{if(!pad)return;cancelCalibration();stopLearning();const enabled=profile.enabled;profile=C.preset(pad,q('controllerPreset').value);profile.enabled=enabled;devices.get(pad.index).profile=profile;save();reset();render();};
      const bindActions=[...C.axes,...C.buttons,...Object.keys(C.movement).filter(k=>!positive.includes(k))];
      for(const action of bindActions)q('controllerLearnAction').add(new Option(labels[action],action));
      q('controllerLearnAction').onchange=stopLearning;q('controllerLearn').onclick=beginLearning;
      q('controllerCenter').onclick=()=>{if(!pad)return;pad.axes.forEach((v,i)=>{if(profile.axes[i].mode!=='throttle')profile.axes[i].center=Number.isFinite(v)?v:0;});save();reset();text('controllerMessage','Neutral positions saved.');};
      q('controllerCalibrate').onclick=()=>{if(!pad)return;stopLearning();if(!calibrating){calibration=Array.from(pad.axes,v=>({min:v,max:v}));calibrating=true;}else{let n=0;calibration.forEach((range,i)=>{if(range.max-range.min>.35&&profile.axes[i].action!=='hat'){Object.assign(profile.axes[i],range);n++;}});calibrating=false;save();text('controllerMessage',n+' axis ranges calibrated. Unmoved axes kept their previous ranges.');}q('controllerCalibrate').textContent=calibrating?'Finish calibration':'Calibrate ranges';reset();};
      q('controllerResetRange').onclick=()=>{cancelCalibration();stopLearning();profile.axes.forEach(a=>Object.assign(a,{min:-1,max:1,center:a.action==='hat'?a.center:0}));save();reset();text('controllerMessage','Calibration reset.');};
    }
    window.releaseFlightMouse?.();window.Module?._astra_reset_flight_input?.();reset();lastDevices=null;dialog.showModal();discover();tick();render();
  }
  window.astraControllers={open,sample,reset,get state(){return {connected:!!pad,id:pad?.id,armed,enabled:!!profile?.enabled};}};
  q('controllerSetup')?.addEventListener('click',open);
  window.addEventListener('gamepadconnected',()=>{discover();lastDevices=null;});window.addEventListener('gamepaddisconnected',()=>{discover();lastDevices=null;});
  window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);
  setInterval(tick,100);
})();
