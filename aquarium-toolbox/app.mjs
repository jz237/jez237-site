import {calculators,categories,defaults,calculate,convert,usUnit,GAL,migrateInputs} from './calculators.mjs';
import {icon,illustration,escape as e} from './illustrations.mjs';
import {sliderWindow,sliderValue} from './sliders.mjs';
import {fieldChoices,extraHelp,bagComparison} from './presets.mjs';
import {formulaFor,noteFor,descriptionFor} from './us-copy.mjs';
const $=id=>document.getElementById(id);
const KEY='aquarium-toolbox-v1';
const ids=new Set(calculators.map(c=>c.id));
const fresh=()=>({version:1,units:'us',current:'tank',favorites:[],inputs:{},profiles:[{id:'default',name:'My aquarium',volume:100,type:'freshwater'}],activeProfile:'default'});
export function validateBackup(raw){
  if(!raw||raw.version!==1||!['us','metric'].includes(raw.units)||!Array.isArray(raw.profiles)||raw.profiles.length<1||raw.profiles.length>20)throw new Error('This is not a supported Aquarium Toolbox backup.');
  const result=fresh();result.units=raw.units;result.current=ids.has(raw.current)?raw.current:'tank';
  result.profiles=raw.profiles.map(p=>{if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>60||typeof p.volume!=='number'||!Number.isFinite(p.volume)||p.volume<.01||p.volume>1e7||!['freshwater','planted','reef'].includes(p.type))throw new Error('The backup contains an invalid tank.');return {id:p.id,name:p.name.trim(),volume:p.volume,type:p.type};});
  if(new Set(result.profiles.map(p=>p.id)).size!==result.profiles.length)throw new Error('The backup contains duplicate tanks.');
  result.activeProfile=result.profiles.some(p=>p.id===raw.activeProfile)?raw.activeProfile:result.profiles[0].id;
  result.favorites=Array.isArray(raw.favorites)?[...new Set(raw.favorites.filter(id=>ids.has(id)))]:[];
  for(const calc of calculators){const a=migrateInputs(calc.id,raw.inputs?.[calc.id]);if(a){const v={};for(const f of calc.fields){const x=a[f.key];if(f.options){if(!f.options.some(o=>o[0]===x))throw new Error('The backup contains an invalid selection.');}else if(typeof x!=='number'||!Number.isFinite(x)||x<f.min||x>f.max)throw new Error('The backup contains an invalid number.');v[f.key]=x;}result.inputs[calc.id]=v;}}
  return result;
}
let state=fresh(),storageAvailable=true;
try{const saved=localStorage.getItem(KEY);if(saved)state=validateBackup(JSON.parse(saved));}catch{storageAvailable=false;}
let category='all',query='',result=null,toastTimer,resultObserver;
let inputVisible=false,resultVisible=false;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function snapshot(){const clean={...state,inputs:{}};for(const [id,a]of Object.entries(state.inputs)){try{calculate(id,a);clean.inputs[id]={...a};}catch{/* Incomplete edits must not corrupt otherwise valid tank backups. */}}return clean;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()));storageAvailable=true;}catch{storageAvailable=false;toast('Browser storage is unavailable. Download a backup to keep your settings.');}}
const current=()=>calculators.find(c=>c.id===state.current);
const profile=()=>state.profiles.find(p=>p.id===state.activeProfile)||state.profiles[0];
function inputs(calc=current()){if(!state.inputs[calc.id]){state.inputs[calc.id]=defaults(calc);if(calc.fields.some(f=>f.key==='v'&&f.label==='Actual water volume'))state.inputs[calc.id].v=profile().volume;}return state.inputs[calc.id];}
function format(v,digits=2){if(v!==0&&Math.abs(v)<.0001)return v.toExponential(3);return v.toLocaleString('en-US',{maximumFractionDigits:Math.abs(v)<.01?5:Math.abs(v)<.1?4:digits});}
function inputNumber(value,unit){return Number(value.toFixed(usUnit(unit)!==unit?(Math.abs(value)<.001?9:3):6));}
function gallons(l){const g=l/GAL;return g>0&&g<1?'<1':format(Math.round(g),0);}
function displayMetric(m){
  let value=m.value,unit=m.unit,secondary='';const conversionUnit=m.displayUnit||m.unit;
  if(m.unit==='L'){if(state.units==='us'){value=gallons(m.value);unit='US gal';secondary=`${format(m.value)} litres`;}else secondary=`${gallons(m.value)} US gal`;}
  else if(m.unit==='L/h'){if(state.units==='us'){value=m.value/GAL;unit='US GPH';secondary=`${format(m.value)} L/h`;}else secondary=`${format(m.value/GAL)} US GPH`;}
  else if(usUnit(conversionUnit)!==conversionUnit){const other=convert(m.value,conversionUnit,true);if(state.units==='us'){value=other;unit=usUnit(conversionUnit);secondary=`${format(m.value)} ${m.unit}`;}else secondary=`${format(other)} ${usUnit(conversionUnit)}`;}
  if(unit==='$')return `<span class="currency">$</span>${format(value)}|`;
  return `${e(typeof value==='number'?format(value):value)}<span class="unit">${e(unit)}</span>|${e(secondary)}`;
}
function renderPreferences(){
  $('profile-select').innerHTML=state.profiles.map(p=>`<option value="${e(p.id)}" ${p.id===state.activeProfile?'selected':''}>${e(p.name)} · ${state.units==='us'?e(gallons(p.volume))+' US gal':format(p.volume)+' L'}</option>`).join('');
  $('unit-us').setAttribute('aria-pressed',String(state.units==='us'));$('unit-metric').setAttribute('aria-pressed',String(state.units==='metric'));
}
function renderLibrary(){
  const opts=[['all','All calculators','grid'],...categories,['favorites','Favorites','star']];
  $('categories').innerHTML=opts.map(([id,label,img])=>{const count=id==='all'?calculators.length:id==='favorites'?state.favorites.length:calculators.filter(c=>c.category===id).length;return `<button class="category" data-category="${id}" aria-pressed="${id===category}">${icon(img)}<span>${e(label)}</span><span class="count">${count}</span></button>`;}).join('');
  const matches=calculators.filter(c=>(category==='all'||(category==='favorites'?state.favorites.includes(c.id):c.category===category))&&[c.title,c.description,c.category,...c.fields.map(f=>f.label)].join(' ').toLowerCase().includes(query.toLowerCase().trim()));
  $('tool-list').innerHTML=matches.map(c=>`<a class="tool-link" href="#tool=${c.id}" data-tool="${c.id}" aria-current="${c.id===state.current}">${e(c.title)}<span>${e(descriptionFor(c,state.units==='us'))}</span></a>`).join('');
  $('empty-search').hidden=matches.length>0;$('list-caption').textContent=query?`${matches.length} MATCHING TOOLS`:opts.find(o=>o[0]===category)[1].toUpperCase();$('library-count').textContent=calculators.length;
}
function fieldHTML(field,a){
  if(current().id==='substrate'&&((field.key==='bag'&&a.bagMode!=='volume')||(field.key==='bagWeight'&&a.bagMode!=='weight')))return '';
  const fieldUnit=field.displayUnit||field.unit;
  const id=`field-${field.key}`,helpText=[field.help,extraHelp(current(),field)].filter(Boolean).join(' ');
  const help=helpText?`<small id="help-${field.key}">${e(helpText)}${field.key==='v'&&field.label==='Actual water volume'?' <a href="#tool=tank" data-tool="tank">Estimate my volume →</a>':''}</small>`:'';
  const desc=helpText?`aria-describedby="help-${field.key}"`:'';
  let label=field.label;
  if(current().id==='tank'){if(field.key==='l')label=a.shape==='cylinder'?'Inside diameter':'Inside length';if(field.key==='w')label='Inside width';}
  if(current().id==='tank'&&field.key==='w'&&a.shape==='cylinder')return '';
  if(field.options)return `<div class="field"><label for="${id}">${e(label)}</label><select id="${id}" name="${field.key}" ${desc}>${field.options.map(([v,t])=>`<option value="${e(v)}" ${v===a[field.key]?'selected':''}>${e(current().id==='substrate'&&field.key==='bagMode'&&v==='volume'&&state.units==='us'?'By volume (US gal / label litres)':t)}</option>`).join('')}</select>${help}</div>`;
  const isUS=state.units==='us',display=isUS?convert(a[field.key],fieldUnit,true):a[field.key],unit=isUS?usUnit(fieldUnit):field.unit;
  const min=isUS?convert(field.min,fieldUnit,true):field.min,max=isUS?convert(field.max,fieldUnit,true):field.max;
  return `<div class="field"><label for="${id}">${e(label)}</label><div class="input-wrap"><input id="${id}" name="${field.key}" type="number" inputmode="decimal" step="any" min="${min}" max="${max}" value="${inputNumber(display,fieldUnit)}" required ${desc}><span class="input-unit">${e(unit)}</span></div>${sliderHTML(field,a,label,unit)}${choicesHTML(field,a)}${help}</div>`;
}
function choicesHTML(field,a){
  const choice=fieldChoices(current(),field,state.units==='us',a);if(!choice)return '';
  return `<div class="field-choices" role="group" aria-label="${e(choice.title)}"><span class="choices-title">${e(choice.title)}</span><div class="choice-buttons">${choice.options.map((x,i)=>`<button type="button" data-choice-field="${field.key}" data-choice-index="${i}" aria-pressed="${Math.abs(a[field.key]-x.value)<1e-8}">${e(x.label)}</button>`).join('')}</div><small>${e(choice.note)}</small></div>`;
}
function syncChoices(){for(const button of document.querySelectorAll('[data-choice-field]')){
  const field=current().fields.find(f=>f.key===button.dataset.choiceField),choice=fieldChoices(current(),field,state.units==='us',inputs()).options[Number(button.dataset.choiceIndex)];
  button.setAttribute('aria-pressed',String($(`field-${field.key}`).value!==''&&Math.abs(inputs()[field.key]-choice.value)<1e-8));
}}
function applyChoice(key,index){const field=current().fields.find(f=>f.key===key),choice=fieldChoices(current(),field,state.units==='us',inputs())?.options[index];if(!choice)return;
  // Use the exact package quantity, not its rounded display, in the calculation.
  const input=$(`field-${key}`),unit=field.displayUnit||field.unit;
  input.value=inputNumber(state.units==='us'?convert(choice.value,unit,true):choice.value,unit);
  onInput({target:input,canonicalValue:choice.value});
}
function shoppingGuide(){if(state.current!=='substrate')return '';
 const a=inputs();return `<section class="bag-guide"><h3>Compare common bag sizes</h3><p>${a.bagMode==='weight'?'Estimated counts using your material’s density.':'Counts using the labelled bag volume.'} Tap a size to use it above.</p><div class="bag-options">${bagComparison(a,state.units==='us').map((x,i)=>`<button type="button" data-bag-index="${i}" aria-label="Use ${e(x.label)} bag"><span>${e(x.label)} bag</span><strong>${x.bags} ${x.bags===1?'bag':'bags'}</strong></button>`).join('')}</div><small>Typical package examples, not an inventory or availability list. No size chosen yet? Use this comparison to plan your shopping.</small></section>`;
}
function sliderHTML(field,a,label,unit){
  const r=sliderWindow(current(),field,a,state.units==='us');
  return `<div class="slider-control"><input type="range" class="measurement-slider" id="slider-${field.key}" data-slider="${field.key}" min="${r.min}" max="${r.max}" step="any" data-increment="${r.step}" value="${r.value}" aria-label="Adjust ${e(label)}${unit?' ('+e(unit)+')':''}" aria-describedby="slider-guide"><div class="slider-scale" aria-hidden="true"><span>${e(format(r.min))}</span><span>${e(format(r.max))} ${e(unit)}</span></div></div>`;
}
function syncSlider(field,expand=false){
  const slider=$(`slider-${field.key}`),number=$(`field-${field.key}`);if(!slider||!number)return;
  if(expand){const r=sliderWindow(current(),field,inputs(),state.units==='us');slider.min=r.min;slider.max=r.max;slider.dataset.increment=r.step;
    const unit=state.units==='us'?usUnit(field.displayUnit||field.unit):field.unit;
    slider.nextElementSibling.innerHTML=`<span>${e(format(r.min))}</span><span>${e(format(r.max))} ${e(unit)}</span>`;
  }
  const valid=number.value!==''&&number.validity.valid;
  slider.setAttribute('aria-valuetext',valid?`${number.value} ${state.units==='us'?usUnit(field.displayUnit||field.unit):field.unit}`:'Enter a valid number or adjust this slider');
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
  $('calculator-content').innerHTML=`<article class="calculator-shell"><header class="calc-heading"><div><div class="calc-eyebrow">${icon(cat[2])}${e(cat[1].toUpperCase())}</div><h2>${e(c.title)}</h2><p>${e(descriptionFor(c,state.units==='us'))}</p></div><button id="favorite" class="favorite icon-button" aria-pressed="${state.favorites.includes(c.id)}" aria-label="${state.favorites.includes(c.id)?'Remove from':'Add to'} favorites">${icon('star')}</button></header>
  <div class="calc-body"><section class="input-panel" aria-label="Calculation inputs"><div class="panel-heading"><span class="step-label"><span class="step-no">1</span>Your measurements</span><button id="reset" class="text-button">Reset</button></div><p id="slider-guide" class="slider-guide">Drag to explore. Type for precision. Slider ranges are editing shortcuts, not recommended limits.</p><form id="calc-form" novalidate><div class="input-fields">${c.fields.map(f=>fieldHTML(f,a)).join('')}</div></form>${c.fields.some(f=>f.key==='v'&&f.label==='Actual water volume')?`<div class="tank-fill-control">Saved tank: <strong>${e(profile().name)}</strong><br>${state.units==='us'?e(gallons(profile().volume))+' US gal · '+format(profile().volume)+' L':format(profile().volume)+' L · '+e(gallons(profile().volume))+' US gal'}<br><button id="use-profile" class="text-button">Use saved tank volume →</button></div>`:''}<p class="validation-note">Changes calculate automatically. Your measurements are processed in this browser.</p></section>
  <section class="result-panel" aria-label="Calculation result"><div class="panel-heading"><span class="step-label"><span class="step-no">2</span>See what it means</span><span class="live-label">LIVE RESULT</span></div><div id="result" aria-live="polite" aria-atomic="true"></div></section></div>
  <div class="details-area"><details id="math-details"><summary>The math & sources</summary><div><p class="formula">${e(formulaFor(c,state.units==='us'))}</p>${c.note?`<p class="note">${e(noteFor(c,state.units==='us'))}</p>`:''}${c.reference?`<p><a class="source-link" href="${e(c.reference[1])}" target="_blank" rel="noopener noreferrer">Reference: ${e(c.reference[0])} ↗</a></p>`:'<p>Method: the geometry, unit conversion, or proportional calculation shown above.</p>'}<p>Results and converted input displays are rounded; calculations retain precision. US gallons in results are rounded to whole gallons; a positive amount below one gallon is shown as &lt;1. Litres show finer amounts.</p></div></details><div id="steps-details"></div></div>
  <div class="calc-footer"><span>${icon('check')} No account · saved on this device</span><button id="guide-inline" class="text-button">A quick guide →</button></div></article>
  <section class="related"><h3 class="related-heading">ALSO IN YOUR TOOLBOX</h3><div class="related-grid">${related.map(x=>`<a href="#tool=${x.id}" data-tool="${x.id}">${icon(cat[2])}<span>${e(x.title)}</span></a>`).join('')}</div>`;
  $('calc-form').addEventListener('submit',ev=>ev.preventDefault());
  $('calc-form').addEventListener('input',ev=>{if(ev.target.dataset.slider)moveSlider(ev.target,Number(ev.target.value));else onInput(ev);});
  $('calc-form').addEventListener('keydown',ev=>{const el=ev.target;if(!el.dataset.slider)return;const step=Number(el.dataset.increment),v=Number(el.value);
    const keys={ArrowLeft:v-step,ArrowDown:v-step,ArrowRight:v+step,ArrowUp:v+step,PageDown:v-10*step,PageUp:v+10*step,Home:Number(el.min),End:Number(el.max)};
    if(ev.key in keys){ev.preventDefault();moveSlider(el,keys[ev.key]);}
  });
  for(const field of c.fields)if(!field.options)syncSlider(field);
  watchResults();
  $('favorite').onclick=()=>{state.favorites=state.favorites.includes(c.id)?state.favorites.filter(id=>id!==c.id):[...state.favorites,c.id];save();renderLibrary();$('favorite').setAttribute('aria-pressed',String(state.favorites.includes(c.id)));$('favorite').setAttribute('aria-label',`${state.favorites.includes(c.id)?'Remove from':'Add to'} favorites`);};
  $('reset').onclick=()=>{state.inputs[c.id]=defaults(c);if(c.fields.some(f=>f.key==='v'&&f.label==='Actual water volume'))state.inputs[c.id].v=profile().volume;save();renderCalculator();toast('Example inputs restored.');};
  if($('use-profile'))$('use-profile').onclick=()=>{inputs().v=profile().volume;save();renderCalculator();toast('Saved tank volume applied.');};
  $('guide-inline').onclick=()=>$('guide-dialog').showModal();
  renderResult();
}
function onInput(ev){
  const c=current(),field=c.fields.find(f=>f.key===ev.target.name);if(!field)return;
  const raw=ev.target.value;
  if(!field.options&&(raw.trim()===''||!Number.isFinite(Number(raw)))){syncSlider(field);syncChoices();showError(`Enter a number for ${field.label.toLowerCase()}.`);return;}
  inputs()[field.key]=field.options?raw:(ev.canonicalValue??(state.units==='us'?convert(Number(raw),field.displayUnit||field.unit,false):Number(raw)));
  if(field.key==='shape'||field.key==='bagMode'){
    if(field.key==='bagMode'){const inactive=c.fields.find(f=>f.key===(raw==='weight'?'bag':'bagWeight')),value=inputs()[inactive.key];if(!Number.isFinite(value)||value<inactive.min||value>inactive.max)inputs()[inactive.key]=inactive.value;}
    save();renderCalculator();$(`field-${field.key}`).focus();return;}
  if(c.id==='supplement'&&field.key==='parameter'){const ca=raw==='mg/L';Object.assign(inputs(),{current:ca?400:7,target:ca?420:8,rise:ca?10:1});save();renderCalculator();$('field-parameter').focus();return;}
  if(!field.options)syncSlider(field,!ev.fromSlider);
  else for(const dependent of c.fields)if(!dependent.options)syncSlider(dependent,true);
  syncChoices();
  // Do not let a partially blank form produce a result from previously saved values.
  const blank=[...$('calc-form').querySelectorAll('input[type=number]')].find(x=>x.value.trim()==='');
  if(blank){showError('Complete every measurement to calculate a result.');return;}
  renderResult();save();
}
function showError(message){result=null;$('result').innerHTML=`<div class="error-card" role="alert"><h3>Let’s check that measurement</h3><p>${e(message)}</p><p>No result is shown until the inputs are valid.</p></div>`;$('steps-details').innerHTML='';updateQuickResult();}
function renderResult(){try{
  result=calculate(state.current,inputs(),state.units==='us');
  const metricHTML=result.metrics.map((m,i)=>{const [main,secondary]=displayMetric(m).split('|');return `<div class="metric ${i===0?'primary-metric':''}"><div class="metric-label">${e(m.label)}</div><div class="metric-value">${main}</div>${secondary?`<div class="metric-secondary">${secondary}</div>`:''}</div>`;}).join('');
  const diagramLabel=`${current().title}: ${result.metrics.map(m=>`${m.label}: ${state.units==='us'?(m.unit==='L'?gallons(m.value):format(convert(m.value,m.displayUnit||m.unit,true))):format(m.value)} ${state.units==='us'?usUnit(m.displayUnit||m.unit):m.unit}`).join('; ')}. Diagram illustrates the calculation, not a measurement.`;
  const graph={...result.graphic};
  if(['ammonia','stock','mix'].includes(state.current)){graph.fractionLabel=state.current==='ammonia'?'un-ionized ammonia':state.current==='stock'?'stock solution':'source B';graph.legend=state.current==='ammonia'?['Ionized fraction','Un-ionized fraction']:state.current==='stock'?['Diluent','Stock']:['Source A','Source B'];}
  if(state.current==='hardness'){graph.type='equivalence';graph.values=result.metrics.map(m=>`${format(m.value)} ${m.unit}`);}
  $('result').innerHTML=`<div class="diagram">${illustration(graph,diagramLabel,state.units==='us')}</div><div class="metrics">${metricHTML}</div><p class="result-message">${e(result.message)}</p>${shoppingGuide()}<div class="result-actions"><button id="share-result">Share calculation</button><button id="print-result">Print result</button>${['tank','system'].includes(state.current)?'<button id="apply-volume">Use as tank volume</button>':''}</div>`;
  $('steps-details').innerHTML=(result.steps?.length?`<details><summary>Step by step</summary><div><ol class="steps">${result.steps.map(s=>`<li>${e(s)}</li>`).join('')}</ol></div></details>`:'')+(result.table?`<details><summary>Change-by-change breakdown</summary><div><table class="results-table"><caption>Predicted concentration after each change</caption><tbody>${result.table.map(r=>`<tr>${r.map(s=>`<td>${e(s)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`:'');
  $('share-result').onclick=share;$('print-result').onclick=()=>window.print();if($('apply-volume'))$('apply-volume').onclick=()=>{const v=result.metrics[0].value;if(v<.01){toast('Volume is too small to save as a working tank.');return;}profile().volume=v;save();renderPreferences();toast('Working tank volume updated. Use “Use saved tank volume” in an existing calculation.');};
updateQuickResult();
}catch(err){showError(err.message);}}
function selectTool(id,scroll=false){if(!ids.has(id))return;state.current=id;inputs();save();history.replaceState(null,'',`#tool=${id}`);renderLibrary();renderCalculator();if(scroll){$('calculator').scrollIntoView({behavior:'instant',block:'start'});$('calculator').focus({preventScroll:true});}}
function setUnits(units){state.units=units;save();renderPreferences();renderLibrary();renderCalculator();}
function openProfile(){$('tank-name').value=profile().name;$('tank-volume').value=Number((state.units==='us'?profile().volume/GAL:profile().volume).toFixed(6));$('profile-unit').textContent=state.units==='us'?'(US gal)':'(litres)';$('tank-volume').min=state.units==='us'?.01/GAL:.01;$('tank-volume').max=state.units==='us'?1e7/GAL:1e7;$('tank-type').value=profile().type;$('profile-error').textContent='';
  const c=calculators.find(c=>c.id==='change'),f=c.fields.find(f=>f.key==='v'),choice=fieldChoices(c,f,state.units==='us',{});
  $('profile-presets').innerHTML=`<div class="choices-title">Common advertised tank sizes</div><div class="choice-buttons">${choice.options.map(x=>`<button type="button" data-profile-volume="${x.value}">${e(x.label)}</button>`).join('')}</div><small>Nominal capacity only. Adjust for rocks, substrate, air gap and operating sump water before saving.</small>`;
  $('profile-dialog').showModal();}
function saveProfile(asNew=false){
  const name=$('tank-name').value.trim(),raw=$('tank-volume').value,volume=Number(raw)*(state.units==='us'?GAL:1);
  if(!name||name.length>60||!raw||!Number.isFinite(volume)||volume<.01||volume>1e7){$('profile-error').textContent=state.units==='us'?'Enter a name and a water volume between 0.002642 and 2,641,720 US gallons.':'Enter a name and a water volume between 0.01 and 10,000,000 litres.';return;}
  if(asNew&&state.profiles.length>=20){$('profile-error').textContent='This toolbox supports up to 20 saved tanks.';return;}
  const p={id:asNew?`tank-${Date.now()}`:profile().id,name,volume,type:$('tank-type').value};
  if(asNew)state.profiles.push(p);else state.profiles[state.profiles.findIndex(x=>x.id===p.id)]=p;
  state.activeProfile=p.id;applyProfile();save();renderPreferences();renderCalculator();$('profile-dialog').close();toast(asNew?'New tank saved.':'Tank saved and tank-volume inputs updated.');
}
function applyProfile(){for(const c of calculators){if(c.fields.some(f=>f.key==='v'&&f.label==='Actual water volume')&&state.inputs[c.id])state.inputs[c.id].v=profile().volume;}}
function share(){const params=new URLSearchParams({tool:state.current,units:state.units,data:JSON.stringify(inputs())});$('share-url').value=`${location.origin}${location.pathname}#${params}`;$('copy-status').textContent='';$('share-dialog').showModal();$('share-url').select();}
function loadHash(){try{const params=new URLSearchParams(location.hash.slice(1)),id=params.get('tool');if(!id||!ids.has(id))return;state.current=id;if(['us','metric'].includes(params.get('units')))state.units=params.get('units');if(params.has('data')){if(params.get('data').length>8000)throw new Error('Link is too large.');const input=migrateInputs(id,JSON.parse(params.get('data'))),c=current(),clean={};for(const f of c.fields)clean[f.key]=input[f.key]??f.value;calculate(id,clean);state.inputs[id]=clean;}save();}catch{toast('That shared calculation is invalid. Example inputs are shown instead.');state.inputs[state.current]=defaults(current());}}
$('quick-result-button').onclick=()=>document.querySelector('.result-panel').scrollIntoView({behavior:'smooth',block:'start'});
$('search-icon').innerHTML=icon('search');$('tool-count').textContent=calculators.length;
document.addEventListener('click',ev=>{const profileChoice=ev.target.closest('[data-profile-volume]');if(profileChoice){$('tank-volume').value=state.units==='us'?Number(profileChoice.dataset.profileVolume)/GAL:Number(profileChoice.dataset.profileVolume);return;}const choice=ev.target.closest('[data-choice-field]');if(choice){applyChoice(choice.dataset.choiceField,Number(choice.dataset.choiceIndex));return;}const bag=ev.target.closest('[data-bag-index]');if(bag){applyChoice(inputs().bagMode==='weight'?'bagWeight':'bag',Number(bag.dataset.bagIndex));document.querySelector(`[data-bag-index="${bag.dataset.bagIndex}"]`)?.focus({preventScroll:true});return;}const cat=ev.target.closest('[data-category]');if(cat){category=cat.dataset.category;renderLibrary();return;}const link=ev.target.closest('[data-tool]');if(link){ev.preventDefault();selectTool(link.dataset.tool,matchMedia('(max-width:760px)').matches);}const close=ev.target.closest('[data-close]');if(close)close.closest('dialog').close();});
$('search').addEventListener('input',ev=>{query=ev.target.value;renderLibrary();});
document.addEventListener('keydown',ev=>{if(ev.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){ev.preventDefault();$('search').focus();}});
$('unit-us').onclick=()=>setUnits('us');$('unit-metric').onclick=()=>setUnits('metric');
$('profile-select').onchange=ev=>{state.activeProfile=ev.target.value;applyProfile();save();renderPreferences();renderCalculator();toast('Working tank changed. Tank-volume inputs updated.');};
$('profiles-open').onclick=openProfile;$('edit-profile').onclick=openProfile;
$('profile-form').onsubmit=ev=>{ev.preventDefault();saveProfile();};$('new-profile').onclick=()=>saveProfile(true);
for(const id of ['settings-open','backup-open'])$(id).onclick=()=>$('settings-dialog').showModal();
$('guide-open').onclick=()=>$('guide-dialog').showModal();$('settings-guide').onclick=()=>{$('settings-dialog').close();$('guide-dialog').showModal();};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='aquarium-toolbox-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('import-status').textContent='Backup downloaded. Keep it somewhere you can find it.';};
$('import').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>100000)throw new Error('This file is too large for a toolbox backup.');const imported=validateBackup(JSON.parse(await file.text()));if(!window.confirm('Restore this backup? It will replace the saved tanks, favorites, and inputs in this toolbox.'))return;state=imported;save();renderPreferences();renderLibrary();renderCalculator();$('import-status').textContent='Backup restored.';}catch(err){$('import-status').textContent=`Could not restore: ${err.message}`;}finally{ev.target.value='';}};
$('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText($('share-url').value);$('copy-status').textContent='Link copied.';}catch{$('share-url').focus();$('share-url').select();$('copy-status').textContent='Select and copy the link above using your browser.';}};
window.addEventListener('hashchange',()=>{loadHash();renderPreferences();renderLibrary();renderCalculator();});
loadHash();renderPreferences();renderLibrary();renderCalculator();
if(!storageAvailable)toast('Saved settings could not be read. You can still calculate and export a backup.');
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('.details-area details')].map(el=>({el,open:el.open}));for(const {el}of printDetails)el.open=true;});
window.addEventListener('afterprint',()=>{for(const {el,open}of printDetails)el.open=open;});
