// The kayak fish finder, earned late from the journal and off by default: depth and water
// temperature under the hull, a scrolling bottom contour, and arches for fish that pass through
// the cone. The model is a ring of columns (pure, tested); drawing needs a 2D canvas.
export const SONAR={columns:96,coneRadius:3.5,interval:.5,maxDepth:8};
export function createSonar(){return {cols:[],clock:0,depth:0,tempF:0,on:false};}
// one column every half second: bed depth under the hull and the depths of any fish inside the cone
export function pushColumn(s,depth,fishDepths){s.cols.push({depth,fish:fishDepths.slice(0,6)});if(s.cols.length>SONAR.columns)s.cols.shift();return s.cols.length;}
export function tickSonar(s,dt,{depth,tempF,fish=[],kayak={x:0,z:0}}){
 s.depth=depth;s.tempF=tempF;s.clock+=dt;if(s.clock<SONAR.interval)return false;s.clock=0;
 const inCone=fish.filter(f=>Math.hypot(f.x-kayak.x,f.z-kayak.z)<=SONAR.coneRadius&&f.depth>.2&&f.depth<depth).map(f=>f.depth).sort((a,b)=>a-b);
 pushColumn(s,depth,inCone);return true;
}
// draw onto a 2D context: LCD look, bottom filled, arches as short bright marks
export function drawSonar(s,g,w,h){
 g.fillStyle='#08201d';g.fillRect(0,0,w,h);const n=SONAR.columns,cw=w/n,scale=(h-14)/SONAR.maxDepth;
 g.strokeStyle='#1f4a40';g.lineWidth=1;for(let d=2;d<SONAR.maxDepth;d+=2){const y=d*scale;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
 const off=n-s.cols.length;
 g.fillStyle='#c98a3a';for(let i=0;i<s.cols.length;i++){const c=s.cols[i];const x=(off+i)*cw;const y=Math.min(h,c.depth*scale);g.fillRect(x,y,cw+.5,h-y);}
 g.fillStyle='#e9e2c4';for(let i=0;i<s.cols.length;i++){const c=s.cols[i];const x=(off+i)*cw;for(const d of c.fish){const y=d*scale;g.beginPath();g.arc(x+cw/2,y,cw*1.2,Math.PI,0);g.fill();}}
 g.fillStyle='#e9e2c4';g.font='bold 12px monospace';g.textAlign='left';g.fillText(`${s.depth.toFixed(1)} m`,6,14);g.textAlign='right';g.fillText(`${Math.round(s.tempF)}°F`,w-6,14);g.textAlign='left';
}
export function sonarSummary(s){const last=s.cols[s.cols.length-1];return {depth:+s.depth.toFixed(2),tempF:Math.round(s.tempF),columns:s.cols.length,fishInLast:last?last.fish.length:0,on:s.on};}
