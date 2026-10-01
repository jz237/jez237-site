// Optional, local-only real-device diagnostics. Nothing is uploaded or tracked.
import {gl} from './gl.js';
export function deviceCheck(app,canvas,caps){
  const panel=document.createElement('div');panel.id='device-check';
  panel.style.cssText='position:fixed;left:12px;right:12px;bottom:62px;z-index:30;padding:12px;color:#eee;background:#16191fee;border:1px solid #777;border-radius:10px;font:12px/1.4 system-ui;max-width:420px';
  const title=document.createElement('div');title.textContent='Phone check · 30 seconds in the current view';
  const status=document.createElement('div');status.textContent='Look around, then run again in Storm or on deck.';
  const start=document.createElement('button'),copy=document.createElement('button'),close=document.createElement('button');
  for(const [button,label] of [[start,'Run check'],[copy,'Copy result'],[close,'Close']]){
    button.textContent=label;button.style.cssText='margin:8px 6px 0 0;padding:8px;color:#eee;background:transparent;border:1px solid #888;border-radius:6px;font:inherit';
  }
  copy.hidden=true;panel.append(title,status,start,copy,close);document.body.append(panel);
  let running=false,frames=[],elapsed=0,result=null,errors=[],losses=0,hidden=0,lastSecond=-1;
  addEventListener('error',e=>errors.push(e.message));addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));
  canvas.addEventListener('webglcontextlost',()=>{losses++;running=false;result=report();copy.hidden=false;status.textContent='WebGL context lost. Copy this result into the chat.';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){hidden++;running=false;status.textContent='Check paused because the page was hidden. Run again with it visible.';start.disabled=false;}});
  const report=()=>{
    const sorted=[...frames].sort((a,b)=>a-b),percent=p=>sorted[Math.min(sorted.length-1,Math.floor(sorted.length*p))]||0;
    return {release:document.querySelector('meta[name="ocean-release"]')?.content,userAgent:navigator.userAgent,renderer:caps.renderer,
      viewport:[innerWidth,innerHeight,devicePixelRatio],backing:[app.w,app.h],quality:app.q,mobileTier:app.mobile,
      fft:[app.sim.N,app.sim.count],shadow:app.yachtShadow.size,seconds:+elapsed.toFixed(2),frames:frames.length,
      fps:+(frames.length*1000/Math.max(elapsed*1000,1)).toFixed(1),frameMedian:+percent(.5).toFixed(1),frameP95:+percent(.95).toFixed(1),
      mode:app.rig?.mode,seaWind:app.goal.wind,rain:app.state.rain,whirlpool:app.whirlpool.enabled,contextLosses:losses,hidden,errors:errors.slice(0,6)};
  };
  start.onclick=()=>{frames=[];elapsed=0;lastSecond=-1;running=true;result=null;start.disabled=true;copy.hidden=true;status.textContent='Running… keep this page visible.';};
  copy.onclick=async()=>{
    const text=JSON.stringify(result||report(),null,2);
    try{await navigator.clipboard.writeText(text);status.textContent='Copied. Paste this result into the Codex chat.';}
    catch{const box=document.createElement('textarea');box.value=text;box.style.cssText='width:100%;height:180px';panel.append(box);box.focus();box.select();status.textContent='Select and copy the result below.';}
  };
  close.onclick=()=>{running=false;panel.remove();};
  return {frame(ms){
    if(!running)return;
    frames.push(ms);elapsed+=ms/1000;
    if(frames.length%60===0){const error=gl.getError();if(error)errors.push(`WebGL error 0x${error.toString(16)}`);}
    if(elapsed>=30){running=false;result=report();window.__seaDeviceResult=result;start.disabled=false;copy.hidden=false;status.textContent=`${result.fps} FPS · 95% of frames ≤ ${result.frameP95} ms · ${errors.length} errors`;}
    else if(Math.floor(elapsed)!==lastSecond){lastSecond=Math.floor(elapsed);status.textContent=`Running… ${Math.ceil(30-elapsed)} seconds remaining`;}
  }};
}
