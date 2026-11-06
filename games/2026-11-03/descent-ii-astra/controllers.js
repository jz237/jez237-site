/* Hot-plug setup and per-device profiles; native controls own flight and weapons. */
(()=>{
  'use strict';const C=AstraControllerCore,store='astra.controllers.v1';
  let saved={profiles:{},selected:''};try{const v=JSON.parse(localStorage.getItem(store));if(v&&typeof v==='object')saved={profiles:v.profiles||{},selected:v.selected||''};}catch{}
  let pad=null,profile=null,currentKey='',armed=false,last={},dialog=null,calibrating=false,calibration=null,lastDevices=null,sessionDevice=-1;
  const empty=()=>Array(24).fill(0),safePads=()=>{try{return Array.from(navigator.getGamepads?.()||[]).filter(p=>p&&p.connected);}catch{return [];}};
  const labels={none:'Unassigned',pitch:'Pitch · pull back to climb',yaw:'Turn left / right',roll:'Roll left / right',slide:'Slide left / right',lift:'Slide up / down',thrust:'Forward / reverse',hat:'POV hat · slide',primary:'Fire primary',secondary:'Fire missile',afterburner:'Afterburner',rear:'Rear view',transfer:'Energy → shields',flare:'Fire flare',bomb:'Drop bomb',cyclePrimary:'Next primary',cycleSecondary:'Next missile',headlight:'Headlight',automap:'Automap',toggleBomb:'Switch bomb type',pause:'Flight menu',pitchUp:'Pitch up',pitchDown:'Pitch down',yawLeft:'Turn left',yawRight:'Turn right',rollLeft:'Roll left',rollRight:'Roll right',slideLeft:'Slide left',slideRight:'Slide right',up:'Slide up',down:'Slide down',forward:'Forward thrust',reverse:'Reverse thrust'};
  const q=id=>document.getElementById(id),text=(id,value)=>{const el=q(id);if(el&&el.textContent!==value)el.textContent=value;};
  function save(){if(currentKey&&profile)saved.profiles[currentKey]=profile;saved.selected=currentKey||saved.selected;try{localStorage.setItem(store,JSON.stringify(saved));}catch{text('controllerMessage','Settings could not be saved in this browser.');}}
  function reset(){armed=false;last={};}
  function cancelCalibration(){calibrating=false;calibration=null;if(q('controllerCalibrate'))q('controllerCalibrate').textContent='Calibrate ranges';}
  function discover(){
    const pads=safePads();let found=pads.find(p=>C.key(p)===(currentKey||saved.selected));
    if(!found&&!currentKey&&!saved.selected)found=pads[0];
    if(!found){if(pad){reset();cancelCalibration();}pad=null;sessionDevice=-1;return pads;}
    const key=C.key(found);if(key!==currentKey||sessionDevice!==found.index||!pad){currentKey=key;profile=C.sanitize(found,saved.profiles[key]);sessionDevice=found.index;reset();}
    pad=found;return pads;
  }
  function active(){const m=window.Module;return !!m&&typeof flightActive!=='undefined'&&flightActive&&!m.autopilot&&!m.demo&&!window.astraPreview?.active&&!document.hidden&&document.hasFocus()&&!document.body.classList.contains('native-open')&&!dialog?.open&&!calibrating;}
  function sample(){
    discover();const out=empty();if(!active()||!pad||!profile?.enabled){reset();return out;}
    const state=C.read(pad,profile);
    if(!armed){if(state.motion.every(v=>Math.abs(v)<.035)&&!Object.values(state.held).some(Boolean))armed=true;else return out;}
    for(let i=0;i<6;i++)out[i]=state.motion[i];
    for(let i=0;i<C.buttons.length;i++){const key=C.buttons[i],down=state.held[key];out[6+i]=i<5?+down:+(down&&!last[key]);}
    if(out[18]){window.releaseFlightMouse?.();window.Module.menuCommand=1;reset();return empty();}
    last=state.held;return out;
  }
  function select(options,value,change){const el=document.createElement('select');for(const [v,label] of options){const option=document.createElement('option');option.value=v;option.textContent=label;el.append(option);}el.value=value;el.onchange=()=>change(el.value);return el;}
  function render(){
    if(!dialog?.open)return;const host=q('controllerBindings');host.replaceChildren();
    if(!pad||!profile){q('controllerOptions').hidden=true;return;}q('controllerOptions').hidden=false;
    q('controllerEnabled').checked=profile.enabled;q('controllerDeadzone').value=profile.deadzone;q('controllerCurve').value=profile.curve;q('controllerGain').value=profile.gain;
    for(const [id,key] of [['Deadzone','deadzone'],['Curve','curve'],['Gain','gain']])q('controller'+id+'Value').value=key==='deadzone'?Math.round(profile[key]*100)+'%':profile[key].toFixed(2);
    text('controllerDeviceName',pad.id);
    const axes=document.createElement('section');axes.innerHTML='<h3>Axes</h3><p>Move each control to identify it. For a single POV axis, select “POV hat” and capture its neutral position.</p>';
    profile.axes.forEach((a,i)=>{const row=document.createElement('div');row.className='controller-axis';const label=document.createElement('label');label.textContent='Axis '+(i+1);const meter=document.createElement('meter');meter.id='controllerAxis'+i;meter.min=-1;meter.max=1;meter.low=-.1;meter.high=.1;meter.optimum=0;label.append(meter);row.append(label);
      const action=select(['none',...C.axes,'hat'].map(n=>[n,labels[n]]),a.action,v=>{a.action=v;if(v==='hat'){a.mode='hat';a.center=pad.axes[i];}else if(a.mode==='hat'){a.mode='centered';a.center=0;}save();reset();render();});action.setAttribute('aria-label','Axis '+(i+1)+' action');row.append(action);
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
      pads.forEach(p=>{const option=document.createElement('option');option.value=String(p.index);option.textContent=p.id;device.append(option);});device.value=pad?String(pad.index):'';render();}
    text('controllerStatus',!navigator.getGamepads?'This browser does not expose joystick input.':!pad?'Plug in your controller, then press a button while this page is focused.':calibrating?'Move every stick, twist, slider and pedal through its full range, then finish calibration.':`${pad.axes.length} axes · ${pad.buttons.length} buttons · ${profile.enabled?'Enabled':'Disabled'}`);
    if(!pad)return;
    if(calibrating)pad.axes.forEach((v,i)=>{if(profile.axes[i]?.action!=='hat'&&Number.isFinite(v)&&Math.abs(v)<=1.1){calibration[i].min=Math.min(calibration[i].min,v);calibration[i].max=Math.max(calibration[i].max,v);}});
    pad.axes.forEach((v,i)=>{const meter=q('controllerAxis'+i);if(meter){meter.value=C.clamp(v);meter.title=Number.isFinite(v)?v.toFixed(3):'Unavailable';}});
    pad.buttons.forEach((b,i)=>q('controllerButton'+i)?.classList.toggle('pressed',!!b.pressed||(b.value||0)>.5));
  }
  function open(){
    if(!dialog){dialog=document.createElement('dialog');dialog.id='controllerDialog';dialog.innerHTML=`<div class="controller-shell"><header><div><small>FLIGHT HARDWARE</small><h2>Joysticks &amp; controllers</h2></div><button id="controllerClose" aria-label="Close controller setup">Close ×</button></header><p id="controllerStatus" role="status"></p><label class="controller-device">CONTROLLER<select id="controllerDevice"></select></label><p class="controller-note">Your computer and browser must recognize the device. Press a button to reveal it. Older game-port SideWinders need a compatible adapter and driver. Force feedback is not available here.</p><div id="controllerOptions" hidden><h3 id="controllerDeviceName"></h3><div class="controller-tools"><label><input id="controllerEnabled" type="checkbox"> Enable this controller</label><button id="controllerStick">Flight-stick preset</button><button id="controllerGamepad">Gamepad preset</button></div><div class="controller-tuning"><label>Dead zone <input id="controllerDeadzone" type="range" min=".01" max=".3" step=".01"><output id="controllerDeadzoneValue"></output></label><label>Response curve <input id="controllerCurve" type="range" min="1" max="2.5" step=".05"><output id="controllerCurveValue"></output></label><label>Sensitivity <input id="controllerGain" type="range" min=".25" max="1.5" step=".05"><output id="controllerGainValue"></output></label></div><div class="controller-tools"><button id="controllerCenter">Capture neutral positions</button><button id="controllerCalibrate">Calibrate ranges</button><button id="controllerResetRange">Reset calibration</button></div><p class="controller-note">Release sticks and buttons before capturing neutral positions. Use the throttle range for sliders; move it to idle before flying. Setup pauses controller input. Settings are saved separately for each device.</p><div id="controllerBindings"></div></div><p id="controllerMessage" role="status"></p></div>`;document.body.append(dialog);
      q('controllerClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{cancelCalibration();reset();window.Module?._astra_reset_flight_input?.();});for(const type of ['keydown','keyup'])dialog.addEventListener(type,e=>e.stopPropagation());
      q('controllerDevice').onchange=()=>{const p=safePads().find(p=>p.index===Number(q('controllerDevice').value));if(!p||q('controllerDevice').value==='')return;cancelCalibration();currentKey=C.key(p);saved.selected=currentKey;pad=null;discover();save();reset();render();};
      q('controllerEnabled').onchange=()=>{profile.enabled=q('controllerEnabled').checked;save();reset();};
      for(const [id,key] of [['Deadzone','deadzone'],['Curve','curve'],['Gain','gain']])q('controller'+id).oninput=()=>{profile[key]=Number(q('controller'+id).value);q('controller'+id+'Value').value=key==='deadzone'?Math.round(profile[key]*100)+'%':profile[key].toFixed(2);save();reset();};
      for(const [id,kind] of [['Stick','stick'],['Gamepad','gamepad']])q('controller'+id).onclick=()=>{if(!pad)return;cancelCalibration();profile=C.preset(pad,kind);save();reset();render();};
      q('controllerCenter').onclick=()=>{if(!pad)return;pad.axes.forEach((v,i)=>{if(profile.axes[i].mode!=='throttle')profile.axes[i].center=Number.isFinite(v)?v:0;});save();reset();text('controllerMessage','Neutral positions saved.');};
      q('controllerCalibrate').onclick=()=>{if(!pad)return;if(!calibrating){calibration=pad.axes.map(v=>({min:v,max:v}));calibrating=true;}else{let n=0;calibration.forEach((range,i)=>{if(range.max-range.min>.35&&profile.axes[i].action!=='hat'){Object.assign(profile.axes[i],range);n++;}});calibrating=false;save();text('controllerMessage',n+' axis ranges calibrated. Unmoved axes kept their previous ranges.');}q('controllerCalibrate').textContent=calibrating?'Finish calibration':'Calibrate ranges';reset();};
      q('controllerResetRange').onclick=()=>{cancelCalibration();profile.axes.forEach(a=>Object.assign(a,{min:-1,max:1,center:a.action==='hat'?3.2857:0}));save();reset();text('controllerMessage','Calibration reset.');};
    }
    window.releaseFlightMouse?.();window.Module?._astra_reset_flight_input?.();reset();lastDevices=null;dialog.showModal();discover();tick();render();
  }
  window.astraControllers={open,sample,reset,get state(){return {connected:!!pad,id:pad?.id,armed,enabled:!!profile?.enabled};}};
  q('controllerSetup')?.addEventListener('click',open);
  window.addEventListener('gamepadconnected',()=>{discover();lastDevices=null;});window.addEventListener('gamepaddisconnected',()=>{discover();reset();lastDevices=null;});
  window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);
  setInterval(tick,100);
})();
