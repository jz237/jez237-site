// Vector presentation of the recovered ending layout. The viewBox expresses
// logical layout units, not a 320x240 raster or a change to the game's renderer.
const NS='http://www.w3.org/2000/svg';let nextView=0;
const timeText=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;
const finite=(v,n)=>{if(!Number.isFinite(v))throw new TypeError(`Invalid ending ${n}`);return v;};

/** Supply resolved label text and an SVG rider preview consumer. The latter
 * can display an authored portrait or a rendered high-resolution model. This
 * component never substitutes an invented driver for a missing source slot.
 * A failed late command leaves the preceding visible frame intact.
 */
export function createNativeEndingView({parent,labelForToken,renderRider,formatTime=timeText}={}){
 if(!parent?.ownerDocument||typeof labelForToken!=='function'||typeof formatTime!=='function')throw new TypeError('Ending view needs a parent and text resolvers');
 const doc=parent.ownerDocument,prefix=`ending-${++nextView}`;
 const node=(tag,attrs={},text)=>{const el=doc.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;};
 const root=node('svg',{viewBox:'0 0 320 240',preserveAspectRatio:'xMidYMid meet',role:'img','aria-label':'Championship results',width:'100%',height:'100%'});
 root.style.cssText='display:block;overflow:hidden;font-family:Arial,Helvetica,sans-serif;isolation:isolate';parent.append(root);
 function render(frame){
  if(!Array.isArray(frame?.commands))throw new TypeError('Supply prepared ending commands');
  const content=node('g'),defs=node('defs'),gradient=node('linearGradient',{id:`${prefix}-panel`,x1:0,y1:0,x2:0,y2:1});
  gradient.append(node('stop',{offset:0,'stop-color':'#21475d','stop-opacity':.96}),node('stop',{offset:1,'stop-color':'#091b2d','stop-opacity':.96}));defs.append(gradient);
  let current=content,clipCount=0,mode=0,intensity=255,fill=[0,0,0,255],previewBounds=[];
  const addText=(font,text,x,y,textMode=mode,alpha=textMode===10?intensity/255:1)=>{
   if(typeof text!=='string')throw new TypeError('Ending label resolver must return text');
   const sizes=[14,8,10];if(!Object.hasOwn(sizes,font))throw new RangeError('Unknown ending font');
   current.append(node('text',{x:finite(x,'text x'),y:finite(y,'text y'),'dominant-baseline':'hanging','font-size':sizes[font],'font-weight':font===0?800:600,
    'font-variant-numeric':'tabular-nums',fill:textMode===6?'#81e7ff':textMode===4?'#ffd88a':'#f2fafc',opacity:alpha},text));
  };
  for(const command of frame.commands){
   const c=command;
   if(c.kind==='panel'){
    const x=finite(c.x,'panel x'),y=finite(c.y,'panel y'),width=finite(c.width,'panel width'),height=finite(c.height,'panel height');
    current.append(node('rect',{x,y,width,height,rx:2.5,fill:`url(#${prefix}-panel)`,stroke:'#90c8dc','stroke-opacity':.4,'stroke-width':.6,opacity:finite(c.alpha,'panel alpha')/255}));
   }else if(c.kind==='style'){mode=c.mode;intensity=finite(c.intensity,'text intensity');}
   else if(c.kind==='label')addText(c.font,labelForToken(c.token),c.x,c.y);
   else if(c.kind==='time')addText(c.font,formatTime(c.value),c.x,c.y);
   else if(c.kind==='missingTime')addText(c.font,'—',c.x,c.y);
   else if(c.kind==='text')addText(c.font,c.text,c.x,c.y,c.mode);
   else if(c.kind==='fillColor'){
    if(!Array.isArray(c.rgba)||c.rgba.length!==4||c.rgba.some(v=>!Number.isFinite(v)||v<0||v>255))throw new RangeError('Invalid ending fill color');fill=c.rgba;
   }else if(c.kind==='fill'){
    const bounds={x:finite(c.x1,'fill x'),y:finite(c.y1,'fill y'),width:finite(c.x2,'fill right')-c.x1,height:finite(c.y2,'fill bottom')-c.y1};
    current.append(node('rect',{...bounds,rx:1.5,fill:`rgb(${fill.slice(0,3).join(',')})`,opacity:fill[3]/255}));previewBounds.push(bounds);
   }else if(c.kind==='clip'){
    const id=`${prefix}-clip-${clipCount++}`,clip=node('clipPath',{id});clip.append(node('rect',{x:finite(c.x1,'clip x'),y:finite(c.y1,'clip y'),width:finite(c.x2,'clip right')-c.x1,height:finite(c.y2,'clip bottom')-c.y1}));defs.append(clip);
    current=node('g',{'clip-path':`url(#${id})`});content.append(current);
   }else if(c.kind==='riderPreview'){
    if(typeof renderRider!=='function')throw new TypeError('Ending standings require a rider preview consumer');
    if(!Number.isInteger(c.viewportIndex)||c.viewportIndex<0||c.viewportIndex>3)throw new RangeError('Invalid ending rider viewport');
    const bounds=previewBounds.at(-4+c.viewportIndex);if(!bounds)throw new RangeError('Missing ending rider preview bounds');
    const el=renderRider({riderIndex:c.riderIndex,viewportIndex:c.viewportIndex,bounds:{...bounds},document:doc});
    if(!el||el.namespaceURI!==NS)throw new TypeError('Rider preview consumer must return an SVG element');
    const id=`${prefix}-rider-${clipCount++}`,clip=node('clipPath',{id});clip.append(node('rect',bounds));defs.append(clip);
    const group=node('g',{'clip-path':`url(#${id})`,'data-rider-index':c.riderIndex});group.append(el.cloneNode(true));current.append(group);
   }else if(c.kind!=='depthClear'&&c.kind!=='restoreColorTarget')throw new RangeError(`Unsupported ending command ${c.kind}`);
   // The high-resolution scene owns depth/color targets. They never clear the
   // SVG page or the underlying game canvas as a side effect of HUD drawing.
  }
  const description=[...content.querySelectorAll('text')].map(el=>el.textContent).join(', ');
  root.replaceChildren(defs,content);root.dataset.panels=String(frame.panelSlots?.length??0);root.setAttribute('aria-label',`Championship results. ${description}`);
 }
 return {root,render,clear(){root.replaceChildren();delete root.dataset.panels;root.setAttribute('aria-label','Championship results');},destroy(){root.remove();}};
}
