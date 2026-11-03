/* Interactive view of the same Pyro mesh used by the game. */
(() => {
  const cv=document.getElementById("hangar");
  const gl=cv.getContext("webgl",{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)return;
  const asset=window.astraHull;
  document.getElementById("triangles").textContent=(asset.count/3).toLocaleString("en-US");
  const raw=Uint8Array.fromBase64?Uint8Array.fromBase64(asset.data):Uint8Array.from(atob(asset.data),v=>v.charCodeAt(0));
  window.astraHullBytes=raw;
  const vs="attribute vec3 pt,norm;attribute vec2 coord;attribute float id; uniform mat3 rot; uniform vec2 scale;"
    +"varying mediump vec2 uv;varying highp vec3 normal,position;varying mediump float material;"
    +"void main(){position=rot*pt-vec3(0.,-.24,14.);normal=rot*norm;uv=coord;material=id;"
    +"gl_Position=vec4(position.xy*scale,-1.025*position.z-.71,-position.z);}";
  function shader(type,code){
    const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
  }
  const pg=gl.createProgram();gl.attachShader(pg,shader(gl.VERTEX_SHADER,vs));gl.attachShader(pg,shader(gl.FRAGMENT_SHADER,asset.fragment));gl.linkProgram(pg);
  if(!gl.getProgramParameter(pg,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(pg));
  gl.useProgram(pg);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,raw,gl.STATIC_DRAW);
  for(const [name,n,off] of [["pt",3,0],["norm",3,3],["coord",2,6],["id",1,8]]){
    const loc=gl.getAttribLocation(pg,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,36,off*4);
  }
  gl.enable(gl.DEPTH_TEST);
  const U=s=>gl.getUniformLocation(pg,s);
  let yaw=.72,pitch=.36,drag=null;
  function render(){
    const w=Math.max(1,Math.round(cv.clientWidth*Math.min(2,devicePixelRatio))),h=Math.max(1,Math.round(cv.clientHeight*Math.min(2,devicePixelRatio)));
    if(w!==cv.width||h!==cv.height){cv.width=w;cv.height=h;}
    gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const a=Math.cos(yaw),b=Math.sin(yaw),c=Math.cos(pitch),s=Math.sin(pitch);
    gl.uniformMatrix3fv(U("rot"),false,[a,s*b,-c*b, 0,c,s, b,-s*a,c*a]);
    gl.uniform2f(U("scale"),2.72*Math.min(1,h/w),2.72*Math.min(1,w/h));
    gl.uniform3f(U("keyLight"),-.63,.82,.73);gl.uniform3f(U("fillLight"),.8,.4,-.5);gl.uniform1f(U("exposure"),1.26);
    gl.drawArrays(gl.TRIANGLES,0,asset.count);
  }
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY];};
  cv.onpointermove=e=>{if(drag){yaw+=(e.clientX-drag[0])*.009;pitch=Math.max(-1.2,Math.min(1.35,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];render();}};
  cv.onpointerup=cv.onpointercancel=()=>drag=null;
  cv.onkeydown=e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault();yaw+=(e.key==="ArrowRight")*.16-(e.key==="ArrowLeft")*.16;pitch+=(e.key==="ArrowDown")*.10-(e.key==="ArrowUp")*.10;render();};
  const skin=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,skin);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([115,119,116,255]));
  const im=new Image();im.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,skin);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);render();};im.src="data:image/png;base64,"+window.astraSkin;
  new ResizeObserver(render).observe(cv);render();
})();

