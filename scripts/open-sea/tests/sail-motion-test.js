// Transform feedback checks the production shader against the actual exported
// cloth, sewn edges, battens and rigid corner rings, including late wind changes.
export async function testSailMotion(base='../../../demos/open-sea/'){
 const {gl}=await import(base+'js/gl.js'),{YACHT_VS}=await import(base+'js/yacht.js'),{sailWind,advanceSailPhases}=await import(base+'js/sail-motion.js');
 const metadata=await (await fetch(base+'assets/schooner.json')).json();
 const br=await fetch(base+'assets/schooner.bin.gz'),binary=await new Response(br.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const assert=(v,m)=>{if(!v)throw Error(m);},compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);assert(gl.getShaderParameter(s,gl.COMPILE_STATUS),gl.getShaderInfoLog(s));return s;};
 const program=gl.createProgram();
 gl.attachShader(program,compile(gl.VERTEX_SHADER,'#version 300 es\n#define SAIL\nprecision highp float;\nprecision highp int;\n'+YACHT_VS));
 gl.attachShader(program,compile(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;\nout vec4 o;void main(){o=vec4(1);}'));
 gl.transformFeedbackVaryings(program,['vLocal'],gl.INTERLEAVED_ATTRIBS);gl.linkProgram(program);assert(gl.getProgramParameter(program,gl.LINK_STATUS),gl.getProgramInfoLog(program));
 const vao=gl.createVertexArray(),input=gl.createBuffer(),output=gl.createBuffer(),feedback=gl.createTransformFeedback();
 gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,input);
 for(const[loc,size,off]of[[0,3,0],[1,3,12],[2,4,24],[3,1,40]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,44,off);}
 const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),report=[],lateWind=[];
 try{
  gl.useProgram(program);for(const u of ['uModel','uVP'])gl.uniformMatrix4fv(gl.getUniformLocation(program,u),false,identity);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,feedback);gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER,output);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,output);gl.enable(gl.RASTERIZER_DISCARD);
  for(const [index,S]of metadata.sails.entries()){
   const g=metadata.groups[S.id],data=new Float32Array(binary,g.vertexOffset,g.vertexCount*11),pins=[],rings=new Map();
   for(let i=0;i<g.vertexCount;i++){const u=data[i*11+6],v=data[i*11+7];if(u===0||v===1||u===1&&v===0||S.boom&&v===0)pins.push(i);if(data[i*11+8]===7){const key=[u.toFixed(3),v.toFixed(3)].join(',');if(!rings.has(key))rings.set(key,[]);rings.get(key).push(i);}}
   assert(pins.length>100,`${S.id}: missing fixed vertices`);assert(rings.size===3&&rings.has('0.000,0.000')&&rings.has('1.000,0.000')&&rings.has('0.010,0.985'),`${S.id}: cringles need exact constant corner UVs`);
   gl.bindBuffer(gl.ARRAY_BUFFER,input);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER,output);gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER,g.vertexCount*12,gl.DYNAMIC_READ);
   gl.uniform4f(gl.getUniformLocation(program,'uSailCloth'),S.clew[0],S.clew[1],S.draft,S.roach);
   const phases=new Float64Array(metadata.sails.length*2);
   const capture=(time,amplitude)=>{gl.uniform3f(gl.getUniformLocation(program,'uSailWind'),phases[index*2],phases[index*2+1],S.phase);gl.uniform4f(gl.getUniformLocation(program,'uSail'),-.42*S.angleScale,S.tack[0],amplitude,time);gl.beginTransformFeedback(gl.POINTS);gl.drawArrays(gl.POINTS,0,g.vertexCount);gl.endTransformFeedback();const p=new Float32Array(g.vertexCount*3);gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER,0,p);return p;};
   for(const U of [.3,5,14,30]){
    const rf=Math.max(0,Math.min(1,(U-11)/8)),reef=rf*rf*(3-2*rf),r=reef*(S.boom?1:.6),motion=sailWind(U,reef);phases.fill(0);
    gl.uniform3f(gl.getUniformLocation(program,'uSailAxis'),(S.head[0]-S.tack[0])*(S.boom?1-.18*r:1),(S.head[1]-S.tack[1])*(S.boom?1-.42*r:1),0);gl.uniform4f(gl.getUniformLocation(program,'uSailShape'),S.tack[1],S.head[1],r,S.boom?0:1);
    const rest=capture(0,0);let anchorDrift=0,peak=0,rigidRingError=0;const edgeSamples=[];
    let edge=0;for(let i=0;i<g.vertexCount;i++)if(data[i*11+8]===6&&Math.abs(data[i*11+6]-.98)+Math.abs(data[i*11+7]-.3)<Math.abs(data[edge*11+6]-.98)+Math.abs(data[edge*11+7]-.3))edge=i;
    const times=[...Array.from({length:90},(_,i)=>i/30),3.2,3.201,4.701,4.705,34.705,5000];let prev=0;
    for(const time of times){advanceSailPhases(phases,motion.rate,time-prev);prev=time;const p=capture(time,motion.amplitude);assert(p.every(Number.isFinite),'Nonfinite sail position');
     for(let i=0;i<g.vertexCount;i++)peak=Math.max(peak,Math.hypot(...[0,1,2].map(k=>p[i*3+k]-rest[i*3+k])));
     for(const i of pins)anchorDrift=Math.max(anchorDrift,Math.hypot(...[0,1,2].map(k=>p[i*3+k]-rest[i*3+k])));
     for(const ids of rings.values()){const i0=ids[0],d0=[0,1,2].map(k=>p[i0*3+k]-rest[i0*3+k]);for(const i of ids)rigidRingError=Math.max(rigidRingError,Math.hypot(...[0,1,2].map(k=>p[i*3+k]-rest[i*3+k]-d0[k])));}
     edgeSamples.push(p[edge*3+2]);
    }
    const edgeRange=Math.max(...edgeSamples)-Math.min(...edgeSamples);assert(anchorDrift<.00003,`${S.id}: anchor drift ${anchorDrift}`);assert(rigidRingError<.00003,`${S.id}: cringle distortion ${rigidRingError}`);assert(peak<1.3,`${S.id}: unbounded cloth ${peak}`);assert(edgeRange>(U>.8?.12:.001),`${S.id}: invisible flutter ${edgeRange}`);
    report.push({sail:S.id,wind:U,reef:r,vertices:g.vertexCount,pinnedVertices:pins.length,anchorDrift,rigidRingError,peakMovementMetres:peak,leechRangeMetres:edgeRange});
    if(U===5){let last=capture(5000,motion.amplitude),maxStep=0;for(let k=1;k<=180;k++){advanceSailPhases(phases,sailWind(5+20*k/180,0).rate,1/60);const p=capture(5000+k/60,motion.amplitude);for(let i=0;i<p.length;i+=3)maxStep=Math.max(maxStep,Math.hypot(...[0,1,2].map(j=>p[i+j]-last[i+j])));last=p;}assert(maxStep<.15,`${S.id}: late wind snapped cloth ${maxStep}`);lateWind.push({sail:S.id,maxStepMetres:maxStep});}
   }
  }
  assert(gl.getError()===0,'WebGL error in sail motion test');return {checks:report,lateRuntimeChangingWind:lateWind,frameHitches:true};
 }finally{gl.disable(gl.RASTERIZER_DISCARD);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,null);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);gl.bindVertexArray(null);gl.deleteTransformFeedback(feedback);gl.deleteBuffer(input);gl.deleteBuffer(output);gl.deleteVertexArray(vao);gl.deleteProgram(program);}
}
