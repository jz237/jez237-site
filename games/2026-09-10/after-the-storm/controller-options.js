import {KEYBOARD_ACTIONS,GAMEPAD_BUTTON_ACTIONS,GAMEPAD_AXES,MAX_GAMEPAD_BUTTON,MAX_GAMEPAD_AXIS,initialControls,validateControls,rebindKeyboard,keyLabel,supportedKey,reservedKeyChord} from './control-bindings.js';

// Capture at the window before gameplay's bubbling handlers. Keep swallowing
// the matching release after a binding succeeds or Escape cancels capture.
export function createKeyCapture({target=globalThis.window,onBind,onStatus=()=>{},onCaptureChange=()=>{}}){
 let pending=null;const swallowed=new Set();
 const consume=event=>{event.preventDefault();event.stopImmediatePropagation();};
 function finish(){if(!pending)return;pending=null;onCaptureChange(false);}
 function cancel(message='Key capture cancelled.'){if(!pending)return;finish();if(message)onStatus(message);}
 function down(event){
  if(!pending&&!swallowed.size)return;consume(event);swallowed.add(event.code);
  if(!pending||event.repeat)return;
  if(event.code==='Escape'){cancel();return;}
  if(event.isComposing||reservedKeyChord(event)||!supportedKey(event.code,pending.action)){onStatus('Choose one physical key. Browser shortcuts, Alt, Windows and function keys are reserved. Escape cancels.');return;}
  try{onBind(pending.player,pending.action,event.code);finish();}catch(error){onStatus(error.message+' Choose another key, or Escape to cancel.');}
 }
 function up(event){if(!pending&&!swallowed.has(event.code))return;consume(event);swallowed.delete(event.code);}
 function blur(){cancel('Key capture cancelled when the window lost focus.');swallowed.clear();}
 target.addEventListener('keydown',down,true);target.addEventListener('keyup',up,true);target.addEventListener('blur',blur);
 return {
  begin(player,action){if(![0,1].includes(player)||!KEYBOARD_ACTIONS.some(a=>a[0]===action))throw Error('Unknown player or keyboard action.');pending={player,action};onCaptureChange(true);onStatus('Player '+(player+1)+' '+KEYBOARD_ACTIONS.find(a=>a[0]===action)[1].toLowerCase()+': press one key. Escape cancels.');},
  cancel,
  get binding(){return pending?{...pending}:null;},
  get capturing(){return !!pending;},
  dispose(){cancel('');target.removeEventListener('keydown',down,true);target.removeEventListener('keyup',up,true);target.removeEventListener('blur',blur);swallowed.clear();}
 };
}

