/* The game’s actual Pyro mesh in a procedural, lit maintenance bay. */
(() => {
  const cv=document.getElementById('hangar'),gl=cv.getContext('webgl',{alpha:false,antialias:true});if(!gl)return;
  const asset=window.astraHull,raw=decodeAstraBase64(asset.data);window.astraHullBytes=raw;
  document.getElementById('triangles').textContent=(asset.count/3).toLocaleString();
  function program(v,f){const p=gl.createProgram();for(const[type,src]of[[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);gl.deleteShader(s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
  const bay=program('attribute vec2 pt;varying vec2 uv;void main(){uv=pt;gl_Position=vec4(pt,0.,1.);}',`
  precision highp float;varying vec2 uv;uniform float aspect,clock;
  float stripe(float x,float width){return 1.-smoothstep(width,width+.02,abs(x));}
  void main(){
    vec3 eye=vec3(0.,1.5,14.),ray=normalize(vec3(uv.x*aspect*.48,uv.y*.48-.06,-1.));
    float t=100.;int side=0;
    float floorT=(-3.25-eye.y)/ray.y;if(floorT>0.&&floorT<t){t=floorT;side=1;}
    float backT=(-13.-eye.z)/ray.z;if(backT>0.&&backT<t){t=backT;side=2;}
    float wallT=(sign(ray.x)*11.-eye.x)/ray.x;if(wallT>0.&&wallT<t){t=wallT;side=3;}
    float roofT=(7.-eye.y)/ray.y;if(roofT>0.&&roofT<t){t=roofT;side=4;}
    vec3 p=eye+ray*t;vec2 st=side==1||side==4?p.xz:side==2?p.xy:p.zy;
    vec2 cell=abs(fract(st/vec2(3.,4.))-.5);float groove=smoothstep(.478,.495,max(cell.x,cell.y));
    float bevel=smoothstep(.42,.455,max(cell.x,cell.y))*(1.-groove);
    float grain=fract(sin(dot(floor(st*140.),vec2(127.1,311.7)))*43758.5453);
    vec3 col=vec3(.076,.105,.127)*(1.-groove*.8+bevel*.45)+(grain-.5)*.008;
    float ribs=1.-smoothstep(.12,.18,abs(mod(st.x+1.5,3.)-1.5));col+=ribs*vec3(.018,.028,.035);
    float cyan=0.,amber=0.;
    if(side==2){cyan=(stripe(abs(p.x)-8.1,.045)+stripe(abs(p.x)-4.6,.035))*step(-1.9,p.y)*step(p.y,5.5);amber=stripe(p.y-5.7,.035)*step(abs(p.x),8.5);col*=.75;float door=step(abs(p.x),3.3)*step(abs(p.y-1.),3.9);col=mix(col,vec3(.045,.064,.080),door*.8);col+=stripe(abs(p.x)-3.4,.065)*vec3(.018,.05,.06);}
    if(side==1){cyan=stripe(abs(p.x)-7.,.045);amber=stripe(abs(p.x)-3.7,.04)*(.6+.4*step(.65,fract(p.z*.8)));float grate=step(.6,fract(p.z*3.))*step(abs(p.x),2.5);col*=1.-grate*.24;col+=exp(-.10*dot(p.xz-vec2(0.,3.),p.xz-vec2(0.,3.)))*vec3(.045,.065,.08);col*=1.-.48*exp(-dot(p.xz-vec2(0.,1.),p.xz-vec2(0.,1.))*.08);}
    if(side==3){cyan=stripe(p.y-2.6,.055);amber=stripe(p.y+2.5,.03);col+=stripe(mod(p.z+1.5,5.)-2.5,.22)*vec3(.025,.045,.055);}
    if(side==4){cyan=stripe(abs(p.x)-7.,.08);col*=.6;}
    vec3 glow=cyan*vec3(.17,.64,.79)+amber*vec3(.8,.29,.065);
    float distanceFade=exp(-t*.018);col=(col+glow)*distanceFade;
    col+=vec3(.025,.065,.09)*exp(-abs(uv.x-.55)*4.)*exp(-abs(uv.y-.15)*3.);
    float vignette=1.-smoothstep(.25,1.5,length(uv*vec2(.72,1.)));col*=.55+.45*vignette;
    col=mix(col,vec3(.026,.049,.066),1.-exp(-t*.009));
    col*=1.-(1.-smoothstep(-1.,-.35,uv.y))*.62;
    gl_FragColor=vec4(col,1.);
  }`);
  const ship=program('attribute vec3 pt,norm;attribute vec2 coord;attribute float id;uniform mat3 rot;uniform vec2 scale;uniform float distance,bob;varying mediump vec2 uv;varying highp vec3 normal,position;varying mediump float material;void main(){position=rot*pt-vec3(0.,-.85-bob,distance);normal=rot*norm;uv=coord;material=id;gl_Position=vec4(position.xy*scale,-1.025*position.z-.71,-position.z);}',asset.fragment);
  const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const mesh=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,mesh);gl.bufferData(gl.ARRAY_BUFFER,raw,gl.STATIC_DRAW);
  const skin=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,skin);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([115,119,116,255]));
  const U=(p,n)=>gl.getUniformLocation(p,n);let yaw=.72,pitch=.31,distance=13.7,drag=null,spinning=false,last=0,visible=true;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function render(now=performance.now()){
    if(!cv.clientWidth||!cv.clientHeight)return;
    const ratio=Math.min(1.5,devicePixelRatio||1),w=Math.max(1,Math.round(cv.clientWidth*ratio)),h=Math.max(1,Math.round(cv.clientHeight*ratio));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);
    for(let i=0;i<8;i++)gl.disableVertexAttribArray(i);
    gl.useProgram(bay);gl.bindBuffer(gl.ARRAY_BUFFER,quad);const at=gl.getAttribLocation(bay,'pt');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);gl.uniform1f(U(bay,'aspect'),w/h);gl.uniform1f(U(bay,'clock'),now*.001);gl.drawArrays(gl.TRIANGLES,0,3);gl.disableVertexAttribArray(at);
    gl.enable(gl.DEPTH_TEST);gl.useProgram(ship);gl.bindBuffer(gl.ARRAY_BUFFER,mesh);gl.bindTexture(gl.TEXTURE_2D,skin);
    for(const[name,n,offset]of[['pt',3,0],['norm',3,3],['coord',2,6],['id',1,8]]){const loc=gl.getAttribLocation(ship,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,36,offset*4);}
    const a=Math.cos(yaw),b=Math.sin(yaw),c=Math.cos(pitch),s=Math.sin(pitch);gl.uniformMatrix3fv(U(ship,'rot'),false,[a,s*b,-c*b,0,c,s,b,-s*a,c*a]);
    gl.uniform2f(U(ship,'scale'),2.65*Math.min(1,h/w),2.65*Math.min(1,w/h));gl.uniform1f(U(ship,'distance'),distance);gl.uniform1f(U(ship,'bob'),reduced?0:Math.sin(now*.0007)*.07);
    gl.uniform3f(U(ship,'keyLight'),-.5,.9,.7);gl.uniform3f(U(ship,'fillLight'),.9,.15,-.4);gl.uniform1f(U(ship,'exposure'),1.19);gl.drawArrays(gl.TRIANGLES,0,asset.count);
  }
  function spinState(value){spinning=value;document.getElementById('shipSpin')?.setAttribute('aria-pressed',String(value));}
  const api=window.astraHangar={render,reset(){yaw=.72;pitch=.31;distance=13.7;spinState(false);render();},view(v){yaw=({front:0,rear:Math.PI,port:Math.PI/2})[v];pitch=.12;spinState(false);render();},spin(){spinState(!spinning);render();}};
  cv.onpointerdown=e=>{if(e.button!==0)return;cv.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY];spinState(false);};
  cv.onpointermove=e=>{if(drag){yaw+=(e.clientX-drag[0])*.009;pitch=Math.max(-1.2,Math.min(1.35,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];render();}};
  cv.onpointerup=cv.onpointercancel=e=>{drag=null;if(cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);};cv.ondblclick=api.reset;
  cv.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(9.7,Math.min(20,distance+e.deltaY*.008));render();},{passive:false});
  cv.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')return api.reset();yaw+=(e.key==='ArrowRight')*.16-(e.key==='ArrowLeft')*.16;pitch=Math.max(-1.2,Math.min(1.35,pitch+(e.key==='ArrowDown')*.1-(e.key==='ArrowUp')*.1));render();};
  const im=new Image();im.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,skin);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);render();};im.src='data:image/png;base64,'+window.astraSkin;
  new ResizeObserver(()=>render()).observe(cv);new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(cv);
  function animate(now){requestAnimationFrame(animate);if(now-last<33)return;const elapsed=Math.min(.08,(now-last)*.001);last=now;if(document.hidden||document.body.classList.contains("enemy-gallery-open")||!visible||!document.getElementById("loadingScreen").hidden||(!document.body.classList.contains('native-open')&&document.body.classList.contains('flying')))return;if(spinning)yaw+=elapsed*.2;if(!reduced||spinning)render(now);}
  requestAnimationFrame(animate);render();
})();
