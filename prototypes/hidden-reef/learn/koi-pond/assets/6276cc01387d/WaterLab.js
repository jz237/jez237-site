import {ammoniaFraction,oxygenSaturation} from './PondChemistry.js';
import {colors,format,lineChart,timeSeries,ammoniaCurve,oxygenCurve,compareSystems} from './WaterCharts.js';
const citation=(url,text)=>`<a href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
const ammoniaSource=citation('https://ask.ifas.ufl.edu/publication/FA031','UF/IFAS · ammonia and nitrification');
const oxygenSource=citation('https://ask.ifas.ufl.edu/publication/FA002','UF/IFAS · dissolved oxygen');
const bufferSource=citation('https://www.usgs.gov/water-science-school/science/alkalinity-and-water','USGS · alkalinity');
const hardnessSource=citation('https://www.usgs.gov/water-science-school/science/hardness-water','USGS · hardness');
const tabs=[['trends','Trends'],['sensitivity','pH & heat'],['compare','Compare'],['learn','Understand']];

export function waterMarkup(){return `<p class="eyebrow">WATER LAB · INTERACTIVE LEARNING</p>
  <h2 id="panel-title" tabindex="-1">Water tells a story.</h2><p class="water-intro">Change a condition. Follow the chemistry. See why the details matter.</p>
  <div id="water-metrics" class="water-dashboard"></div>
  <div class="water-controls"><details id="water-settings"><summary>Experiment settings <span id="water-settings-summary"></span></summary>
    <div class="water-sliders"><div><label for="temperature">Temperature <output id="temperature-value"></output></label><input id="temperature" type="range" min="10" max="32" step="1"></div><div><label for="ph">Sample pH <output id="ph-value"></output></label><input id="ph" type="range" min="6.5" max="9" step=".1"></div></div>
    <div class="water-actions"><button id="aeration"></button><button id="filter"></button><button id="waste">Extra food</button><button id="change">25% water change</button></div>
    </details><div class="water-actions water-time"><span id="water-hour"></span><button id="advance" class="primary">+6 hours</button><button id="advance-day">+24 hours</button><button id="reset">Reset lab</button></div>
  </div>
  <p class="water-model-note">Learning model · not live pond readings or a treatment calculator.</p>
  <div class="water-tabs" role="tablist" aria-label="Explore water chemistry">${tabs.map(([id,label])=>`<button id="water-tab-${id}" role="tab" aria-controls="water-results" aria-selected="${id==='trends'}" tabindex="${id==='trends'?0:-1}" data-water-tab="${id}">${label}</button>`).join('')}</div>
  <details id="water-inspector"><summary>Inspect recorded samples</summary><label for="water-sample">Choose a sample <output id="water-sample-hour"></output></label><input type="range" id="water-sample" min="0" step="1"><div id="water-sample-values"></div></details>
  <div id="water-results" role="tabpanel" aria-labelledby="water-tab-trends" tabindex="0"></div>
  <p id="water-announcement" class="sr-only" role="status" aria-live="polite"></p>`;}

function metrics(lab){const s=lab.state,metric=(label,value,unit,note)=>`<div class="water-stat"><small>${label}</small><strong>${value}<em>${unit}</em></strong><span>${note}</span></div>`;
  return metric('Dissolved oxygen',s.oxygen.toFixed(1),'mg/L',`${Math.round(100*s.oxygen/oxygenSaturation(s.temperature))}% of estimated saturation`)+metric('Total ammonia',format(s.ammonia),'mg/L N','NH₃ + NH₄⁺ · TAN')+metric('Nitrite',format(s.nitrite),'mg/L N','Intermediate nitrogen waste')+metric('Un-ionized NH₃',format(lab.unionized),'mg/L N',`${(100*ammoniaFraction(s.temperature,s.pH)).toFixed(2)}% of total ammonia`);
}

function trends(lab,index){const h=lab.history,point=h[index]||h.at(-1),series=(key,label)=>timeSeries(h,key,label,colors[key]),common={inspectX:point.hour};
  return `<div class="water-insight"><strong>Hour ${lab.hours} · ${lab.aeration?'Aeration on':'Aeration off'} / ${lab.filter?'Biofilter on':'Biofilter off'}</strong><p>${lab.message}</p></div>
    ${h.length===1?'<p class="water-empty">This is your starting sample. Choose <b>+6 hours</b> to draw a trend, or <b>Compare</b> to explore two possible outcomes.</p>':''}
    ${lineChart({id:'oxygen-history',title:'Oxygen through time',unit:'mg/L',series:[series('oxygen','Dissolved oxygen'),timeSeries(h,'saturation','Estimated saturation',colors.saturation,true)],reference:5,referenceLabel:'5 mg/L caution reference',...common})}
    <p class="chart-note">Saturation estimates the oxygen freshwater can hold at this temperature near sea level. It is not a safety threshold. ${oxygenSource}</p>
    ${lineChart({id:'nitrogen-history',title:'Ammonia and nitrite',unit:'mg/L as nitrogen',series:[series('ammonia','TAN'),series('nitrite','Nitrite')],...common})}
    <p class="chart-note">Aim for no detectable ammonia or nitrite in a real pond. The model’s small starting values make changes visible; they are not recommended targets.</p>
    <details class="water-detail"><summary>More trends: nitrate and alkalinity</summary>
    ${lineChart({id:'nitrate-history',title:'Nitrate accumulation',unit:'mg/L as nitrogen',series:[series('nitrate','Nitrate')],...common})}
    <p class="chart-note">A functioning biofilter changes the form of nitrogen; it does not remove all nitrogen from the water. Nitrate is plotted separately so its larger values do not flatten the ammonia lines.</p>
    ${lineChart({id:'alkalinity-history',title:'Alkalinity used by nitrification',unit:'mg/L as CaCO₃',series:[series('alkalinity','Alkalinity')],...common})}
    <p class="chart-note">The model tracks a declining buffer reserve, but holds pH at your selected sample value. It does not calculate a pH crash. ${bufferSource}</p></details>
    ${sampleLog(lab)}`;
}

function sensitivity(lab){const s=lab.state,share=100*ammoniaFraction(s.temperature,s.pH),warmer=oxygenSaturation(s.temperature),raisedPH=Math.min(9,s.pH+.5),raised=100*ammoniaFraction(s.temperature,raisedPH);
  return `<div class="water-insight"><strong>Same total ammonia. Different chemical balance.</strong><p>At ${s.temperature}°C and pH ${s.pH.toFixed(1)}, <b>${share.toFixed(2)}%</b> of TAN is un-ionized NH₃. Open <b>Experiment settings</b> to change pH or temperature.</p></div>
    ${lineChart({id:'ammonia-ph',title:'The ammonia share changes with pH',unit:'% of TAN present as NH₃',xLabel:'Sample pH',xDomain:[6.5,9],yMax:50,inspectX:s.pH,series:[{label:`Response at ${s.temperature}°C`,color:colors.ammonia,points:ammoniaCurve(s.temperature),legend:false},{label:'Selected sample (%)',color:'#244c39',points:[{x:s.pH,y:share}]}]})}
    <div class="ammonia-share" role="img" aria-label="${share.toFixed(2)} percent un-ionized ammonia, ${(100-share).toFixed(2)} percent ammonium"><span style="width:${share}%"></span></div><div class="share-label"><span>NH₃ ${share.toFixed(2)}%</span><span>NH₄⁺ ${(100-share).toFixed(2)}%</span></div>
    <p class="chart-note">${raisedPH>s.pH?`At pH ${raisedPH.toFixed(1)}, the share would be ${raised.toFixed(2)}% at the same temperature and TAN.`:'You are at the top of this explorer’s pH range.'} This describes chemistry, not a recommendation to adjust pH. ${ammoniaSource}</p>
    <div class="water-equation"><small>THIS SAMPLE</small><b>${format(s.ammonia)} × ${(share/100).toFixed(4)} ≈ ${format(lab.unionized)}</b><span>TAN × NH₃ fraction = un-ionized NH₃ · mg/L N · rounded values</span></div>
    ${lineChart({id:'oxygen-temperature',title:'Warm water holds less oxygen',unit:'Approximate freshwater saturation · mg/L',xLabel:'Water temperature (°C)',xDomain:[10,32],yMax:12,inspectX:s.temperature,series:[{label:'Saturation curve',color:colors.oxygen,points:oxygenCurve(),legend:false},{label:'At your temperature (mg/L)',color:'#244c39',points:[{x:s.temperature,y:warmer}]}]})}
    <p class="chart-note">Temperature changes update this equilibrium estimate immediately; the model’s actual oxygen reading changes as you advance time. Pressure, salinity and elevation also affect real saturation. ${oxygenSource}</p>`;
}

function comparison(lab,system){const {on,off,start,end}=compareSystems(lab,system),air=system==='aeration',key=air?'oxygen':'ammonia',unit=air?'mg/L oxygen':'mg/L as nitrogen',delta=on.state[key]-off.state[key];
  return `<div class="water-choice" role="group" aria-label="Comparison type"><button data-comparison="aeration" aria-pressed="${air}">Compare aeration</button><button data-comparison="filter" aria-pressed="${!air}">Compare biofilter</button></div>
    <div class="water-insight"><strong>Two futures from the same sample.</strong><p>Both start at hour ${start}, ${lab.state.temperature}°C and pH ${lab.state.pH.toFixed(1)}. Only ${air?'aeration':'biofilter processing'} differs. Your current sample and history stay unchanged.</p></div>
    ${lineChart({id:'system-comparison',title:`Next 24 hours · ${air?'oxygen':'total ammonia'}`,unit,xDomain:[start,end],series:[timeSeries(on.history,key,`${air?'Aeration':'Biofilter'} on`,colors.on),timeSeries(off.history,key,`${air?'Aeration':'Biofilter'} off`,colors.off,true)],...(air?{reference:5,referenceLabel:'5 mg/L caution reference'}:{})})}
    <div class="comparison-numbers"><div><small>ON AT HOUR ${end}</small><strong>${format(on.state[key])}</strong><span>${unit}</span></div><div><small>OFF AT HOUR ${end}</small><strong>${format(off.state[key])}</strong><span>${unit}</span></div></div>
    <p class="chart-note">In this example, switching ${air?'aeration':'the biofilter'} on produces ${format(Math.abs(delta))} ${unit} ${delta>=0?'more':'less'} after 24 hours. ${air?'Fish and microbes still consume oxygen when the air supply stops.':'Ammonia can accumulate even when fish are not being fed.'}</p>
    <p class="fine">This is a controlled teaching comparison, not a prediction for a real pond. Other settings stay fixed and no additional food or water changes occur during the comparison. ${air?oxygenSource:ammoniaSource}</p>`;
}

function sampleLog(lab){return `<details class="water-detail"><summary>Read the sample log · ${lab.history.length} ${lab.history.length===1?'record':'records'}</summary><p class="fine">Times are simulation hours. Changes made at the same hour appear separately. The most recent 97 records are retained.</p><div class="water-table-wrap" tabindex="0" role="region" aria-label="Water sample log, scroll horizontally for all columns"><table><caption>Model samples · nitrogen values in mg/L N</caption><thead><tr><th>Hour</th><th>Event</th><th>°C</th><th>pH</th><th>O₂<br>mg/L</th><th>TAN</th><th>Nitrite</th><th>Nitrate</th><th>KH<br>mg/L CaCO₃</th></tr></thead><tbody>${lab.history.map(s=>`<tr><td>${s.hour}</td><td>${s.event}</td><td>${s.temperature}</td><td>${s.pH.toFixed(1)}</td><td>${s.oxygen.toFixed(2)}</td><td>${format(s.ammonia)}</td><td>${format(s.nitrite)}</td><td>${format(s.nitrate)}</td><td>${s.alkalinity.toFixed(1)}</td></tr>`).join('')}</tbody></table></div></details>`;}

function explanation(lab){const change=lab.lastChange;
  return `<section class="water-lesson"><h3>Follow the nitrogen</h3><div class="nitrogen-steps"><div><b>01</b><strong>Ammonia</strong><span>Fish waste and decomposition</span></div><i>→</i><div><b>02</b><strong>Nitrite</strong><span>First oxidation step</span></div><i>→</i><div><b>03</b><strong>Nitrate</strong><span>Second oxidation step</span></div></div>
    <p>Nitrifying microbes need oxygen and alkalinity. Mechanical filtration removes solids; biological filtration processes dissolved waste. They do different jobs. ${ammoniaSource}</p></section>
    <section class="water-lesson"><h3>pH is a reading. Alkalinity is a reserve.</h3><p>Alkalinity measures acid-neutralizing capacity and helps resist pH shifts. GH (general hardness) mainly reflects calcium and magnesium. Neither is interchangeable with pH. Track trends and test source water before making adjustments. ${bufferSource} · ${hardnessSource}</p><p class="fine">Alkalinity here is reported as mg/L CaCO₃. About 17.85 mg/L CaCO₃ equals one degree of carbonate hardness (dKH); your current ${lab.state.alkalinity.toFixed(1)} mg/L is approximately ${(lab.state.alkalinity/17.85).toFixed(2)} dKH.</p></section>
    <section class="water-lesson"><h3>What does a 25% water change do?</h3><p>With zero waste in the replacement water, one 25% change leaves 75% of the original concentration. Two successive 25% changes leave 56.25%, not 50%. Filtration and new waste can change the result between real water changes.</p>
    <div class="dilution-bars" role="img" aria-label="Original waste 100 percent; one 25 percent water change leaves 75 percent; two leave 56.25 percent">${[['Before',100],['One change',75],['Two changes',56.25]].map(([label,v])=>`<div><span>${label}</span><i><b style="width:${v}%"></b></i><strong>${v}%</strong></div>`).join('')}</div>
    ${change?`<div class="water-insight"><strong>Your last change · hour ${change.hour}</strong><p>TAN ${format(change.before.ammonia)} → ${format(change.after.ammonia)} mg/L N. Nitrate ${format(change.before.nitrate)} → ${format(change.after.nitrate)} mg/L N.</p></div>`:'<p class="fine">Use “25% water change” above to see before-and-after values from your own scenario.</p>'}
    <p class="fine">This model assumes prepared replacement water: zero nitrogen waste, oxygen 8.5 mg/L and alkalinity 110 mg/L CaCO₃. Temperature and pH stay fixed. Real replacement water must be tested and appropriately conditioned.</p></section>
    <section class="water-lesson"><h3>Read the units before comparing tests</h3><p>The charts track nitrogen mass: <b>mg/L as N</b>. Some test kits report the full ion instead. For the same sample, nitrate as NO₃⁻ is approximately nitrate-N × 4.43; nitrite as NO₂⁻ is nitrite-N × 3.29. Check the kit’s instructions before comparing values.</p><p class="fine">For example, this sample’s ${format(lab.state.nitrate)} mg/L nitrate-N equals approximately ${(lab.state.nitrate*4.43).toFixed(2)} mg/L as nitrate ion. Changing units does not change the water.</p></section>
    <details class="water-detail" open><summary>What this lab does—and what it leaves out</summary><p>Food increases the organic waste pool. Advancing time models decomposition, fish waste, nitrification, oxygen use, gas exchange and a small fixed nitrate uptake. Processing rates illustrate relationships; they are not calibrated to this garden’s fish or water volume.</p><p>pH is a sample you select. The lab does not solve carbonate equilibrium, bacterial colony growth, day/night photosynthesis, salinity, medications or disease. Switching the biofilter on assumes an established working filter; a new or damaged real filter cannot necessarily recover instantly.</p><p>The pond’s visible weather and feeding animation do not change these lab controls. Reset returns the original example, not an ideal target for every koi pond.</p></details>
    ${sampleLog(lab)}`;
}

export function bindWaterLab(body,lab){let view='trends',system='aeration',sample=lab.history.length-1;
  const $=id=>body.querySelector('#'+id),results=$('water-results');
  function draw(){results.innerHTML=view==='trends'?trends(lab,sample):view==='sensitivity'?sensitivity(lab):view==='compare'?comparison(lab,system):explanation(lab);
    results.setAttribute('aria-labelledby','water-tab-'+view);$('water-inspector').hidden=view!=='trends';
    for(const b of body.querySelectorAll('[data-comparison]'))b.onclick=()=>{system=b.dataset.comparison;draw();body.querySelector(`[data-comparison="${system}"]`).focus({preventScroll:true});};
  }
  function inspect(){const s=lab.history[sample]||lab.history.at(-1);$('water-sample-hour').textContent=`Hour ${s.hour} · ${s.event}`;
    $('water-sample-values').textContent=`O₂ ${s.oxygen.toFixed(2)} mg/L · TAN ${format(s.ammonia)} · Nitrite ${format(s.nitrite)} mg/L N`;}
  function refresh(){const s=lab.state;$('water-metrics').innerHTML=metrics(lab);$('temperature').value=s.temperature;$('ph').value=s.pH;
    $('temperature-value').value=`${s.temperature}°C / ${Math.round(s.temperature*1.8+32)}°F`;$('ph-value').value=s.pH.toFixed(1);
    for(const [id,name]of [['aeration','Aeration'],['filter','Biofilter']]){$(id).textContent=`${name} ${lab[id]?'on':'off'}`;$(id).setAttribute('aria-pressed',String(lab[id]));}
    $('water-settings-summary').textContent=`${s.temperature}°C · pH ${s.pH.toFixed(1)} · air ${lab.aeration?'on':'off'} · filter ${lab.filter?'on':'off'}`;
    $('water-hour').textContent=`Hour ${lab.hours}`;$('water-sample').max=Math.max(0,lab.history.length-1);sample=Math.min(sample,lab.history.length-1);$('water-sample').value=sample;$('water-sample').disabled=lab.history.length<2;inspect();draw();}
  function change(action,message){action();sample=lab.history.length-1;refresh();$('water-announcement').textContent=`${message}. Hour ${lab.hours}. Oxygen ${lab.state.oxygen.toFixed(1)} milligrams per liter.`;}
  for(const [id,key]of [['temperature','temperature'],['ph','pH']]){$(id).oninput=e=>{lab.state[key]=Number(e.target.value);refresh();};$(id).onchange=()=>change(()=>lab.record(id==='ph'?'pH changed':'Temperature changed'),'Sample updated');}
  for(const id of ['aeration','filter'])$(id).onclick=()=>change(()=>{lab[id]=!lab[id];lab.record(`${id==='filter'?'Biofilter':'Aeration'} ${lab[id]?'on':'off'}`);},'System setting changed');
  $('advance').onclick=()=>change(()=>lab.advance(6),'Advanced six hours');$('advance-day').onclick=()=>change(()=>lab.advance(24),'Advanced twenty-four hours');
  $('waste').onclick=()=>change(()=>lab.feed(),'Added food to the model');$('change').onclick=()=>change(()=>lab.waterChange(),'Replaced twenty-five percent of the model water');$('reset').onclick=()=>change(()=>lab.reset(),'Lab reset');
  $('water-sample').oninput=e=>{sample=Number(e.target.value);inspect();draw();};
  const buttons=[...body.querySelectorAll('[data-water-tab]')];
  function select(b){view=b.dataset.waterTab;for(const t of buttons){const chosen=t===b;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;}draw();}
  for(const [index,b]of buttons.entries()){b.onclick=()=>select(b);b.onkeydown=e=>{const next=e.key==='ArrowRight'?(index+1)%4:e.key==='ArrowLeft'?(index+3)%4:e.key==='Home'?0:e.key==='End'?3:-1;if(next>=0){e.preventDefault();buttons[next].focus();select(buttons[next]);}};}
  refresh();
}
