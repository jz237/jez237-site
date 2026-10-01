// Real vertex-shader attachment checks and wet-weather GPU stress.
import{createRequire}from'node:module';import assert from'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const url=new URL(process.argv[2]||'http://127.0.0.1:8834/');url.searchParams.set('ship','imperial');url.searchParams.set('shot','1');url.searchParams.set('res','.65');
const browser=await chromium.launch({channel:process.env.CHROME_CHANNEL||'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
try{
 const p=await browser.newPage({viewport:{width:1000,height:760}}),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});await p.goto(url.href);await p.waitForFunction(()=>window.__seaReady,{timeout:90000});
 const report=await p.evaluate(async()=>{
  const a=__sea.app,y=a.yacht,{gl,Program,readF32,tex2D,makeFBO,bindFBO,drawFS,FS_VERT}=await import('./js/gl.js'),{m4}=await import('./js/math.js'),{bindLighting}=await import('./js/lighting.js');
  await __sea.warm(12,.05);__sea.shot();
  const vertex=gl.getAttachedShaders(y.progSail.p).find(s=>gl.getShaderParameter(s,gl.SHADER_TYPE)===gl.VERTEX_SHADER),fragment=gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment,'#version 300 es\nprecision highp float;out vec4 o;void main(){o=vec4(1);}');gl.compileShader(fragment);
  const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.transformFeedbackVaryings(program,['vLocal'],gl.INTERLEAVED_ATTRIBS);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  const fp=Object.assign(Object.create(Program.prototype),{p:program,locs:new Map()}),buffer=gl.createBuffer(),feedback=gl.createTransformFeedback();let maxPin=0,maxClew=0,vertices=0;
  for(const reef of [0,.5,1])for(const angle of [-.5,.5]){
   y.reef=reef;y.sailAng=angle;y._updateSheets();let sheet=y.sails.reduce((n,{S})=>n+(S.square?0:S.boom?2:1),0);
   for(const [i,{S,cloth}]of y.sails.entries()){
    const count=y.metadata.groups[S.id].vertexCount,raw=new Float32Array(count*11);gl.bindBuffer(gl.ARRAY_BUFFER,cloth.vb);gl.getBufferSubData(gl.ARRAY_BUFFER,0,raw);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER,buffer);gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER,count*12,gl.DYNAMIC_READ);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,feedback);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,buffer);
    fp.use().m4('uVP',m4.ident()).m4('uModel',m4.ident());y.bindCloth(fp,S,i,a.time);
    gl.bindVertexArray(cloth.vao);gl.enable(gl.RASTERIZER_DISCARD);gl.beginTransformFeedback(gl.POINTS);gl.drawArrays(gl.POINTS,0,count);gl.endTransformFeedback();gl.disable(gl.RASTERIZER_DISCARD);
    const actual=new Float32Array(count*3);gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER,0,actual);if(!actual.every(Number.isFinite))throw Error('Nonfinite deformed sail');vertices+=count;
    if(S.square){
     const c=Math.cos(angle*S.angleScale),s=Math.sin(angle*S.angleScale);
     for(let j=0;j<count;j++){
      if(raw[j*11+8]!==6||raw[j*11+9]!==0)continue;const u=raw[j*11+6],v=raw[j*11+7],P=Array.from(actual.slice(j*3,j*3+3));
      if(v===1){const z=(u-.5)*S.widthTop,E=[S.tack[0]+z*s,S.head[1],z*c];maxPin=Math.max(maxPin,Math.hypot(...P.map((x,k)=>x-E[k])));}
      if(v===0&&(u===0||u===1)){const side=u===0?-1:1,z=side*S.widthBottom*.5*(1-.1*reef),E=[S.tack[0]+z*s,S.head[1]-(S.head[1]-S.tack[1])*(1-.65*reef),z*c];maxClew=Math.max(maxClew,Math.hypot(...P.map((x,k)=>x-E[k])));const offset=(sheet+(side===1?1:0))*18*11,A=[0,1,2].map(k=>Array.from({length:8},(_,t)=>y.sheetVerts[offset+t*11+k]).reduce((a,b)=>a+b,0)/8);maxClew=Math.max(maxClew,Math.hypot(...P.map((x,k)=>x-A[k])));}
     }
    }
    if(S.square)sheet+=2;
   }
  }
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,null);gl.deleteBuffer(buffer);gl.deleteTransformFeedback(feedback);gl.deleteProgram(program);
  // Two cloth layers attenuate successively; a sheet does not shadow itself.
  const fixture=new Program('layer.fixture',FS_VERT,'#include <common>\n#include <atmo>\n#include <atmo.sample>\n#include <lighting>\nout vec4 o;void main(){o=vec4(yachtShadowLocal(vec3(0),vec3(0,1,0),true));}'),target=makeFBO([tex2D(2,2,{fmt:'rgba32f',filter:'nearest'})]);
  const t=data=>tex2D(1,1,{fmt:'rgba32f',filter:'nearest',data:new Float32Array(data),dataType:gl.FLOAT}),first=t([.1,.62,8,1]),second=t([.2,.62,9,1]),clear=t([1,0,-1,0]);
  const run=id=>{bindFBO(target);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);bindLighting(fixture.use(),a.ctx);fixture.m4('uYachtShadowMatrix',m4.ident()).v4('uYachtShadowInfo',1,1,1/1024,100).f('uYachtReceiverId',id).t('uYachtShadow',2,first).t('uYachtShadowOpacity',19,second).t('uYachtShadowOpaque',20,clear);drawFS();return readF32(target,0,0,2,2)[0];};
  const layers=run(-1),self=run(8);let peak=0;
  // Orthographic subpixel ropes must retain integrated physical coverage.
  // This runs the actual rig caster with a 6 mm rope in a 2 m-wide map.
  const rigTarget=makeFBO([tex2D(64,64,{fmt:'rgba32f',filter:'nearest'})]),rigVao=gl.createVertexArray();
  bindFBO(rigTarget);gl.clearColor(1,0,-1,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
  const caster=a.yachtShadow.rig;caster.use().m4('uVP',m4.ident()).m4('uModel',m4.ident()).v2('uViewport',64,64).f('uPixelScale',32).f('uPeel',0).t('uFirstLayer',0,clear);
  gl.bindVertexArray(rigVao);for(let i=0;i<4;i++)gl.disableVertexAttribArray(i);
  gl.vertexAttrib3f(0,-.7,.02,0);gl.vertexAttrib3f(1,.7,.02,0);gl.vertexAttrib1f(2,.003);gl.vertexAttrib1f(3,8);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,4,1);
  const rigPixels=readF32(rigTarget,0,0,64,64);let rigCoverage=0,rigMax=0,rigCount=0;
  for(let i=0;i<rigPixels.length;i+=4)if(rigPixels[i+3]>0){rigCoverage+=rigPixels[i+1];rigMax=Math.max(rigMax,rigPixels[i+1]);rigCount++;if(rigPixels[i+2]!==0)throw Error('Incorrect static rig caster ID');}
  gl.bindVertexArray(null);gl.deleteVertexArray(rigVao);
  Object.assign(a.goal,(await import('./js/ocean.js')).seaPreset(8),{rain:1});a.setWhirlpool(true);
  for(let i=0;i<30;i++){if(i===15)a.setWhirlpool(false);__sea.shot([.003,.1,2,.011,.049][i%5]);for(const [f,w,h]of [[a.deckWash.curF,128,32],[a.ripples.curF,a.ripples.N,a.ripples.N],[a.post.fbo,a.w,a.h]]){const d=readF32(f,0,0,w,h);if(!d.every(Number.isFinite))throw Error('Nonfinite GPU state');if(f===a.deckWash.curF)for(let k=0;k<d.length;k+=4)peak=Math.max(peak,d[k]);}}
  const programs=[a.water.prog,y.progSail],samplers=programs.map(p=>{let count=0;for(let i=0;i<gl.getProgramParameter(p.p,gl.ACTIVE_UNIFORMS);i++){const u=gl.getActiveUniform(p.p,i);if([gl.SAMPLER_2D,gl.SAMPLER_2D_ARRAY,gl.SAMPLER_3D].includes(u.type))count++;}return{name:p.name,count};});
  return{maxPin,maxClew,vertices,layers,self,rigCoverage,rigMax,rigCount,peak,samplers,error:gl.getError()};
 });
 console.log(report);assert.ok(report.maxPin<.002&&report.maxClew<.002);assert.ok(Math.abs(report.layers-.1444)<.001);assert.ok(report.self>report.layers);assert.ok(report.rigCoverage>5&&report.rigCoverage<13&&report.rigMax<.2&&report.rigCount>20);assert.ok(report.peak<=1.5);assert.ok(report.samplers.every(x=>x.count<=16));assert.equal(report.error,0);assert.deepEqual(errors,[]);
}finally{await browser.close();}
