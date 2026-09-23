import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {reefCausticsShader} from '../ReefCaustics.ts';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage();
 const result=await page.evaluate(source=>{
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;
  const gl=canvas.getContext('webgl2',{antialias:false});if(!gl)throw Error('WebGL2 unavailable');
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader;}
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,'#version 300 es\nvoid main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.-1.,0.,1.);}'));
  gl.attachShader(program,compile(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;uniform float time,depth;out vec4 color;\n'+source+'\nvoid main(){vec2 p=(gl_FragCoord.xy/vec2(256.,128.)-.5)*vec2(10.,4.6);float f=reefCausticFocus(p,depth,time);color=vec4(vec3(f),1.);}'));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);gl.bindVertexArray(gl.createVertexArray());gl.viewport(0,0,256,128);
  function render(time,depth){gl.uniform1f(gl.getUniformLocation(program,'time'),time);gl.uniform1f(gl.getUniformLocation(program,'depth'),depth);gl.drawArrays(gl.TRIANGLES,0,3);const data=new Uint8Array(256*128*4);gl.readPixels(0,0,256,128,gl.RGBA,gl.UNSIGNED_BYTE,data);return data;}
  const a=render(2,4.8),held=render(2,4.8),b=render(2+1/60,4.8),surface=render(2,0);let changed=0,error=0,max=0,heldError=0,surfaceEnergy=0;
  for(let i=0;i<a.length;i+=4){const d=Math.abs(a[i]-b[i]);changed+=d>0?1:0;error+=d;max=Math.max(max,d);heldError+=Math.abs(a[i]-held[i]);surfaceEnergy+=surface[i];}
  return {changed,meanStep:error/(256*128),maxStep:max,heldError,surfaceEnergy,glError:gl.getError()};
 },reefCausticsShader);
 assert.equal(result.glError,0);assert.equal(result.heldError,0,'paused optical time keeps identical rendered light');
 assert.equal(result.surfaceEnergy,0,'the undisplaced zero-travel surface cannot focus light');
 assert.ok(result.changed>1000,'the rendered refracted light must move');
 assert.ok(result.meanStep<20,'finite-source filtering bounds average change over one60Hz frame');
 assert.ok(result.maxStep<128,'no sampled point flashes across half the focus range in one60Hz frame');
 console.log('Rendered caustic continuity:',result);
}finally{await browser.close();}
