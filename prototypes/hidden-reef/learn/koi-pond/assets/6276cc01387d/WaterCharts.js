import {ammoniaFraction,oxygenSaturation} from './PondChemistry.js';
export const colors={oxygen:'#256a81',saturation:'#899c9c',ammonia:'#b45f28',nitrite:'#805192',nitrate:'#39794e',alkalinity:'#8a6f2c',on:'#286f58',off:'#b56332'};
export const format=(v)=>Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):Math.abs(v)>=1?v.toFixed(2):v===0?'0':Math.abs(v)<.001?v.toExponential(1):v.toFixed(3);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ceiling(v){const power=10**Math.floor(Math.log10(Math.max(v,.001))),n=v/power;return ([1,2,4,5,10].find(k=>k>=n)||10)*power;}
export function chartGeometry(series,{xDomain,yMax,reference}={}){
  const points=series.flatMap(s=>s.points),xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  let min=xDomain?.[0]??Math.min(...xs),max=xDomain?.[1]??Math.max(...xs);
  if(!Number.isFinite(min))min=0;if(!Number.isFinite(max)||max<=min)max=min+6;
  const top=yMax??ceiling(Math.max(.01,...ys,reference??0)*1.08);
  return {min,max,top,x:n=>48+(n-min)/(max-min)*396,y:n=>166-n/top*126};
}
export function lineChart({id,title,unit,series,xLabel='Simulation hour',xDomain,yMax,reference,referenceLabel,inspectX}){
  const g=chartGeometry(series,{xDomain,yMax,reference}),ticks=Array.from({length:5},(_,i)=>i/4);
  const paths=series.map(s=>`<path d="${s.points.map((p,i)=>`${i?'L':'M'}${g.x(p.x).toFixed(2)},${g.y(p.y).toFixed(2)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.6" ${s.dash?'stroke-dasharray="7 4"':''} stroke-linejoin="round"/>${s.points.length===1?`<circle cx="${g.x(s.points[0].x)}" cy="${g.y(s.points[0].y)}" r="3.5" fill="${s.color}"/>`:''}`);
  const inspection=Number.isFinite(inspectX)?`<line class="sample-line" x1="${g.x(inspectX)}" x2="${g.x(inspectX)}" y1="37" y2="166" stroke="#3c584f" stroke-dasharray="2 4"/>`:'';
  return `<figure class="water-figure"><figcaption><strong>${escape(title)}</strong><span>${escape(unit)}</span></figcaption>
    <svg class="water-chart" viewBox="0 0 468 208" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(series.map(s=>`${s.label}: last plotted value ${format(s.points.at(-1)?.y??0)} ${unit}`).join('. '))}. Horizontal axis: ${escape(xLabel)} ${format(g.min)} to ${format(g.max)}.</desc>
    ${ticks.map(t=>`<line x1="48" x2="444" y1="${g.y(g.top*t)}" y2="${g.y(g.top*t)}" stroke="#d6dfd5"/><text x="39" y="${g.y(g.top*t)+4}" text-anchor="end">${format(g.top*t)}</text><text x="${g.x(g.min+(g.max-g.min)*t)}" y="184" text-anchor="middle">${Number((g.min+(g.max-g.min)*t).toFixed(1))}</text>`).join('')}
    ${reference!==undefined?`<line x1="48" x2="444" y1="${g.y(reference)}" y2="${g.y(reference)}" stroke="#b68653" stroke-dasharray="4 5"/><text x="442" y="${g.y(reference)-6}" text-anchor="end" class="reference-label">${escape(referenceLabel||'Reference')}</text>`:''}
    ${paths.join('')}${inspection}<text x="246" y="204" text-anchor="middle">${escape(xLabel)}</text></svg>
    <div class="water-legend">${series.filter(s=>s.legend!==false).map(s=>`<span><i style="--line:${s.color};${s.dash?'border-top-style:dashed':''}"></i>${escape(s.label)} <b>${format(s.points.at(-1)?.y??0)}</b></span>`).join('')}</div></figure>`;
}
export const timeSeries=(history,key,label,color,dash=false)=>({label,color,dash,points:history.map(s=>({x:s.hour,y:s[key]}))});
export function ammoniaCurve(temperature){return Array.from({length:51},(_,i)=>{const x=6.5+i*.05;return {x,y:100*ammoniaFraction(temperature,x)};});}
export function oxygenCurve(){return Array.from({length:45},(_,i)=>({x:10+i*.5,y:oxygenSaturation(10+i*.5)}));}
export function compareSystems(lab,system='aeration',hours=24){
  if(!['aeration','filter'].includes(system))throw new Error('Unknown comparison');
  const on=lab.fork(),off=lab.fork();on[system]=true;off[system]=false;
  // Record the changed setting at the same initial concentration, then simulate both equally.
  on.history=[];off.history=[];on.record('Enabled');off.record('Disabled');on.advance(hours);off.advance(hours);
  return {on,off,start:lab.hours,end:lab.hours+hours};
}
