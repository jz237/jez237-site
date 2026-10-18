// Vector rendering keeps the source layout sharp at the host's full resolution.
const NS='http://www.w3.org/2000/svg';let nextView=0;
const finite=(v,n)=>{if(!Number.isFinite(v))throw new RangeError(`Invalid records ${n}`);return v;};
const timeText=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;

/** The host resolves label tokens with their font/variant context and supplies
 * high-resolution rider portraits. Tokens can repeat across source font banks.
 * No fallback avatar or record is invented. Preparation is detached: an invalid
 * late command leaves the previous visible frame and its accessible name intact.
 */
export function createNativeRecordsView({parent,labelForToken,renderRider,formatTime=timeText}={}){
 if(!parent?.ownerDocument||typeof labelForToken!=='function'||typeof formatTime!=='function')throw new TypeError('Records view needs a parent and text resolvers');
 const doc=parent.ownerDocument,prefix=`records-${++nextView}`;
 const node=(tag,attrs={},text)=>{const e=doc.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=text;return e;};
 const root=node('svg',{viewBox:'0 0 320 240',preserveAspectRatio:'xMidYMid meet',role:'img','aria-label':'Course records',width:'100%',height:'100%'});
 root.style.cssText='display:block;overflow:hidden;font-family:Arial,Helvetica,sans-serif;isolation:isolate';parent.append(root);
 function render(frame){
  if(!Array.isArray(frame?.commands))throw new TypeError('Supply prepared records commands');
  const content=node('g'),defs=node('defs'),gradient=node('linearGradient',{id:`${prefix}-panel`,x1:'0%',y1:'0%',x2:'0%',y2:'100%'});
  gradient.append(node('stop',{offset:0,'stop-color':'#21475d','stop-opacity':.96}),node('stop',{offset:1,'stop-color':'#091b2d','stop-opacity':.96}));defs.append(gradient);
  let current=content,serial=0,mode=0,fill=[0,0,0,255],previewBounds=[];
  const addText=(font,value,x,y)=>{
   if(typeof value!=='string')throw new TypeError('Records text resolver must return text');
   const sizes=[6.5,8,10,14];if(!Object.hasOwn(sizes,font))throw new RangeError('Unknown records font');
   current.append(node('text',{x:finite(x,'text x'),y:finite(y,'text y'),'dominant-baseline':'hanging','font-size':sizes[font],'font-weight':font===3?800:600,
    'font-variant-numeric':'tabular-nums',fill:mode===6?'#81e7ff':mode===7?'#8c9fa9':'#f2fafc'},value==="-'--@---"?'—:——.———':value));
  };
  for(const c of frame.commands){
   if(c.kind==='panel')current.append(node('rect',{x:finite(c.x,'panel x'),y:finite(c.y,'panel y'),width:finite(c.width,'panel width'),height:finite(c.height,'panel height'),rx:2.5,fill:`url(#${prefix}-panel)`,stroke:'#90c8dc','stroke-opacity':.4,'stroke-width':.6}));
   else if(c.kind==='style'){
    if(!Number.isInteger(c.mode)||!Array.isArray(c.colors)||c.colors.length!==12||c.colors.some(v=>!Number.isInteger(v)||v<0||v>255))throw new RangeError('Invalid records text style');mode=c.mode;
   }else if(c.kind==='label')addText(c.font,labelForToken(c.token,{font:c.font,variant:c.variant}),c.x,c.y);
   else if(c.kind==='text')addText(c.font,c.text,c.x,c.y);
   else if(c.kind==='time')addText(c.font,formatTime(c.value),c.x,c.y);
   else if(c.kind==='score')addText(c.font,String(finite(c.value,'score')),c.x,c.y);
   else if(c.kind==='fillColor'){
    if(!Array.isArray(c.rgba)||c.rgba.length!==4||c.rgba.some(v=>!Number.isInteger(v)||v<0||v>255))throw new RangeError('Invalid records fill color');fill=c.rgba;previewBounds=[];
   }else if(c.kind==='fill'){
    const bounds={x:finite(c.x1,'fill x'),y:finite(c.y1,'fill y'),width:finite(c.x2,'fill right')-c.x1,height:finite(c.y2,'fill bottom')-c.y1};
    current.append(node('rect',{...bounds,rx:1.5,fill:`rgb(${fill.slice(0,3).join(',')})`,opacity:fill[3]/255}));previewBounds.push(bounds);
   }else if(c.kind==='clip'){
    const id=`${prefix}-clip-${serial++}`,clip=node('clipPath',{id});clip.append(node('rect',{x:finite(c.x1,'clip x'),y:finite(c.y1,'clip y'),width:finite(c.x2,'clip right')-c.x1,height:finite(c.y2,'clip bottom')-c.y1}));defs.append(clip);
    current=node('g',{'clip-path':`url(#${id})`});content.append(current);
   }else if(c.kind==='arrow'){
    if(!['up','down'].includes(c.direction))throw new RangeError('Invalid records arrow');
    const x1=finite(c.x1,'arrow left'),x2=finite(c.x2,'arrow right'),y1=finite(c.y1,'arrow top'),y2=finite(c.y2,'arrow bottom');
    current.append(node('path',{d:c.direction==='up'?`M${x1} ${y2} L${(x1+x2)/2} ${y1} L${x2} ${y2} Z`:`M${x1} ${y1} L${(x1+x2)/2} ${y2} L${x2} ${y1} Z`,fill:'#81e7ff'}));
   }else if(c.kind==='riderPreview'){
    if(typeof renderRider!=='function')throw new TypeError('Records view requires a rider preview consumer');
    if(!Number.isInteger(c.viewportIndex)||c.viewportIndex<0||c.viewportIndex>7||!Number.isInteger(c.avatarIndex)||c.avatarIndex<0)throw new RangeError('Invalid records rider preview');
    const bounds=previewBounds[c.viewportIndex%4];if(!bounds)throw new RangeError('Missing records rider preview bounds');
    const el=renderRider({avatarIndex:c.avatarIndex,viewportIndex:c.viewportIndex,bounds:{...bounds},document:doc});
    if(!el||el.namespaceURI!==NS)throw new TypeError('Rider preview consumer must return an SVG element');
    const id=`${prefix}-rider-${serial++}`,clip=node('clipPath',{id});clip.append(node('rect',bounds));defs.append(clip);
    const group=node('g',{'clip-path':`url(#${id})`,'data-avatar-index':c.avatarIndex,'data-viewport-index':c.viewportIndex});group.append(el.cloneNode(true));current.append(group);
   }else throw new RangeError(`Unsupported records command ${c.kind}`);
  }
  const description=[...content.querySelectorAll('text')].map(e=>e.textContent).join(', ');
  root.replaceChildren(defs,content);root.dataset.panels=String(frame.panelSlots?.length??0);root.setAttribute('aria-label',`Course records. ${description}`);
 }
 return {root,render,clear(){root.replaceChildren();delete root.dataset.panels;root.setAttribute('aria-label','Course records');},destroy(){root.remove();}};
}
