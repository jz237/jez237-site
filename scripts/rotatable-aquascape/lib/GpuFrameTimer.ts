/** Nonblocking, development-only GPU timing. Never waits for a query result. */
export class GpuFrameTimer{
 private extension:{TIME_ELAPSED_EXT:number;GPU_DISJOINT_EXT:number}|null;
 private pending:WebGLQuery[]=[];
 private active:WebGLQuery|null=null;
 private samples:number[]=[];
 constructor(private gl:WebGL2RenderingContext,private host:HTMLElement){this.extension=gl.getExtension('EXT_disjoint_timer_query_webgl2');}
 begin(){
  const gl=this.gl,ext=this.extension;if(!ext)return;
  const disjoint=gl.getParameter(ext.GPU_DISJOINT_EXT);
  while(this.pending.length&&gl.getQueryParameter(this.pending[0],gl.QUERY_RESULT_AVAILABLE)){
   const query=this.pending.shift()!;if(!disjoint)this.samples.push(gl.getQueryParameter(query,gl.QUERY_RESULT)/1e6);gl.deleteQuery(query);
  }
  if(disjoint){this.samples=[];for(const query of this.pending)gl.deleteQuery(query);this.pending=[];return;}
  if(this.samples.length>=120){const sorted=this.samples.sort((a,b)=>a-b);this.host.dataset.gpuProfile=JSON.stringify({samples:sorted.length,medianMs:+sorted[Math.floor(sorted.length*.5)].toFixed(2),p95Ms:+sorted[Math.floor(sorted.length*.95)].toFixed(2)});this.samples=[];}
  if(this.pending.length<6){this.active=gl.createQuery();if(this.active)gl.beginQuery(ext.TIME_ELAPSED_EXT,this.active);}
 }
 end(){if(this.active&&this.extension){this.gl.endQuery(this.extension.TIME_ELAPSED_EXT);this.pending.push(this.active);this.active=null;}}
}
