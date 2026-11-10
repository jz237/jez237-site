import {calculators,categories,defaults,calculate,convert,usUnit,GAL,migrateInputs,isVisible,labelFor,helpFor,popular,sgFromPpt,pptFromSg,PROFILE_DEFAULT,convertHardness} from './calculators.mjs';
import {icon,illustration,escape as e} from './illustrations.mjs';
import {sliderWindow,sliderValue} from './sliders.mjs';
import {fieldChoices,extraHelp,bagComparison,formPresets} from './presets.mjs';
import {formulaFor,noteFor,descriptionFor} from './us-copy.mjs';
import {isFirstExample} from './legacy.mjs';
const $=id=>document.getElementById(id);
const KEY='aquarium-toolbox-v1';
const ids=new Set(calculators.map(c=>c.id));
const hasProfile=c=>c.fields.some(f=>f.profile);
const fresh=()=>({version:1,units:'us',salinity:'sg',examples:2,current:'tank',favorites:[],inputs:{},profiles:[{id:'default',name:'My aquarium',volume:PROFILE_DEFAULT.us,type:'freshwater'}],activeProfile:'default'});
export function validateBackup(raw){
  if(!raw||raw.version!==1||!['us','metric'].includes(raw.units)||!Array.isArray(raw.profiles)||raw.profiles.length<1||raw.profiles.length>20)throw new Error('This is not a supported Aquarium Toolbox backup.');
  const result=fresh();result.units=raw.units;result.current=ids.has(raw.current)?raw.current:'tank';
  result.salinity=['sg','ppt'].includes(raw.salinity)?raw.salinity:'sg';
  result.profiles=raw.profiles.map(p=>{if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>60||typeof p.volume!=='number'||!Number.isFinite(p.volume)||p.volume<.01||p.volume>1e7||!['freshwater','planted','reef'].includes(p.type))throw new Error('The backup contains an invalid tank.');return {id:p.id,name:p.name.trim(),volume:p.volume,type:p.type};});
  if(new Set(result.profiles.map(p=>p.id)).size!==result.profiles.length)throw new Error('The backup contains duplicate tanks.');
  result.activeProfile=result.profiles.some(p=>p.id===raw.activeProfile)?raw.activeProfile:result.profiles[0].id;
  result.favorites=Array.isArray(raw.favorites)?[...new Set(raw.favorites.filter(id=>ids.has(id)))]:[];
  // Settings saved by the first preview began from metric examples. In US units
  // an untouched example (and the untouched starter tank) is replaced by the
  // friendlier one; everything the visitor entered is kept as saved.
  const upgrade=raw.examples!==2&&raw.units==='us';
  const starter=result.profiles.length===1&&result.profiles[0].id==='default'&&result.profiles[0].name==='My aquarium'&&result.profiles[0].volume===100;
  if(upgrade&&starter)result.profiles[0].volume=PROFILE_DEFAULT.us;
  for(const calc of calculators){
    const saved=raw.inputs?.[calc.id];
    if(upgrade&&isFirstExample(calc.id,saved,hasProfile(calc)?['v']:[])){
      if(hasProfile(calc)&&!(starter&&saved.v===100)){const v=defaults(calc,true);v.v=saved.v;if(typeof v.v==='number'&&Number.isFinite(v.v)&&v.v>=.01&&v.v<=1e7)result.inputs[calc.id]=v;}
      continue;
    }
    const a=migrateInputs(calc.id,saved);if(a){const v={};for(const f of calc.fields){const x=a[f.key];if(f.options){if(!f.options.some(o=>o[0]===x))throw new Error('The backup contains an invalid selection.');}else if(typeof x!=='number'||!Number.isFinite(x)||x<f.min||x>f.max)throw new Error('The backup contains an invalid number.');v[f.key]=x;}result.inputs[calc.id]=v;}
  }
  return result;
}
let state=fresh(),storageAvailable=true;
try{const saved=localStorage.getItem(KEY);if(saved)state=validateBackup(JSON.parse(saved));}catch{storageAvailable=false;}
let category='popular',query='',result=null,toastTimer,resultObserver;
let inputVisible=false,resultVisible=false;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function snapshot(){const clean={...state,inputs:{}};for(const [id,a]of Object.entries(state.inputs)){try{calculate(id,a);clean.inputs[id]={...a};}catch{/* Incomplete edits must not corrupt otherwise valid tank backups. */}}return clean;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()));storageAvailable=true;}catch{storageAvailable=false;toast('Browser storage is unavailable. Download a backup to keep your settings.');}}
const current=()=>calculators.find(c=>c.id===state.current);
const profile=()=>state.profiles.find(p=>p.id===state.activeProfile)||state.profiles[0];
const isUS=()=>state.units==='us';
// Salinity is saved in ppt and can be shown as specific gravity instead.
const asSG=unit=>unit==='ppt'&&state.salinity==='sg';
const unitOf=field=>field.displayUnit||field.unit;
const toDisplay=(value,unit)=>asSG(unit)?sgFromPpt(value):isUS()?convert(value,unit,true):value;
const fromDisplay=(value,unit)=>asSG(unit)?pptFromSg(value):isUS()?convert(value,unit,false):value;
// Hobby test kits read in ppm; for aquarium water it is the same as mg/L.
const plain=unit=>String(unit).replaceAll('mg/L','ppm');
function unitLabel(calc,field,a){
  if(asSG(field.unit))return 'SG';
  if(field.unit===''){
    if(calc.id==='label'&&field.key==='dose')return a.unit;
    if(calc.id==='mix')return plain(a.measure);
    if(['supplement','consumption'].includes(calc.id))return plain(a.parameter);
    if(calc.id==='hardness')return a.unit==='degree'?(a.kind==='alk'?'dKH':'dGH'):a.unit==='ppm'?'ppm':'meq/L';
  }
  return plain(isUS()?usUnit(unitOf(field)):field.unit);
}
function inputs(calc=current()){if(!state.inputs[calc.id]){state.inputs[calc.id]=defaults(calc,isUS());if(hasProfile(calc))state.inputs[calc.id].v=profile().volume;}return state.inputs[calc.id];}
function format(v,digits=2){if(v!==0&&Math.abs(v)<.0001)return v.toExponential(3);const size=Math.abs(v);return v.toLocaleString('en-US',{maximumFractionDigits:size<.01?5:size<.1?4:size>=100?0:size>=10?Math.min(digits,1):digits});}
const money=v=>v.toLocaleString('en-US',{minimumFractionDigits:Number.isInteger(v)?0:2,maximumFractionDigits:2});
function inputNumber(value,unit){if(!Number.isFinite(value))return '';if(asSG(unit))return Number(value.toFixed(4));return Number(value.toFixed(usUnit(unit)!==unit?(Math.abs(value)<.001?9:3):6));}
// Whole gallons for larger amounts; one decimal below ten, where a rounded
// gallon would be a large share of a small tank or water change.
function gallons(l){const g=l/GAL;if(g===0)return '0';if(g<.05)return '<0.1';return g<9.95?format(Math.round(g*10)/10,1):format(Math.round(g),0);}
const sgText=ppt=>sgFromPpt(ppt).toFixed(4).replace(/0$/,'');
function quarters(x){const q=Math.round(x*4),whole=Math.floor(q/4),part=['','¼','½','¾'][q%4];return q===0?'':`${whole||''}${part}`||'0';}
function smallVolume(l){const cups=l/(GAL/16);if(cups<.125)return '';const text=cups<4?quarters(cups):quarters(cups/4);return text?`about ${text} ${cups<4?(text==='1'||/^[¼½¾]$/.test(text)?'cup':'cups'):(text==='1'?'quart':'quarts')}`:'';}
function spoons(ml){if(!(ml>0))return '';if(ml<1.25)return 'use a graduated syringe; drop sizes vary';const tsp=ml/4.92892;if(tsp<3)return `about ${quarters(tsp)} tsp`;const tbsp=ml/14.7868;if(tbsp<8)return `about ${quarters(tbsp)} tbsp`;return `about ${quarters(ml/236.588)} cups`;}
function duration(v,unit){
  if(!(v>0))return '';
  const hm=h=>{const total=Math.round(h*60),hours=Math.floor(total/60),min=total%60;return min?`${hours} h ${min} min`:`${hours} h`;};
  if(unit==='seconds')return v>=90?`${Math.floor(Math.round(v)/60)} min ${Math.round(v)%60} s`:'';
  if(unit==='minutes')return v>=60?hm(v/60):v<1?v*60<1?'less than 1 second':`${Math.round(v*60)} seconds`:'';
  if(unit==='hours')return v<1?v*60<1?'less than 1 minute':`${Math.round(v*60)} minutes`:v>=48?`about ${format(v/24,1)} days`:Number.isInteger(v)?'':hm(v);
  if(unit==='days')return v>=60?`about ${format(v/30.4375,1)} months`:v>=14?`about ${format(v/7,1)} weeks`:v<1?`about ${format(v*24,1)} hours`:'';
  return '';
}
// One description of a result in the visitor's units: main value, unit and the
// smaller explanatory line. Used by the cards, the summary bar and the diagram label.
function metricParts(m){
  let value=m.value,unit=m.unit;const extra=[],conversionUnit=m.displayUnit||m.unit,us=isUS();
  if(m.unit==='L'){
    if(us){value=gallons(m.value);unit='US gal';const small=m.value/GAL<1?smallVolume(m.value):'';if(small)extra.push(small);extra.push(m.value<.1?`${format(m.value*1000,0)} mL`:`${format(m.value)} litres`);}
    else extra.push(`${gallons(m.value)} US gal`);
    if(m.bucket){const buckets=us?m.value/GAL/5:m.value/10;if(buckets>=.5)extra.push(`about ${format(buckets,1)} ${us?'five-gallon':'10-litre'} ${format(buckets,1)==='1'?'bucket':'buckets'}`);}
  }
  else if(m.unit==='L/h'){if(us){value=m.value/GAL;unit='US GPH';extra.push(`${format(m.value)} L/h`);}else extra.push(`${format(m.value/GAL)} US GPH`);}
  else if(m.unit==='ppt'&&!m.raw){if(state.salinity==='sg'){value=sgText(m.value);unit='SG';extra.push(`${format(m.value,1)} ppt`);}else extra.push(`SG ${sgText(m.value)}`);}
  else if(usUnit(conversionUnit)!==conversionUnit){const other=convert(m.value,conversionUnit,true);if(us){value=other;unit=usUnit(conversionUnit);if(conversionUnit==='bulk-g'&&other>0&&other<3)extra.push(`about ${format(other*16,0)} oz`);extra.push(`${format(m.value)} ${m.unit}`);}else extra.push(`${format(other)} ${usUnit(conversionUnit)}`);}
  else {const time=duration(m.value,m.unit);if(time)extra.push(time);}
  if(m.kitchen){const spoon=spoons(m.value);if(spoon)extra.push(spoon);}
  if(m.note)extra.push(m.note);
  const text=unit==='$'?money(value):unit==='SG'&&typeof value==='number'?value.toFixed(4).replace(/0$/,''):typeof value==='number'?format(value,m.digits??2):value;
  return {text,unit:plain(unit),extra:extra.join(' · ')};
}
function displayMetric(m){
  const p=metricParts(m);
  if(p.unit==='$')return `<span class="currency">$</span>${e(p.text)}|${e(p.extra)}`;
  return `${e(p.text)}<span class="unit">${e(p.unit)}</span>|${e(p.extra)}`;
}
function renderPreferences(){
  $('profile-select').innerHTML=state.profiles.map(p=>`<option value="${e(p.id)}" ${p.id===state.activeProfile?'selected':''}>${e(p.name)} · ${isUS()?e(gallons(p.volume))+' US gal':format(p.volume)+' L'}</option>`).join('');
  $('unit-us').setAttribute('aria-pressed',String(isUS()));$('unit-metric').setAttribute('aria-pressed',String(state.units==='metric'));
}
const members=id=>id==='all'?calculators:id==='popular'?popular.map(p=>calculators.find(c=>c.id===p)):id==='favorites'?calculators.filter(c=>state.favorites.includes(c.id)):calculators.filter(c=>c.category===id);
// A tool opened from a link, a search result or “related” may not be in the open
// list. Switch to its own category so the library always shows where you are.
function showListFor(id){if(!members(category).some(c=>c.id===id))category=calculators.find(c=>c.id===id).category;}
function renderLibrary(){
  const opts=[['popular','Most used','home'],['all','All calculators','grid'],...categories,['favorites','Favorites','star']];
  $('categories').innerHTML=opts.map(([id,label,img])=>`<button class="category" data-category="${id}" aria-pressed="${id===category}">${icon(img)}<span>${e(label)}</span><span class="count">${members(id).length}</span></button>`).join('');
  // Searching always looks through every calculator, whichever list is open.
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const text=c=>[c.title,c.description,categories.find(x=>x[0]===c.category)[1],c.keywords,...c.fields.map(f=>f.label)].join(' ').toLowerCase();
  const matches=words.length?calculators.filter(c=>words.every(w=>text(c).includes(w))):members(category);
  $('tool-list').innerHTML=matches.map(c=>`<a class="tool-link" href="#tool=${c.id}" data-tool="${c.id}" aria-current="${c.id===state.current}">${e(c.title)}${c.advanced?' <em class="tool-tag">Advanced</em>':''}<span>${e(descriptionFor(c,isUS()))}</span></a>`).join('');
  $('empty-search').hidden=matches.length>0;$('empty-search').textContent=words.length?'No matches. Try “gravel”, “heater”, or “water change”.':'Nothing here yet. Tap the star on a calculator to keep it in Favorites.';
  $('list-caption').textContent=words.length?`${matches.length} MATCHING ${matches.length===1?'TOOL':'TOOLS'}`:opts.find(o=>o[0]===category)[1].toUpperCase();$('library-count').textContent=calculators.length;
}
function fieldHTML(field,a){
  const c=current();
  if(!isVisible(c.id,field.key,a))return '';
  const id=`field-${field.key}`,helpText=[helpFor(c.id,field,a),extraHelp(c,field,a,isUS())].filter(Boolean).join(' ');
  const help=helpText?`<small id="help-${field.key}">${e(helpText)}${field.profile?' <a href="#tool=tank" data-tool="tank">Work out my volume →</a>':''}</small>`:'';
  const desc=helpText?`aria-describedby="help-${field.key}"`:'';
  const label=labelFor(c.id,field,a);
  if(field.options)return `<div class="field"><label for="${id}">${e(label)}</label><select id="${id}" name="${field.key}" ${desc}>${field.options.map(([v,t])=>`<option value="${e(v)}" ${v===a[field.key]?'selected':''}>${e(c.id==='substrate'&&field.key==='bagMode'&&v==='volume'&&isUS()?'By volume (US gal / label litres)':t)}</option>`).join('')}</select>${help}</div>`;
  const fieldUnit=unitOf(field),unit=unitLabel(c,field,a);
  const min=toDisplay(field.min,fieldUnit),max=toDisplay(field.max,fieldUnit);
  return `<div class="field"><label for="${id}">${e(label)}</label><div class="input-wrap"><input id="${id}" name="${field.key}" type="number" inputmode="decimal" step="any" min="${min}" max="${max}" value="${inputNumber(toDisplay(a[field.key],fieldUnit),fieldUnit)}" required ${desc}><span class="input-unit">${e(unit)}</span></div>${sliderHTML(field,a,label,unit)}${choicesHTML(field,a)}${help}</div>`;
}
const choicesFor=(field,a=inputs())=>fieldChoices(current(),field,isUS(),a,state.salinity==='sg');
function choicesHTML(field,a){
  const choice=choicesFor(field,a);if(!choice)return '';
  return `<div class="field-choices" role="group" aria-label="${e(choice.title)}"><span class="choices-title">${e(choice.title)}</span><div class="choice-buttons">${choice.options.map((x,i)=>`<button type="button" data-choice-field="${field.key}" data-choice-index="${i}" aria-pressed="${Math.abs(a[field.key]-x.value)<1e-8}">${e(x.label)}</button>`).join('')}</div>${choice.note?`<small>${e(choice.note)}</small>`:''}</div>`;
}
function syncChoices(){for(const button of document.querySelectorAll('[data-choice-field]')){
  const field=current().fields.find(f=>f.key===button.dataset.choiceField),choice=choicesFor(field).options[Number(button.dataset.choiceIndex)];
  button.setAttribute('aria-pressed',String($(`field-${field.key}`).value!==''&&Math.abs(inputs()[field.key]-choice.value)<1e-8));
}}
function applyChoice(key,index){const field=current().fields.find(f=>f.key===key),choice=choicesFor(field)?.options[index];if(!choice)return;
  // Use the exact package quantity, not its rounded display, in the calculation.
  const input=$(`field-${key}`),unit=unitOf(field);
  input.value=inputNumber(toDisplay(choice.value,unit),unit);
  onInput({target:input,canonicalValue:choice.value});
}
// A standard tank fills in several measurements with one choice.
function presetHTML(a){
  const preset=formPresets(current(),isUS());if(!preset)return '';
  const chosen=preset.options.findIndex(o=>Object.entries(o.values).every(([k,v])=>typeof v==='number'?Math.abs(a[k]-v)<1e-8:a[k]===v));
  return `<div class="form-preset"><label for="form-preset">${e(preset.title)}</label><select id="form-preset" aria-describedby="form-preset-note"><option value="">${e(preset.placeholder)}</option>${preset.options.map((o,i)=>`<option value="${i}" ${i===chosen?'selected':''}>${e(o.label)}</option>`).join('')}</select><small id="form-preset-note">${e(preset.note)}</small></div>`;
}
function applyPreset(index){const option=formPresets(current(),isUS())?.options[index];if(!option)return;
  Object.assign(inputs(),option.values);repairHidden();save();renderCalculator();$('form-preset').focus();toast('Measurements filled in. Change any that differ on your tank.');
}
function salinityToggleHTML(){
  if(!current().fields.some(f=>f.unit==='ppt'))return '';
  return `<div class="salinity-toggle" role="group" aria-label="Show salinity as"><span class="choices-title">Salinity shown as</span><div class="segmented"><button type="button" data-salinity="sg" aria-pressed="${state.salinity==='sg'}">Specific gravity</button><button type="button" data-salinity="ppt" aria-pressed="${state.salinity==='ppt'}">ppt</button></div></div>`;
}
function shoppingGuide(){if(state.current!=='substrate')return '';
 const a=inputs();return `<section class="bag-guide"><h3>Compare common bag sizes</h3><p>${a.bagMode==='weight'?'Estimated counts for the material you picked.':'Counts using the labelled bag volume.'} Tap a size to use it above.</p><div class="bag-options">${bagComparison(a,isUS()).map((x,i)=>`<button type="button" data-bag-index="${i}" aria-label="Use ${e(x.label)} bag"><span>${e(x.label)} bag</span><strong>${x.bags} ${x.bags===1?'bag':'bags'}</strong></button>`).join('')}</div><small>Bag sizes vary by brand; check the weight or volume printed on yours.</small></section>`;
}
const windowFor=(field,a=inputs())=>sliderWindow(current(),field,a,isUS(),asSG(field.unit));
function sliderHTML(field,a,label,unit){
  const r=windowFor(field,a);
  return `<div class="slider-control"><input type="range" class="measurement-slider" id="slider-${field.key}" data-slider="${field.key}" min="${r.min}" max="${r.max}" step="any" data-increment="${r.step}" value="${Number.isFinite(r.value)?r.value:r.min}" aria-label="Adjust ${e(label)}${unit?' ('+e(unit)+')':''}" aria-describedby="slider-guide"><div class="slider-scale" aria-hidden="true"><span>${e(format(r.min,asSG(field.unit)?3:2))}</span><span>${e(format(r.max,asSG(field.unit)?3:2))} ${e(unit)}</span></div></div>`;
}
function syncSlider(field,expand=false){
  const slider=$(`slider-${field.key}`),number=$(`field-${field.key}`);if(!slider||!number)return;
  const unit=unitLabel(current(),field,inputs());
  if(expand){const r=windowFor(field);slider.min=r.min;slider.max=r.max;slider.dataset.increment=r.step;
    slider.nextElementSibling.innerHTML=`<span>${e(format(r.min,asSG(field.unit)?3:2))}</span><span>${e(format(r.max,asSG(field.unit)?3:2))} ${e(unit)}</span>`;
  }
  const valid=number.value!==''&&number.validity.valid;
  slider.setAttribute('aria-valuetext',valid?`${number.value} ${unit}`:'Enter a valid number or adjust this slider');
  if(valid)slider.value=number.value;
  const fill=100*(Number(slider.value)-Number(slider.min))/(Number(slider.max)-Number(slider.min));
  slider.style.setProperty('--fill',`${Math.max(0,Math.min(100,fill))}%`);
}
function moveSlider(slider,raw){
  const key=slider.dataset.slider,field=current().fields.find(f=>f.key===key);
  const value=sliderValue(raw,{min:Number(slider.min),max:Number(slider.max),step:Number(slider.dataset.increment)});
  slider.value=value;$(`field-${key}`).value=value;
  onInput({target:$(`field-${key}`),fromSlider:true});syncSlider(field);
}
function watchResults(){
  resultObserver?.disconnect();inputVisible=false;resultVisible=false;
  resultObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target.classList.contains('input-panel'))inputVisible=entry.isIntersecting;else resultVisible=entry.isIntersecting;}updateQuickResult();});
  resultObserver.observe(document.querySelector('.input-panel'));resultObserver.observe(document.querySelector('.result-panel'));
}
function updateQuickResult(){
  const bar=$('quick-result');bar.hidden=!inputVisible||resultVisible;
  if(result){
    const metric=displayMetric(result.metrics[0]).split('|');
    $('quick-value').innerHTML=`<small>${e(result.metrics[0].label)}</small><strong>${metric[0]}</strong>${metric[1]?`<small>${metric[1]}</small>`:''}`;
    $('quick-result-button').textContent='See diagram ↓';
  }else{$('quick-value').innerHTML='<small>Check your measurements</small><strong>Inputs need attention</strong>';$('quick-result-button').textContent='See details ↓';}
}
function renderCalculator(){
  const c=current(),a=inputs(),cat=categories.find(x=>x[0]===c.category);
  const related=calculators.filter(x=>x.category===c.category&&x.id!==c.id).slice(0,3);
  $('calculator-content').innerHTML=`<article class="calculator-shell"><header class="calc-heading"><div><div class="calc-eyebrow">${icon(cat[2])}${e(cat[1].toUpperCase())}</div><h2>${e(c.title)}</h2><p>${e(descriptionFor(c,isUS()))}</p></div><button id="favorite" class="favorite icon-button" aria-pressed="${state.favorites.includes(c.id)}" aria-label="${state.favorites.includes(c.id)?'Remove from':'Add to'} favorites">${icon('star')}</button></header>
  <div class="calc-body"><section class="input-panel" aria-label="Calculation inputs"><div class="panel-heading"><span class="step-label"><span class="step-no">1</span>Your measurements</span><button id="reset" class="text-button">Reset</button></div><p id="slider-guide" class="slider-guide">Tap a shortcut, drag a slider, or type your own number.</p>${presetHTML(a)}${salinityToggleHTML()}<form id="calc-form" novalidate><div class="input-fields">${c.fields.map(f=>fieldHTML(f,a)).join('')}</div></form>${hasProfile(c)?`<div class="tank-fill-control">Saved tank: <strong>${e(profile().name)}</strong><br>${isUS()?e(gallons(profile().volume))+' US gal · '+format(profile().volume)+' L':format(profile().volume)+' L · '+e(gallons(profile().volume))+' US gal'}<br><button id="use-profile" class="text-button">Use saved tank volume →</button></div>`:''}<p class="validation-note">Changes calculate automatically. Your measurements are processed in this browser.</p></section>
  <section class="result-panel" aria-label="Calculation result"><div class="panel-heading"><span class="step-label"><span class="step-no">2</span>Your answer</span><span class="live-label">LIVE RESULT</span></div><div id="result" aria-live="polite" aria-atomic="true"></div></section></div>
  <div class="details-area"><details id="math-details"><summary>The math & sources</summary><div><p class="formula">${e(formulaFor(c,isUS()))}</p>${c.note?`<p class="note">${e(noteFor(c,isUS()))}</p>`:''}${c.reference?`<p><a class="source-link" href="${e(c.reference[1])}" target="_blank" rel="noopener noreferrer">Reference: ${e(c.reference[0])} ↗</a></p>`:'<p>Method: the geometry, unit conversion, rule of thumb or proportional calculation shown above.</p>'}<p>Results are rounded for reading; the calculations keep full precision. US gallons show one decimal below ten gallons and whole gallons above. For dilute freshwater, ppm and mg/L are approximately equivalent. Use the same test basis for every reading.</p></div></details><div id="steps-details"></div></div>
  <div class="calc-footer"><span>${icon('check')} No account · saved on this device</span><button id="guide-inline" class="text-button">A quick guide →</button></div></article>
  <section class="related"><h3 class="related-heading">ALSO IN YOUR TOOLBOX</h3><div class="related-grid">${related.map(x=>`<a href="#tool=${x.id}" data-tool="${x.id}">${icon(cat[2])}<span>${e(x.title)}</span></a>`).join('')}</div>`;
  $('calc-form').addEventListener('submit',ev=>ev.preventDefault());
  $('calc-form').addEventListener('input',ev=>{if(ev.target.dataset.slider)moveSlider(ev.target,Number(ev.target.value));else onInput(ev);});
  $('calc-form').addEventListener('keydown',ev=>{const el=ev.target;if(!el.dataset.slider)return;const step=Number(el.dataset.increment),v=Number(el.value);
    const keys={ArrowLeft:v-step,ArrowDown:v-step,ArrowRight:v+step,ArrowUp:v+step,PageDown:v-10*step,PageUp:v+10*step,Home:Number(el.min),End:Number(el.max)};
    if(ev.key in keys){ev.preventDefault();moveSlider(el,keys[ev.key]);}
  });
  if($('form-preset'))$('form-preset').onchange=ev=>{if(ev.target.value!=='')applyPreset(Number(ev.target.value));};
  for(const field of c.fields)if(!field.options)syncSlider(field);
  watchResults();
  $('favorite').onclick=()=>{state.favorites=state.favorites.includes(c.id)?state.favorites.filter(id=>id!==c.id):[...state.favorites,c.id];save();renderLibrary();$('favorite').setAttribute('aria-pressed',String(state.favorites.includes(c.id)));$('favorite').setAttribute('aria-label',`${state.favorites.includes(c.id)?'Remove from':'Add to'} favorites`);};
  $('reset').onclick=()=>{state.inputs[c.id]=defaults(c,isUS());if(hasProfile(c))state.inputs[c.id].v=profile().volume;save();renderCalculator();toast('Example inputs restored.');};
  if($('use-profile'))$('use-profile').onclick=()=>{inputs().v=profile().volume;save();renderCalculator();toast('Saved tank volume applied.');};
  $('guide-inline').onclick=()=>$('guide-dialog').showModal();
  renderResult();
}
// A measurement that is hidden by another choice must not block the result.
function repairHidden(){const c=current(),a=inputs();for(const f of c.fields)if(!f.options&&!isVisible(c.id,f.key,a)&&!(Number.isFinite(a[f.key])&&a[f.key]>=f.min&&a[f.key]<=f.max))a[f.key]=f.value;}
// Switching what is being measured swaps in example readings on the matching scale.
const scaleExamples={
  supplement:{parameter:{'mg/L':{current:400,target:420,rise:10},dKH:{current:7,target:8,rise:1}}},
  consumption:{parameter:{'mg/L':{start:430,end:420},dKH:{start:8.5,end:7.8}}},
  mix:{measure:{'mg/L':{high:250,low:5,target:120},dGH:{high:12,low:0,target:6},dKH:{high:8,low:0,target:4}}}
};
const linkedSliders={turnover:{v:['flow']}};
function onInput(ev){
  const c=current(),field=c.fields.find(f=>f.key===ev.target.name);if(!field)return;
  const raw=ev.target.value,previous=inputs()[field.key];
  if(!field.options&&(raw.trim()===''||!Number.isFinite(Number(raw)))){inputs()[field.key]=NaN;save();syncSlider(field);syncChoices();showError(`Enter a number for ${labelFor(c.id,field,inputs()).toLowerCase()}.`);return;}
  inputs()[field.key]=field.options?raw:(ev.canonicalValue??fromDisplay(Number(raw),unitOf(field)));
  if(field.options){
    if(c.id==='hardness'&&field.key==='unit'&&raw!==previous)inputs().value=convertHardness(inputs().value,previous,raw);
    if(c.id==='label'&&field.key==='unit'&&raw!==previous){inputs().dose=NaN;toast('Enter the dose from the label in the newly selected unit.');}
    // A choice can change which measurements apply and the units beside them.
    const examples=scaleExamples[c.id]?.[field.key]?.[raw];if(examples&&raw!==previous){Object.assign(inputs(),examples);
      if(c.id==='supplement'){for(const key of ['dose','labelV','rise'])inputs()[key]=NaN;toast('Enter all three strength numbers from the new supplement’s label.');}
      else toast('Example readings changed for this measurement. Enter your own test readings.');
    }
    repairHidden();save();renderCalculator();$(`field-${field.key}`).focus();return;
  }
  syncSlider(field,!ev.fromSlider);
  // A slider whose useful range depends on this measurement gets its new range.
  for(const key of linkedSliders[c.id]?.[field.key]||[])syncSlider(c.fields.find(f=>f.key===key),true);
  syncChoices();
  // Do not let a partially blank form produce a result from previously saved values.
  const blank=[...$('calc-form').querySelectorAll('input[type=number]')].find(x=>x.value.trim()==='');
  if(blank){showError('Complete every measurement to calculate a result.');return;}
  renderResult();save();
}
function showError(message){result=null;$('result').innerHTML=`<div class="error-card" role="alert"><h3>Let’s check that measurement</h3><p>${e(message)}</p><p>No result is shown until the inputs are valid.</p></div>`;$('steps-details').innerHTML='';updateQuickResult();}
const mixLegends={
  ammonia:['toxic free ammonia','Ammonium (far less toxic)','Toxic free ammonia (NH₃)'],stock:['stock solution','Water','Stock solution'],mix:['RO / distilled water','Tap water','RO / distilled'],
  change:['changed','Old tank water','New water'],target:['changed','Old tank water','New water'],adjust:['swapped','Old tank water','Added water'],salinity:['second water','First water','Second water']
};
function renderResult(){try{
  result=calculate(state.current,inputs(),isUS(),state.salinity==='sg');
  const metricHTML=result.metrics.map((m,i)=>{const [main,secondary]=displayMetric(m).split('|');return `<div class="metric ${i===0?'primary-metric':''}"><div class="metric-label">${e(m.label)}</div><div class="metric-value">${main}</div>${secondary?`<div class="metric-secondary">${secondary}</div>`:''}</div>`;}).join('');
  const diagramLabel=`${current().title}: ${result.metrics.map(m=>{const p=metricParts(m);return `${m.label}: ${p.unit==='$'?'$'+p.text:p.text+' '+p.unit}`;}).join('; ')}. Diagram illustrates the calculation, not a measurement.`;
  const graph={...result.graphic};
  const legend=mixLegends[state.current];if(legend&&graph.type==='mix'){graph.fractionLabel=legend[0];graph.legend=[legend[1],legend[2]];}
  if(state.current==='hardness'){graph.type='equivalence';graph.values=result.metrics.map(m=>`${format(m.value)} ${plain(m.unit)}`);}
  if(graph.valueUnit==='ppt'&&graph.values&&state.salinity==='sg'){graph.values=graph.values.map(sgText);graph.valueUnit='SG';}
  $('result').innerHTML=`<div class="diagram">${illustration(graph,diagramLabel,isUS())}</div><div class="metrics">${metricHTML}</div><p class="result-message">${e(result.message)}</p>${shoppingGuide()}<div class="result-actions"><button id="share-result">Share calculation</button><button id="print-result">Print result</button>${['tank','system'].includes(state.current)?'<button id="apply-volume">Save as my tank volume</button>':''}</div>`;
  $('steps-details').innerHTML=(result.steps?.length?`<details><summary>Step by step</summary><div><ol class="steps">${result.steps.map(s=>`<li>${e(s)}</li>`).join('')}</ol></div></details>`:'')+(result.table?`<details><summary>Change-by-change breakdown</summary><div><table class="results-table"><caption>Predicted reading after each change</caption><tbody>${result.table.map(r=>`<tr>${r.map(s=>`<td>${e(s)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`:'');
  $('share-result').onclick=share;$('print-result').onclick=()=>window.print();if($('apply-volume'))$('apply-volume').onclick=()=>{const v=result.metrics[0].value;if(!Number.isFinite(v)||v<.01||v>1e7){toast('This volume is outside the supported saved-tank range.');return;}profile().volume=v;applyProfile();save();renderPreferences();toast('Saved. The other calculators now use this volume for your tank.');};
updateQuickResult();
}catch(err){showError(err.message);}}
function selectTool(id,scroll=false){if(!ids.has(id))return;state.current=id;showListFor(id);inputs();save();history.replaceState(null,'',`#tool=${id}`);renderLibrary();renderCalculator();if(scroll){$('calculator').scrollIntoView({behavior:'instant',block:'start'});$('calculator').focus({preventScroll:true});}}
function setUnits(units){
  // A unit switch changes presentation, never the tank or an existing calculation.
  state.units=units;
  save();renderPreferences();renderLibrary();renderCalculator();
}
function openProfile(){$('tank-name').value=profile().name;$('tank-volume').value=Number((isUS()?profile().volume/GAL:profile().volume).toFixed(6));$('profile-unit').textContent=isUS()?'(US gal)':'(litres)';$('tank-volume').min=isUS()?.01/GAL:.01;$('tank-volume').max=isUS()?1e7/GAL:1e7;$('tank-type').value=profile().type;$('profile-error').textContent='';
  const c=calculators.find(c=>c.id==='change'),f=c.fields.find(f=>f.profile),choice=fieldChoices(c,f,isUS(),{});
  $('profile-presets').innerHTML=`<div class="choices-title">Size on the box</div><div class="choice-buttons">${choice.options.map(x=>`<button type="button" data-profile-volume="${x.value}">${e(x.label)}</button>`).join('')}</div><small>The advertised size is close enough for most things. For careful dosing, use Tank volume to work out the real amount of water.</small>`;
  $('profile-dialog').showModal();}
function saveProfile(asNew=false){
  const name=$('tank-name').value.trim(),raw=$('tank-volume').value,volume=Number(raw)*(isUS()?GAL:1);
  if(!name||name.length>60||!raw||!Number.isFinite(volume)||volume<.01||volume>1e7){$('profile-error').textContent=isUS()?'Enter a name and a water volume between 0.002642 and 2,641,720 US gallons.':'Enter a name and a water volume between 0.01 and 10,000,000 litres.';return;}
  if(asNew&&state.profiles.length>=20){$('profile-error').textContent='This toolbox supports up to 20 saved tanks.';return;}
  const p={id:asNew?`tank-${Date.now()}`:profile().id,name,volume,type:$('tank-type').value};
  if(asNew)state.profiles.push(p);else state.profiles[state.profiles.findIndex(x=>x.id===p.id)]=p;
  state.activeProfile=p.id;applyProfile();save();renderPreferences();renderCalculator();$('profile-dialog').close();toast(asNew?'New tank saved.':'Tank saved and tank-volume inputs updated.');
}
function applyProfile(){for(const c of calculators){if(hasProfile(c)&&state.inputs[c.id])state.inputs[c.id].v=profile().volume;}}
function share(){const params=new URLSearchParams({tool:state.current,units:state.units,data:JSON.stringify(inputs())});if(current().fields.some(f=>f.unit==='ppt'))params.set('sal',state.salinity);$('share-url').value=`${location.origin}${location.pathname}#${params}`;$('copy-status').textContent='';$('share-dialog').showModal();$('share-url').select();}
function loadHash(){try{const params=new URLSearchParams(location.hash.slice(1)),id=params.get('tool');if(!id||!ids.has(id))return;state.current=id;if(['us','metric'].includes(params.get('units')))state.units=params.get('units');if(['sg','ppt'].includes(params.get('sal')))state.salinity=params.get('sal');if(params.has('data')){if(params.get('data').length>8000)throw new Error('Link is too large.');const input=migrateInputs(id,JSON.parse(params.get('data'))),c=current(),clean={};for(const f of c.fields)clean[f.key]=input[f.key]??f.value;calculate(id,clean);state.inputs[id]=clean;}save();}catch{toast('That shared calculation is invalid. Example inputs are shown instead.');state.inputs[state.current]=defaults(current(),isUS());}}
$('quick-result-button').onclick=()=>document.querySelector('.result-panel').scrollIntoView({behavior:'smooth',block:'start'});
$('search-icon').innerHTML=icon('search');$('tool-count').textContent=calculators.length;
document.addEventListener('click',ev=>{const profileChoice=ev.target.closest('[data-profile-volume]');if(profileChoice){$('tank-volume').value=isUS()?Number((Number(profileChoice.dataset.profileVolume)/GAL).toFixed(6)):Number(profileChoice.dataset.profileVolume);return;}const choice=ev.target.closest('[data-choice-field]');if(choice){applyChoice(choice.dataset.choiceField,Number(choice.dataset.choiceIndex));return;}const bag=ev.target.closest('[data-bag-index]');if(bag){applyChoice(inputs().bagMode==='weight'?'bagWeight':'bag',Number(bag.dataset.bagIndex));document.querySelector(`[data-bag-index="${bag.dataset.bagIndex}"]`)?.focus({preventScroll:true});return;}const sal=ev.target.closest('[data-salinity]');if(sal){state.salinity=sal.dataset.salinity;save();renderCalculator();document.querySelector(`[data-salinity="${state.salinity}"]`)?.focus({preventScroll:true});return;}const cat=ev.target.closest('[data-category]');if(cat){category=cat.dataset.category;renderLibrary();return;}const link=ev.target.closest('[data-tool]');if(link){ev.preventDefault();selectTool(link.dataset.tool,matchMedia('(max-width:760px)').matches);}const close=ev.target.closest('[data-close]');if(close)close.closest('dialog').close();});
$('search').addEventListener('input',ev=>{query=ev.target.value;renderLibrary();});
document.addEventListener('keydown',ev=>{if(ev.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){ev.preventDefault();$('search').focus();}});
$('unit-us').onclick=()=>setUnits('us');$('unit-metric').onclick=()=>setUnits('metric');
$('profile-select').onchange=ev=>{state.activeProfile=ev.target.value;applyProfile();save();renderPreferences();renderCalculator();toast('Working tank changed. Tank-volume inputs updated.');};
$('profiles-open').onclick=openProfile;$('edit-profile').onclick=openProfile;
$('profile-form').onsubmit=ev=>{ev.preventDefault();saveProfile();};$('new-profile').onclick=()=>saveProfile(true);
for(const id of ['settings-open','backup-open'])$(id).onclick=()=>$('settings-dialog').showModal();
$('guide-open').onclick=()=>$('guide-dialog').showModal();$('settings-guide').onclick=()=>{$('settings-dialog').close();$('guide-dialog').showModal();};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='aquarium-toolbox-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('import-status').textContent='Backup downloaded. Keep it somewhere you can find it.';};
$('import').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>100000)throw new Error('This file is too large for a toolbox backup.');const imported=validateBackup(JSON.parse(await file.text()));if(!window.confirm('Restore this backup? It will replace the saved tanks, favorites, and inputs in this toolbox.'))return;state=imported;showListFor(state.current);save();renderPreferences();renderLibrary();renderCalculator();$('import-status').textContent='Backup restored.';}catch(err){$('import-status').textContent=`Could not restore: ${err.message}`;}finally{ev.target.value='';}};
$('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText($('share-url').value);$('copy-status').textContent='Link copied.';}catch{$('share-url').focus();$('share-url').select();$('copy-status').textContent='Select and copy the link above using your browser.';}};
window.addEventListener('hashchange',()=>{loadHash();showListFor(state.current);renderPreferences();renderLibrary();renderCalculator();});
loadHash();showListFor(state.current);renderPreferences();renderLibrary();renderCalculator();
if(!storageAvailable)toast('Saved settings could not be read. You can still calculate and export a backup.');
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('.details-area details')].map(el=>({el,open:el.open}));for(const {el}of printDetails)el.open=true;});
window.addEventListener('afterprint',()=>{for(const {el,open}of printDetails)el.open=open;});
