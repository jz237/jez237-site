import {NATIVE_TUNE_KEYS,nativeMenuTune,nativeTuneIsCustom} from './native-rider-tuning.js';

export function createNativeTuningView({document,saved,getSelection,onChange}){
 const panels=[0,1].map(player=>{
  const modern=document.getElementById(player?'secondEngine':'engine').closest('.settings');
  const panel=document.createElement('fieldset'),legend=document.createElement('legend');
  panel.hidden=true;panel.id=`nativeTuning${player}`;legend.textContent=`Player ${player+1} · original tuning`;
  const controls=document.createElement('div');controls.className='settings';
  const inputs=NATIVE_TUNE_KEYS.map((key,trait)=>{
   const label=document.createElement('label'),input=document.createElement('input'),output=document.createElement('output');
   const name=['Handling','Engine','Grip'][trait];
   input.type='range';input.min='0';input.max='11';input.step='1';input.id=`nativeTune${player}${trait}`;
   input.setAttribute('aria-label',`Player ${player+1} original ${name.toLowerCase()}`);output.htmlFor=input.id;
   label.append(name,input,output);controls.append(label);
   input.addEventListener('input',()=>{
    const selection=getSelection();if(!selection.active)return;
    saved.nativeSettings[player][selection.riders[player]][key]=Number(input.value);refresh();onChange();
   });
   return {input,output,key};
  });
  const status=document.createElement('p'),reset=document.createElement('button');reset.type='button';reset.textContent=`Reset Player ${player+1} tuning`;
  reset.onclick=()=>{const selection=getSelection();saved.nativeSettings[player][selection.riders[player]]=nativeMenuTune();refresh();onChange();};
  panel.append(legend,controls,status,reset);modern.after(panel);
  return {panel,modern,inputs,status};
 });
 function refresh(){
  const selection=getSelection();
  panels.forEach(({panel,modern,inputs,status},player)=>{
   panel.hidden=!selection.active||player>=selection.players;modern.hidden=selection.active;modern.style.display=selection.active?'none':'';
   const tune=saved.nativeSettings[player][selection.riders[player]];
   for(const {input,output,key}of inputs){input.value=String(tune[key]);output.value=`${tune[key]+1} / 12`;input.setAttribute('aria-valuetext',`Position ${tune[key]+1} of 12`);}
   // Web policy: all three default positions earn Standard; any change earns
   // Custom. This does not emulate the original Normal/Custom menu toggle.
   status.textContent=(nativeTuneIsCustom(tune)?'Custom':'Standard')+' · twelve positions per control. Standard is position 6.';
  });
 }
 refresh();return Object.freeze({refresh});
}
