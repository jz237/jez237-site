import {NATIVE_TUNE_KEYS,nativeMenuTune,effectiveNativeTune} from './native-rider-tuning.js';

export function createNativeTuningView({document,saved,getSelection,onChange}){
 const panels=[0,1].map(player=>{
  const modern=document.getElementById(player?'secondEngine':'engine').closest('.settings');
  const panel=document.createElement('fieldset'),legend=document.createElement('legend');
  panel.hidden=true;panel.id=`nativeTuning${player}`;legend.textContent=`Player ${player+1} · original tuning`;
  const modeLabel=document.createElement('label'),mode=document.createElement('select');
  mode.id=`nativeTuneMode${player}`;mode.setAttribute('aria-label',`Player ${player+1} tuning mode`);
  for(const name of ['Normal','Custom']){const option=document.createElement('option');option.value=name.toLowerCase();option.textContent=name;mode.append(option);}
  modeLabel.append('Setup ',mode);
  mode.onchange=()=>{saved.nativeTuneModes[player]=mode.value;refresh();onChange();};
  const controls=document.createElement('div');controls.className='settings';
  const inputs=NATIVE_TUNE_KEYS.map((key,trait)=>{
   const label=document.createElement('label'),input=document.createElement('input'),output=document.createElement('output');
   const name=['Handling','Engine','Grip'][trait];
   input.type='range';input.min='0';input.max='11';input.step='1';input.id=`nativeTune${player}${trait}`;
   input.setAttribute('aria-label',`Player ${player+1} original ${name.toLowerCase()}`);output.htmlFor=input.id;
   label.append(name,input,output);controls.append(label);
   input.addEventListener('input',()=>{
    const selection=getSelection();if(!selection.active||saved.nativeTuneModes[player]!=='custom')return;
    saved.nativeSettings[player][selection.riders[player]][key]=Number(input.value);refresh();onChange();
   });
   return {input,output,key};
  });
  const status=document.createElement('p'),reset=document.createElement('button');reset.type='button';reset.textContent=`Reset Player ${player+1} tuning`;
  reset.onclick=()=>{if(saved.nativeTuneModes[player]!=='custom')return;const selection=getSelection();saved.nativeSettings[player][selection.riders[player]]=nativeMenuTune();refresh();onChange();};
  panel.append(legend,modeLabel,controls,status,reset);modern.after(panel);
  return {panel,modern,inputs,status,mode,reset};
 });
 function refresh(){
  const selection=getSelection();
  panels.forEach(({panel,modern,inputs,status,mode,reset},player)=>{
   panel.hidden=!selection.active||player>=selection.players;modern.hidden=selection.active;modern.style.display=selection.active?'none':'';
   mode.value=saved.nativeTuneModes[player];const custom=mode.value==='custom',tune=effectiveNativeTune(saved.nativeSettings[player][selection.riders[player]],mode.value);
   reset.disabled=!custom;
   for(const {input,output,key}of inputs){input.disabled=!custom;input.value=String(tune[key]);output.value=`${tune[key]+1} / 12`;input.setAttribute('aria-valuetext',`Position ${tune[key]+1} of 12`);}
   status.textContent=custom?'Custom · twelve positions per control. Records are marked Custom, including at the default position 6.':'Normal · factory settings. Your custom setup is kept for later.';
  });
 }
 refresh();return Object.freeze({refresh});
}
