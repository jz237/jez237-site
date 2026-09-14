// The lake map: the cove rasterised once from the bathymetry into depth bands, the cover drawn as
// small marks with labels, the journal's catches as clusters, the kayak as an arrow, a north arrow
// and a scale bar. Drawn on a 2D canvas inside a glass panel; the arithmetic lives in map-model.js.
import {mapFrame,worldToMap,depthBand,catchSpots,coverLine,FEATURE_LABEL} from './map-model.js';
const BAND={land:'#2b3a2a',fringe:'#56633b',shallow:'#3f8580',mid:'#2b6b6a',deep:'#1d5058',channel:'#153c48'};
const SPECIES_TINT={largemouth:'#8fc26b',smallmouth:'#b9a35a',walleye:'#d7c184',bluegill:'#7fb1c9',musky:'#9bd1a3',pickerel:'#a4c66b',striper:'#c9d3dc',catfish:'#b3b8c4',carp:'#d8b16a',crappie:'#d8dde0',perch:'#e0c24a',pumpkinseed:'#e59a5a'};
export function createLakeMap({bathy,features,span,res=240}){
 const raster=document.createElement('canvas');raster.width=res;raster.height=res;const rg=raster.getContext('2d');const img=rg.createImageData(res,res);const d=img.data;
 const hex=(h)=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const cols=Object.fromEntries(Object.entries(BAND).map(([k,v])=>[k,hex(v)]));
 for(let j=0;j<res;j++)for(let i=0;i<res;i++){const x=(i/(res-1)-.5)*span,z=(j/(res-1)-.5)*span;const h=bathy.height(x,z);let b=depthBand(h);if(b==='land'&&h<.9)b='fringe';const c=cols[b];const k=(j*res+i)*4;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255;}
 rg.putImageData(img,0,0);
 return {
  draw(ctx,w,h,{kayak,catches=[],hour}={}){
   const f=mapFrame(span,w,h);ctx.save();ctx.fillStyle='#0b1d22';ctx.fillRect(0,0,w,h);
   const side=span*f.s;ctx.imageSmoothingEnabled=true;ctx.drawImage(raster,f.ox-side/2,f.oy-side/2,side,side);
   // cover
   ctx.font='11px "DM Sans",Arial,sans-serif';ctx.textBaseline='middle';const labelled=[];
   for(const ft of features){const p=worldToMap(f,ft.x,ft.z);ctx.lineWidth=1.5;
    if(ft.type==='dock'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-(ft.yaw||0));ctx.fillStyle='#8a6a48';ctx.fillRect(-(ft.len||12)*f.s/2,-2,(ft.len||12)*f.s,4);ctx.restore();}
    else if(ft.type==='laydown'){ctx.strokeStyle='#8a6a48';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x-6,p.y+3);ctx.lineTo(p.x+7,p.y-4);ctx.stroke();}
    else if(ft.type==='weedbed'||ft.type==='pads'){ctx.strokeStyle=ft.type==='pads'?'#79b562':'#5c9a5a';ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(6,(ft.r||10)*f.s*.7),0,6.283);ctx.stroke();ctx.setLineDash([]);}
    else if(ft.type==='riprap'){ctx.fillStyle='#9aa0a6';for(let k=0;k<6;k++){const a=k/6*6.283;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*7,p.y+Math.sin(a)*4,1.6,0,6.283);ctx.fill();}}
    else if(ft.type==='stump'){ctx.fillStyle='#7a5a3a';for(let k=0;k<5;k++){const a=k/5*6.283+.4;ctx.fillRect(p.x+Math.cos(a)*6-1.5,p.y+Math.sin(a)*5-1.5,3,3);}}
    // one label per kind within 40 px, so a cluster of stumps reads as one field
    if(!labelled.some(l=>l.type===ft.type&&Math.hypot(l.x-p.x,l.y-p.y)<40)){labelled.push({type:ft.type,x:p.x,y:p.y});ctx.fillStyle='rgba(240,236,220,.85)';ctx.textAlign='left';ctx.fillText(FEATURE_LABEL[ft.type]||ft.type,p.x+11,p.y-8);}}
   // the journal's catches
   for(const s of catchSpots(catches,features)){const p=worldToMap(f,s.x,s.z);const r=4+Math.min(8,s.count*1.5);ctx.fillStyle=SPECIES_TINT[s.top]||'#e8c77a';ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(p.x,p.y,r,0,6.283);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1;ctx.stroke();
    if(s.count>1){ctx.fillStyle='#0b1d22';ctx.font='bold 9px "DM Sans",Arial,sans-serif';ctx.textAlign='center';ctx.fillText(String(s.count),p.x,p.y+.5);ctx.font='11px "DM Sans",Arial,sans-serif';}}
   // the kayak
   if(kayak){const p=worldToMap(f,kayak.x,kayak.z);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-(kayak.heading||0));ctx.fillStyle='#f3f1e8';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.restore();}
   // north arrow, scale bar
   ctx.strokeStyle='rgba(240,236,220,.85)';ctx.fillStyle='rgba(240,236,220,.85)';ctx.lineWidth=1.5;const nx=w-34,ny=34;ctx.beginPath();ctx.moveTo(nx,ny+14);ctx.lineTo(nx,ny-12);ctx.stroke();ctx.beginPath();ctx.moveTo(nx,ny-16);ctx.lineTo(nx-5,ny-6);ctx.lineTo(nx+5,ny-6);ctx.closePath();ctx.fill();ctx.font='bold 11px "DM Sans",Arial,sans-serif';ctx.textAlign='center';ctx.fillText('N',nx,ny+24);
   const bar=50*f.s;ctx.beginPath();ctx.moveTo(24,h-24);ctx.lineTo(24+bar,h-24);ctx.stroke();ctx.textAlign='left';ctx.font='10px "DM Sans",Arial,sans-serif';ctx.fillText('50 m',24,h-34);
   ctx.restore();return {spots:catchSpots(catches,features).length,features:features.length};},
  line(kayak){return kayak?coverLine(kayak,features):'';}
 };
}
