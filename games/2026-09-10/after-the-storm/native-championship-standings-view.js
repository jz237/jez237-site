// SVG preserves the original layout units at the host's full display size.
// It never changes the game canvas, resolution, textures or model detail.
const NS='http://www.w3.org/2000/svg';let nextView=0;
const timeText=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;
const finite=(v,n)=>{if(!Number.isFinite(v))throw new TypeError(`Invalid standings ${n}`);return v;};

/** Label and portrait consumers must resolve the source token/avatar. A
 * detached frame is committed only after every command succeeds. Portraits
 * may embed a high-resolution image/render; no substitute driver is invented.
 */
export function createNativeChampionshipStandingsView({parent,labelForToken,renderRider,formatTime=timeText}={}){
 if(!parent?.ownerDocument||typeof labelForToken!=='function'||typeof formatTime!=='function')throw new TypeError('Standings view needs a parent and text resolvers');
 const doc=parent.ownerDocument,prefix=`standings-${++nextView}`;
 const node=(tag,attrs={},text)=>{const el=doc.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;};
 const root=node('svg',{viewBox:'0 0 320 240',preserveAspectRatio:'xMidYMid meet',role:'img','aria-label':'Championship standings',width:'100%',height:'100%'});
 root.style.cssText='display:block;overflow:hidden;font-family:Arial,Helvetica,sans-serif;isolation:isolate';parent.append(root);
 function render(frame){
  if(!Array.isArray(frame?.commands))throw new TypeError('Supply prepared standings commands');
  const content=node('g'),defs=node('defs');
  for(const [mode,top,bottom]of [[0,'#21475d','#091b2d'],[2,'#204b62','#0b223b']]){
   const g=node('linearGradient',{id:`${prefix}-panel-${mode}`,x1:0,y1:0,x2:0,y2:1});
   g.append(node('stop',{offset:0,'stop-color':top,'stop-opacity':.96}),node('stop',{offset:1,'stop-color':bottom,'stop-opacity':.96}));defs.append(g);
  }
  let current=content,clipCount=0,mode=0,intensity=255,fill=[0,0,0,255];const previews=[];
  const addText=(font,text,x,y,textMode=mode,size)=>{
   if(typeof text!=='string')throw new TypeError('Standings resolver must return text');
   const sizes=[14,8,10];if(!Object.hasOwn(sizes,font))throw new RangeError('Unknown standings font');
   current.append(node('text',{x:finite(x,'text x'),y:finite(y,'text y'),'dominant-baseline':'hanging','font-size':size??sizes[font],
    'font-weight':font===0?800:600,'font-variant-numeric':'tabular-nums',fill:textMode===6?'#81e7ff':textMode===4?'#ffd88a':'#f2fafc',opacity:intensity/255},text));
  };
  for(const c of frame.commands){
   if(c.kind==='panel'){
    if(![0,2].includes(c.mode))throw new RangeError('Unknown standings panel style');
    current.append(node('rect',{x:finite(c.x,'panel x'),y:finite(c.y,'panel y'),width:finite(c.width,'panel width'),height:finite(c.height,'panel height'),
     rx:2.5,fill:`url(#${prefix}-panel-${c.mode})`,stroke:'#90c8dc','stroke-opacity':.4,'stroke-width':.6,opacity:finite(c.alpha,'panel alpha')/255}));
   }else if(c.kind==='style'){mode=c.mode;intensity=finite(c.intensity,'text intensity');}
   else if(c.kind==='label')addText(c.font,labelForToken(c.token,c.font,c.variant),c.x,c.y,mode,c.font===0?8:undefined);
   else if(c.kind==='time')addText(c.font,formatTime(c.value),c.x,c.y,c.mode);
   else if(c.kind==='number')addText(c.font,String(c.value),c.x,c.y);
   else if(c.kind==='text')addText(c.font,c.text,c.x,c.y,c.mode);
   else if(c.kind==='fillColor'){
    if(!Array.isArray(c.rgba)||c.rgba.length!==4||c.rgba.some(v=>!Number.isFinite(v)||v<0||v>255))throw new RangeError('Invalid standings fill color');fill=c.rgba;
   }else if(c.kind==='fill'){
    const b={x:finite(c.x1,'fill x'),y:finite(c.y1,'fill y'),width:finite(c.x2,'fill right')-c.x1,height:finite(c.y2,'fill bottom')-c.y1};
    current.append(node('rect',{...b,rx:1.5,fill:`rgb(${fill.slice(0,3).join(',')})`,opacity:fill[3]/255}));previews.push(b);
   }else if(c.kind==='clip'){
    const id=`${prefix}-clip-${clipCount++}`,clip=node('clipPath',{id});clip.append(node('rect',{x:finite(c.x1,'clip x'),y:finite(c.y1,'clip y'),width:finite(c.x2,'clip right')-c.x1,height:finite(c.y2,'clip bottom')-c.y1}));defs.append(clip);
    current=node('g',{'clip-path':`url(#${id})`});content.append(current);
   }else if(c.kind==='riderPreview'){
    if(typeof renderRider!=='function')throw new TypeError('Standings require a rider preview consumer');
    if(!Number.isInteger(c.viewportIndex)||c.viewportIndex<0||c.viewportIndex>3||!Number.isInteger(c.avatarIndex)||c.avatarIndex<0||c.avatarIndex>3)throw new RangeError('Invalid standings rider viewport/avatar');
    const bounds=previews[c.viewportIndex];if(!bounds)throw new RangeError('Missing standings rider preview bounds');
    const el=renderRider({avatarIndex:c.avatarIndex,viewportIndex:c.viewportIndex,bounds:{...bounds},document:doc});
    if(!el||el.namespaceURI!==NS)throw new TypeError('Rider preview consumer must return an SVG element');
    const id=`${prefix}-rider-${clipCount++}`,clip=node('clipPath',{id});clip.append(node('rect',bounds));defs.append(clip);
    const group=node('g',{'clip-path':`url(#${id})`,'data-avatar-index':c.avatarIndex});group.append(el.cloneNode(true));current.append(group);
   }else throw new RangeError(`Unsupported standings command ${c.kind}`);
  }
  const description=[...content.querySelectorAll('text')].map(el=>el.textContent).join(', ');
  root.replaceChildren(defs,content);root.dataset.panel=frame.panel??'';root.setAttribute('aria-label',`Championship standings. ${description}`);
 }
 return {root,render,clear(){root.replaceChildren();delete root.dataset.panel;root.setAttribute('aria-label','Championship standings');},destroy(){root.remove();}};
}