const standardButtonNames=['Bottom face / A','Right face / B','Left face / X','Top face / Y','Left shoulder / LB','Right shoulder / RB','Left trigger / LT','Right trigger / RT','Back / Select','Start / Menu','Left stick press','Right stick press','D-pad up','D-pad down','D-pad left','D-pad right','Home / Guide'];
export function mountControllerOptions(dialog,{getControls=()=>null,setControls,onStatus=()=>{},onCaptureChange=()=>{}}){
 const section=document.createElement('section');section.className='controller-options';
 const element=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node;};
 section.append(element('h3','Controls'));
 section.append(element('p','Choose a player to change physical keyboard keys, gamepad buttons or stick axes. A connected controller is not required. Escape always pauses and cancels key capture.'));
 const playerLabel=element('label','Player '),playerSelect=element('select');playerSelect.setAttribute('aria-label','Player controls');
 for(let i=0;i<2;i++){const option=element('option','Player '+(i+1));option.value=String(i);playerSelect.append(option);}playerLabel.append(playerSelect);section.append(playerLabel);
 const keyboardHeading=element('h4','Keyboard'),keyboardGrid=element('div');keyboardGrid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px';section.append(keyboardHeading,keyboardGrid);
 const padHeading=element('h4','Gamepad'),padGrid=element('div');padGrid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px';section.append(padHeading,padGrid);
 const axisGrid=element('div');axisGrid.style.cssText='display:flex;flex-wrap:wrap;gap:18px;margin-top:16px';section.append(axisGrid);
 const deadzoneLabel=element('label','Joystick deadzone '),deadzone=element('input'),deadzoneValue=element('output');deadzone.type='range';deadzone.min='0';deadzone.max='35';deadzone.step='1';deadzone.setAttribute('aria-label','Joystick deadzone percent');deadzone.style.verticalAlign='middle';deadzoneLabel.append(deadzone,deadzoneValue);section.append(deadzoneLabel);
 section.append(element('p','Deadzone defaults to 5%. Increase it if a resting stick drifts. Trim and steering retain their own axes and inversion. Stunt buttons require the modifier; camera changes are suppressed while it is held.'));
 const resetPlayer=element('button',"Restore this player's defaults"),resetAll=element('button','Restore all control defaults'),status=element('p');resetPlayer.type=resetAll.type='button';status.setAttribute('role','status');section.append(resetPlayer,resetAll,status);dialog.append(section);
 let player=0,disposed=false;
 const keyboardButtons=new Map(),buttonSelects=new Map(),axisSelects=new Map(),axisInverts=new Map();
 const report=message=>{status.textContent=message;onStatus(message);};
 const current=()=>validateControls(getControls());
 function save(next,message){const clean=validateControls(next),persisted=setControls(clean);render();report(persisted===false?'Storage unavailable; these controls apply for this session.':message);}
 function edit(change,message){try{const next=current();change(next.players[player]);save(next,message);}catch(error){render();report(error.message);}}
 const capture=createKeyCapture({onBind:(p,action,code)=>save(rebindKeyboard(getControls(),p,action,code),'Player '+(p+1)+' '+KEYBOARD_ACTIONS.find(a=>a[0]===action)[1].toLowerCase()+' set to '+keyLabel(code)+'.'),onStatus:report,onCaptureChange:active=>{onCaptureChange(active);render();}});
 for(const [action,label] of KEYBOARD_ACTIONS){
  const row=element('div'),name=element('span',label+' '),button=element('button');button.type='button';button.dataset.controlAction=action;
  button.onclick=()=>capture.begin(player,action);row.append(name,button);keyboardGrid.append(row);keyboardButtons.set(action,button);
 }
 function indexSelect(max,kind){const select=element('select'),unassigned=element('option','Unassigned');unassigned.value='';select.append(unassigned);for(let i=0;i<=max;i++){const option=element('option',kind==='button'?'Button '+i+(standardButtonNames[i]?' · '+standardButtonNames[i]:''):'Axis '+i+(i<4?' · '+['left horizontal','left vertical','right horizontal','right vertical'][i]:''));option.value=String(i);select.append(option);}return select;}
 const selectedIndex=select=>select.value===''?null:Number(select.value);
 for(const [action,label] of GAMEPAD_BUTTON_ACTIONS){
  const row=element('label',label+' '),select=indexSelect(MAX_GAMEPAD_BUTTON,'button');row.style.display='grid';select.onchange=()=>edit(p=>p.gamepad.buttons[action]=selectedIndex(select),'Gamepad button saved.');row.append(select);padGrid.append(row);buttonSelects.set(action,select);
 }
 for(const [action,label] of GAMEPAD_AXES){
  const row=element('div'),name=element('label',label+' '),select=indexSelect(MAX_GAMEPAD_AXIS,'axis'),invertLabel=element('label',' Invert '),invert=element('input');invert.type='checkbox';name.append(select);invertLabel.append(invert);row.append(name,invertLabel);axisGrid.append(row);
  const change=()=>edit(p=>p.gamepad.axes[action]={index:selectedIndex(select),invert:invert.checked},'Gamepad axis saved.');select.onchange=invert.onchange=change;axisSelects.set(action,select);axisInverts.set(action,invert);
 }
 function render(){
  if(disposed)return;const prefs=current().players[player];playerSelect.value=String(player);
  for(const [action,label] of KEYBOARD_ACTIONS){const button=keyboardButtons.get(action);if(!button)continue;button.textContent=capture.binding?.player===player&&capture.binding.action===action?'Press a key…':keyLabel(prefs.keyboard[action]);button.setAttribute('aria-label','Player '+(player+1)+' '+label.toLowerCase()+': '+keyLabel(prefs.keyboard[action])+'. Click to rebind.');}
  for(const [action,select] of buttonSelects){select.value=prefs.gamepad.buttons[action]??'';select.setAttribute('aria-label','Player '+(player+1)+' gamepad '+GAMEPAD_BUTTON_ACTIONS.find(a=>a[0]===action)[1].toLowerCase());}
  for(const [action,select] of axisSelects){select.value=prefs.gamepad.axes[action].index??'';select.setAttribute('aria-label','Player '+(player+1)+' '+action+' axis');axisInverts.get(action).checked=prefs.gamepad.axes[action].invert;axisInverts.get(action).setAttribute('aria-label','Invert Player '+(player+1)+' '+action+' axis');}
  deadzone.value=String(Math.round(prefs.gamepad.deadzone*100));deadzoneValue.value=deadzone.value+'%';deadzoneValue.textContent=deadzoneValue.value;
 }
 playerSelect.onchange=()=>{capture.cancel('');player=Number(playerSelect.value);render();report('Editing Player '+(player+1)+' controls.');};
 deadzone.oninput=()=>{deadzoneValue.value=deadzone.value+'%';deadzoneValue.textContent=deadzoneValue.value;};deadzone.onchange=()=>edit(p=>p.gamepad.deadzone=Number(deadzone.value)/100,'Joystick deadzone saved.');
 resetPlayer.onclick=()=>{capture.cancel('');edit((p)=>Object.assign(p,initialControls().players[player]),'Player '+(player+1)+' default controls restored.');};
 resetAll.onclick=()=>{capture.cancel('');try{save(initialControls(),'Default controls restored for both players.');}catch(error){report(error.message);}};
 const closed=()=>capture.cancel('');dialog.addEventListener('close',closed);render();
 return {refresh(){capture.cancel('');render();},get capturing(){return capture.capturing;},dispose(){disposed=true;capture.dispose();dialog.removeEventListener('close',closed);section.remove();}};
}
