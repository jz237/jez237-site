/* Overload bestiary: original proportions, one lazy-loaded model at a time. */
(() => {
  'use strict';
  const start=document.getElementById('enemiesStart');if(!start)return;
  const $=id=>document.getElementById(id),cache=new Map(),pending=new Map();
  let dialog,canvas,gl,program,locations,frame=0,last=0,token=0,index=0,batches=[],textures=[],catalog=[],open=false;
  let yaw=-.35,pitch=.16,distance=2.8,rotating=!matchMedia('(prefers-reduced-motion: reduce)').matches,drag=null,loadCatalog;
  const state={index:0,id:null,ready:false,frames:0,error:null};
  function text(id,value){$(id).textContent=value;}
  function loadScript(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=()=>{s.remove();resolve();};s.onerror=()=>{s.remove();reject(Error('Unable to load this exhibit. Check your connection and try again.'));};document.head.append(s);});}
  window.astraEnemyParcel=(key,data)=>{if(!pending.has(key))return;cache.delete(key);cache.set(key,data);while(cache.size>10)cache.delete(cache.keys().next().value);pending.get(key).resolve(data);pending.delete(key);};
  function parcel(key){if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return Promise.resolve(value);}if(pending.has(key))return pending.get(key).promise;
    let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});pending.set(key,{promise,resolve,reject});
    loadScript('enemy-assets/'+key+'.js?v=29').then(()=>{if(pending.has(key)){pending.get(key).reject(Error('Incomplete exhibit data.'));pending.delete(key);}}).catch(e=>{pending.get(key)?.reject(e);pending.delete(key);});return promise;
  }
  function initUI(){
    dialog=document.createElement('dialog');dialog.id='enemyGallery';dialog.setAttribute('aria-labelledby','enemyTitle');
    dialog.innerHTML=`<div class="enemy-shell"><header class="enemy-top"><div><span class="enemy-kicker">SHOWROOM / OVERLOAD BESTIARY</span><h2 id="enemyTitle">Robot archive</h2></div><button id="enemyClose">Back to showroom <span aria-hidden="true">×</span></button></header><div class="enemy-body"><section class="enemy-stage" aria-label="Enemy model viewer"><canvas id="enemyCanvas" tabindex="0" aria-label="Drag to rotate the enemy; scroll to zoom; double-click to reset. Arrow keys rotate; plus and minus zoom."></canvas><div class="enemy-stage-label"><span id="enemyCategory"></span><span id="enemyCount"></span></div><p id="enemyStatus" role="status" aria-live="polite"></p><div class="enemy-view-tools"><button id="enemySpin" aria-pressed="true">Pause rotation</button><button id="enemyZoomIn" aria-label="Zoom in">＋</button><button id="enemyZoomOut" aria-label="Zoom out">−</button><button id="enemyReset">Reset view</button></div><span class="enemy-hint">DRAG TO ROTATE · SCROLL TO ZOOM · DOUBLE-CLICK TO RESET</span></section><aside class="enemy-dossier"><button id="enemyInfoToggle" aria-expanded="true" aria-controls="enemyInfo">Dossier <span>⌄</span></button><div id="enemyInfo"><p id="enemyDescription"></p><dl id="enemyFacts"></dl><div id="enemyTraits"></div><small class="enemy-source">Overload records · Armor is the base value before difficulty scaling.</small></div></aside></div><footer class="enemy-navigation"><button id="enemyPrev" aria-label="Previous enemy">← Previous</button><label>SELECT ROBOT<select id="enemySelect"></select></label><button id="enemyNext" aria-label="Next enemy">Next →</button></footer></div>`;
    document.body.append(dialog);canvas=$('enemyCanvas');
    $('enemyClose').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
    // Keep showroom keys out of the native flight/terminal handlers.
    dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}e.stopPropagation();});
    $('enemyPrev').onclick=()=>select(index-1);$('enemyNext').onclick=()=>select(index+1);$('enemySelect').onchange=e=>select(+e.target.value);
    $('enemySpin').onclick=()=>{rotating=!rotating;syncSpin();};$('enemyZoomIn').onclick=()=>zoom(-.35);$('enemyZoomOut').onclick=()=>zoom(.35);$('enemyReset').onclick=reset;
    $('enemyInfoToggle').onclick=()=>{const hidden=!$('enemyInfo').hidden;$('enemyInfo').hidden=hidden;$('enemyInfoToggle').setAttribute('aria-expanded',String(!hidden));};
    canvas.onpointerdown=e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};
    canvas.onpointermove=e=>{if(!drag||e.pointerId!==drag.id)return;yaw+=(e.clientX-drag.x)*.009;pitch=Math.max(-1.35,Math.min(1.35,pitch+(e.clientY-drag.y)*.009));drag.x=e.clientX;drag.y=e.clientY;rotating=false;syncSpin();};
    canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=()=>{drag=null;};canvas.ondblclick=reset;
    canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY*.0025);},{passive:false});
    canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(e.key)){e.preventDefault();rotating=false;syncSpin();if(e.key==='Home')reset();else if(e.key==='+'||e.key==='-')zoom(e.key==='+'?-.25:.25);else {yaw+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;pitch=Math.max(-1.35,Math.min(1.35,pitch+(e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0)));}}};
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();state.ready=false;state.error='Graphics context interrupted';cancelAnimationFrame(frame);text('enemyStatus','Graphics interrupted. Close and reopen the exhibit to reload.');});
    canvas.addEventListener('webglcontextrestored',()=>{gl=null;program=null;batches=[];textures=[];if(open){try{initGL();select(index);frame=requestAnimationFrame(draw);}catch(e){error(e);}}});
  }
  function syncSpin(){text('enemySpin',rotating?'Pause rotation':'Rotate');$('enemySpin').setAttribute('aria-pressed',String(rotating));}
  function reset(){yaw=-.35;pitch=.16;distance=2.8;}
  function zoom(delta){distance=Math.max(1.9,Math.min(6,distance+delta));}
  function error(e){state.error=e.message;state.ready=false;text('enemyStatus',e.message);}
  function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error('The enemy viewer could not initialize: '+message);}return s;}
  function initGL(){
    if(program&&!gl.isContextLost())return;
    gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:false});if(!gl||gl.isContextLost())throw Error('3D graphics are unavailable. Please reopen the gallery after graphics recover.');
    const vs=compile(gl.VERTEX_SHADER,`attribute vec3 position,normal;attribute float handedness;attribute vec2 uv,tangent;uniform mat3 rotation;uniform float distance,aspect;varying highp vec3 P,N,T;varying highp vec2 UV;varying mediump float H;
    vec3 oct(vec2 p){p=p*2.-1.;vec3 n=vec3(p,1.-abs(p.x)-abs(p.y));if(n.z<0.)n.xy=(1.-abs(n.yx))*sign(n.xy);return normalize(n);}
    void main(){P=rotation*position-vec3(0.,0.,distance);N=rotation*(normal*2.-1.);T=rotation*oct(tangent);H=handedness*2.-1.;UV=uv;gl_Position=vec4(P.x*2.25/aspect,P.y*2.25,-1.006689*P.z-.200669,-P.z);}`);
    const fs=compile(gl.FRAGMENT_SHADER,`precision highp float;varying highp vec3 P,N,T;varying highp vec2 UV;varying mediump float H;uniform sampler2D coat,detail;
    vec3 light(vec3 n,vec3 v,vec3 l,vec3 base,float metal,float rough,vec3 tint){vec3 h=normalize(l+v);float nl=max(dot(n,l),0.),nv=max(dot(n,v),.02),nh=max(dot(n,h),0.);float a=max(.09,rough*rough),a2=a*a,d=nh*nh*(a2-1.)+1.;float D=a2/(3.14159*d*d),k=(rough+1.)*(rough+1.)/8.;float G=nv/(nv*(1.-k)+k)*nl/(nl*(1.-k)+k);vec3 F=mix(vec3(.045),base,metal)+(1.-mix(vec3(.045),base,metal))*pow(1.-max(dot(h,v),0.),5.);return ((1.-F)*base*(1.-metal)*.75+F*D*G/max(.04,4.*nv*nl))*nl*tint;}
    void main(){vec4 c=texture2D(coat,UV),d=texture2D(detail,UV);vec3 n=normalize(N),t=normalize(T-n*dot(n,T)),b=normalize(cross(n,t))*H;vec2 xy=(d.rg*2.-1.)*.82;n=normalize(t*xy.x+b*xy.y+n*sqrt(max(.05,1.-dot(xy,xy))));vec3 v=normalize(-P);float metal=d.b,rough=max(.24,d.a);vec3 base=pow(c.rgb,vec3(1.6));vec3 color=base*(.32+.15*max(n.y,0.))+light(n,v,normalize(vec3(-.6,.8,1.1)),base,metal,rough,vec3(3.8,3.6,3.3))+light(n,v,normalize(vec3(.9,.05,.5)),base,metal,rough,vec3(.9,1.7,2.3));float rim=pow(1.-max(dot(n,v),0.),3.);color+=base*rim*.35+vec3(.06,.15,.19)*rim+max(c.rgb,vec3(.12,.23,.25))*c.a*1.6;gl_FragColor=vec4(pow(color/(1.+color*.65),vec3(.65)),1.);}`);
    program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('The enemy viewer shader could not link.');
    locations={};for(const name of ['position','normal','handedness','uv','tangent'])locations[name]=gl.getAttribLocation(program,name);
    for(const name of ['rotation','distance','aspect','coat','detail'])locations[name]=gl.getUniformLocation(program,name);
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
  }
  function dispose(){if(gl&&!gl.isContextLost()){for(const b of batches)gl.deleteBuffer(b.buffer);for(const t of textures)gl.deleteTexture(t);}batches=[];textures=[];}
  function texture(encoded){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(!open||!gl||gl.isContextLost()){resolve(null);return;}const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.generateMipmap(gl.TEXTURE_2D);resolve(t);};img.onerror=()=>reject(Error('Unable to decode this robot’s materials.'));img.src='data:image/png;base64,'+encoded;});}
  async function mesh(data){const str=atob(data),bytes=new Uint8Array(str.length);for(let i=0;i<str.length;i++)bytes[i]=str.charCodeAt(i);return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();}
  async function select(next){
    if(!catalog.length||!open)return;const request=++token;index=((Math.trunc(next)%catalog.length)+catalog.length)%catalog.length;const item=catalog[index];Object.assign(state,{index,id:item.id,ready:false,error:null});dispose();gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);reset();
    text('enemyTitle',item.name);text('enemyCategory',item.category);text('enemyCount',String(index+1).padStart(2,'0')+' / '+catalog.length);$('enemySelect').value=index;
    text('enemyDescription',item.description);const facts=$('enemyFacts');facts.replaceChildren();
    for(const [key,value] of [['Model',item.model],['Role',item.role],['Armament',item.weapons],['Threat',item.threat],['Base armor',item.armor===null?'Not recorded':item.armor.toLocaleString()]]){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;row.append(dt,dd);facts.append(row);}
    $('enemyTraits').replaceChildren(...item.traits.map(label=>{const span=document.createElement('span');span.textContent=label;return span;}));text('enemyStatus','Loading '+item.name+'…');
    const created=[],nextBatches=[];
    try{
      const pack=await parcel(item.id);if(request!==token||!open)return;
      const [bytes,mats]=await Promise.all([mesh(pack.mesh),Promise.all(pack.materials.map(m=>parcel('material-'+m)))]);if(request!==token||!open)return;
      const materialMap=new Map();
      // Upload sequentially so stale requests and errors can release every GPU resource.
      for(let n=0;n<mats.length;n++){const coat=await texture(mats[n].coat);if(coat)created.push(coat);const detail=await texture(mats[n].detail);if(detail)created.push(detail);materialMap.set(pack.materials[n],[coat,detail]);if(request!==token||!open){for(const t of created)gl.deleteTexture(t);return;}}
      const view=new DataView(bytes),count=view.getUint32(0,true);let offset=4;
      if(count>1000)throw Error('Invalid model data.');
      for(let n=0;n<count;n++){const mat=view.getUint32(offset,true),vertices=view.getUint32(offset+8,true);offset+=12;if(vertices<3||offset+vertices*44>bytes.byteLength||!materialMap.has(mat))throw Error('Incomplete model data.');const v=new Float32Array(bytes,offset,vertices*11);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,v,gl.STATIC_DRAW);nextBatches.push({buffer,vertices,maps:materialMap.get(mat)});offset+=vertices*44;}
      batches=nextBatches;textures=created;state.ready=true;text('enemyStatus','');canvas.setAttribute('aria-label',item.name+'. Drag to rotate; scroll to zoom; double-click to reset.');
    }catch(e){for(const t of created)gl?.deleteTexture(t);for(const b of nextBatches)gl?.deleteBuffer(b.buffer);if(request===token&&open)error(e);}
  }
  function draw(now){
    if(!open)return;frame=requestAnimationFrame(draw);if(document.hidden||now-last<32)return;const dt=Math.min(.05,(now-last)*.001);last=now;if(!state.ready)return;
    const r=canvas.getBoundingClientRect(),ratio=Math.min(2,devicePixelRatio||1),w=Math.max(1,Math.min(1920,Math.round(r.width*ratio))),h=Math.max(1,Math.min(1440,Math.round(r.height*ratio)));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
    if(rotating&&!drag)yaw+=dt*.16;const a=Math.cos(yaw),b=Math.sin(yaw),c=Math.cos(pitch),s=Math.sin(pitch);
    gl.uniformMatrix3fv(locations.rotation,false,new Float32Array([a,s*b,-c*b,0,c,s,b,-s*a,c*a]));gl.uniform1f(locations.distance,distance);gl.uniform1f(locations.aspect,r.width/r.height);gl.uniform1i(locations.coat,0);gl.uniform1i(locations.detail,1);
    for(const batch of batches){gl.bindBuffer(gl.ARRAY_BUFFER,batch.buffer);for(const [name,size,offset] of [['position',3,0],['normal',3,12],['handedness',1,24],['uv',2,28],['tangent',2,36]]){gl.enableVertexAttribArray(locations[name]);gl.vertexAttribPointer(locations[name],size,gl.FLOAT,false,44,offset);}for(let n=0;n<2;n++){gl.activeTexture(gl.TEXTURE0+n);gl.bindTexture(gl.TEXTURE_2D,batch.maps[n]);}gl.drawArrays(gl.TRIANGLES,0,batch.vertices);}
    state.frames++;
  }
  async function show(){
    if(open)return;if(!dialog)initUI();open=true;document.body.classList.add('enemy-gallery-open');dialog.showModal();$('enemyClose').focus();syncSpin();state.ready=false;text('enemyStatus','Opening robot archive…');
    try{initGL();if(!loadCatalog)loadCatalog=loadScript('enemy-catalog.js?v=29').catch(e=>{loadCatalog=null;throw e;});await loadCatalog;if(!open)return;
      if(!catalog.length){catalog=window.astraEnemyCatalog;$('enemySelect').replaceChildren(...catalog.map((item,i)=>new Option(item.name+(item.category==='Archive prototype'?' · Archive':''),i)));}
      await select(index);if(open){last=performance.now();cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);}
    }catch(e){if(open)error(e);}
  }
  function close(){if(!open)return;open=false;++token;state.ready=false;cancelAnimationFrame(frame);drag=null;dispose();if(gl&&!gl.isContextLost())gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);dialog.close();document.body.classList.remove('enemy-gallery-open');start.focus();}
  start.onclick=show;window.astraEnemies={open:show,close,select,state,get count(){return catalog.length;}};
})();
