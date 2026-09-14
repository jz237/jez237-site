// The share card: the rendered frame with the catch written on it, as a PNG you can save or
// share. The text layout is pure (tested); composing needs a 2D canvas and runs in the browser.
export const CARD={w:1280,h:720,pad:44,font:"'Libre Caslon Display',Georgia,serif",sans:"'DM Sans','Helvetica Neue',Arial,sans-serif"};
// what goes on a catch card, in order
export function catchCardLines(c){
 const lines=[];
 lines.push({size:16,text:(c.name?c.name.toUpperCase()+' · ':'')+'CATCH',color:'#e2c38e',tracking:.26});
 lines.push({size:64,text:c.species,color:'#ffffff',serif:true});
 lines.push({size:26,text:`${c.classLabel} · ${c.lengthIn} in · ${c.weightText}`,color:'#e3c18e'});
 lines.push({size:18,text:`${c.rig} · ${c.lure} · ${c.technique}${c.fought?' · fought '+c.fought+' s':''}`,color:'#d8e2df'});
 lines.push({size:18,text:`${c.time} · ${c.date} · ${c.weather}`,color:'#d8e2df'});
 return lines;
}
export function photoCardLines(p){return [{size:16,text:'FIRST LIGHT · KEYSTONE WATERS',color:'#e2c38e',tracking:.26},{size:22,text:`${p.place} · ${p.time} · ${p.date}${p.weather?' · '+p.weather:''}`,color:'#ffffff'}];}
export function footerText(){return 'FIRST LIGHT · Lake Nockamixon, Three Mile Run · jez237.com/games';}
// draw the frame, a dark panel bottom-left, the lines, and the footer
export function composeCard(frame,lines,{w=CARD.w,h=CARD.h,doc=globalThis.document}={}){
 const cv=doc.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');
 if(frame){const fw=frame.width||frame.naturalWidth||w,fh=frame.height||frame.naturalHeight||h;const s=Math.max(w/fw,h/fh);const dw=fw*s,dh=fh*s;g.drawImage(frame,(w-dw)/2,(h-dh)/2,dw,dh);}
 else{g.fillStyle='#0f2a2c';g.fillRect(0,0,w,h);}
 // measure the panel
 const pad=CARD.pad;let y=0;const gaps=[];for(const l of lines){gaps.push(l.size*1.35);y+=l.size*1.35;}
 const panelH=y+pad*1.4,panelW=Math.min(w-pad*2,760);const px=pad,py=h-pad-panelH;
 g.fillStyle='rgba(8,32,42,.82)';g.fillRect(px,py,panelW,panelH);g.strokeStyle='rgba(227,193,142,.4)';g.lineWidth=1;g.strokeRect(px+.5,py+.5,panelW-1,panelH-1);
 let ty=py+pad*.9;
 for(const l of lines){g.fillStyle=l.color||'#fff';g.font=`${l.serif?'400':'500'} ${l.size}px ${l.serif?CARD.font:CARD.sans}`;if(l.tracking&&g.letterSpacing!==undefined)g.letterSpacing=l.tracking+'em';else if(g.letterSpacing!==undefined)g.letterSpacing='0px';
  ty+=l.size;g.fillText(l.text,px+pad*.8,ty,panelW-pad*1.6);ty+=l.size*.35;}
 if(g.letterSpacing!==undefined)g.letterSpacing='0px';
 g.fillStyle='rgba(255,255,255,.75)';g.font=`500 14px ${CARD.sans}`;g.textAlign='right';g.fillText(footerText(),w-pad,h-pad*.55);g.textAlign='left';
 return cv;
}
export function cardBlob(cv){return new Promise(res=>cv.toBlob(b=>res(b),'image/png'));}
export function fileName(kind,c){const d=new Date();const stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;const sp=c&&c.species?c.species.toLowerCase().replace(/[^a-z]+/g,'-'):'lake';return `first-light-${kind}-${sp}-${stamp}.png`;}
// share if the device can, otherwise download
export async function deliver(blob,name,{nav=globalThis.navigator,doc=globalThis.document,download=true}={}){
 try{const file=new File([blob],name,{type:'image/png'});if(nav&&nav.canShare&&nav.canShare({files:[file]})){await nav.share({files:[file],title:'First Light',text:'A fish from Three Mile Run'});return 'shared';}}catch{}
 if(!download)return 'blob';
 const url=URL.createObjectURL(blob);const a=doc.createElement('a');a.href=url;a.download=name;doc.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1500);return 'downloaded';
}
