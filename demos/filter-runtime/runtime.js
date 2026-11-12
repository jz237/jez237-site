import {createPerformanceGovernor} from '../uv-studio/performance.js?v=4';
import {createFilterDiagram} from './schematic.js?v=1';
import {createAmbientOcclusion} from './ambient.js?v=1';

export function createFilterAnimation({id,viewport,getState}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),initial=reduced.matches||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4?'light':'balanced';
 const governor=createPerformanceGovernor(initial);let renderer,scene,diagram,previous=0,frames=0,tier=initial,mode='3d',clock=0,raf=0,captures=0;const shadowSizes=new WeakMap();let three,ambient,ambientFailed=false,shading=false;
 const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./runtime.css?v=1',import.meta.url).href;document.head.append(link);
 const settings=document.createElement('div');settings.className='animation-settings';settings.innerHTML='<label>Graphics <select aria-label="Graphics quality"><option value="auto">Auto</option><option value="high">Detailed</option><option value="light">Light</option><option value="diagram">Animated diagram</option></select></label><span role="status"></span><button type="button" hidden>Retry 3D</button>';
 (document.getElementById('explorer')||viewport.parentElement).prepend(settings);const select=settings.querySelector('select'),status=settings.querySelector('span');
 const retry=settings.querySelector('button');retry.onclick=()=>location.reload();
 function report(){status.textContent=mode==='diagram'?'Simple animated view':tier==='light'?'Light 3D':tier==='high'?'Detailed 3D':'Adaptive 3D';}
 function quality(value){if(value==='diagram'){fallback();return;}if(mode==='diagram'){status.textContent='Reload to retry 3D';return;}tier=value;
  if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio,tier==='high'?1.6:tier==='light'?.75:1.15));renderer.setSize(viewport.clientWidth,viewport.clientHeight);renderer.shadowMap.enabled=tier!=='light';renderer.shadowMap.needsUpdate=true;renderer.transmissionResolutionScale=tier==='light'?.25:.55;
   scene?.traverse(o=>{if(o.material?.isShadowMaterial)o.visible=tier!=='light';if(o.isLight&&o.shadow){if(!shadowSizes.has(o))shadowSizes.set(o,o.shadow.mapSize.x);const size=Math.min(shadowSizes.get(o),tier==='high'?2048:1024);if(o.shadow.mapSize.x!==size){o.shadow.map?.dispose();o.shadow.map=null;o.shadow.mapSize.set(size,size);}}});}
  report();
 }
 function fallback(){if(diagram)return;mode='diagram';tier='diagram';renderer?.setAnimationLoop(null);if(renderer)renderer.domElement.hidden=true;
  document.body.dataset.filterGraphics='diagram';retry.hidden=false;for(const id of ['loading','error','fallback','tooltip']){const el=document.getElementById(id);if(el)el.hidden=true;}
  // A simple operating diagram cannot explode, orbit or isolate real geometry.
  // Keep text topics, part descriptions, Pause and Reset available.
  for(const control of document.querySelectorAll('[data-mode],[data-view],#explode,#explode-button,#sequence,#rotate,#isolate,#labels-toggle,#fit')){control.disabled=true;control.title='Available in the 3D view';}
  diagram=createFilterDiagram(viewport,id);previous=0;report();
  const loop=now=>{const dt=previous?Math.min(.1,(now-previous)/1000):0;previous=now;const s=getState();if(!document.hidden){const moving=!s.paused&&s.tab!=='care';if(moving)clock+=dt*(s.slow?1/3:1);diagram.render(clock,s,moving);frames++;}raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);
 }
 select.onchange=()=>quality(governor.choose(select.value));reduced.addEventListener('change',e=>{if(e.matches&&select.value==='auto')quality('light');});report();
 const api={
  makeRenderer(Three,options){three=Three;const probe=document.createElement('canvas'),gl=probe.getContext('webgl2');if(!gl)throw new Error('WebGL 2 unavailable');gl.getExtension('WEBGL_lose_context')?.loseContext();renderer=new Three.WebGLRenderer({...options,antialias:initial!=='light',powerPreference:'default'});renderer.debug.onShaderError=()=>{if(shading){ambientFailed=true;return;}queueMicrotask(fallback);};return renderer;},
  start(r,s,frame){renderer=r;scene=s;quality(initial);
   // Detailed only: after the showroom draws its scene to the screen, add ambient shading over it.
   const draw=renderer.render.bind(renderer);renderer.render=(sc,cam)=>{draw(sc,cam);if(tier!=='high'||mode!=='3d'||shading||ambientFailed||!three||sc!==scene||renderer.getRenderTarget()!==null)return;shading=true;try{ambient=ambient||createAmbientOcclusion(three,renderer);ambient.render(sc,cam);}catch(error){ambientFailed=true;console.warn('Ambient shading is off:',error.message);}finally{shading=false;}};
   renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});renderer.setAnimationLoop(now=>{if(mode==='diagram')return;const elapsed=previous?(now-previous)/1000:0;previous=now;if(!document.hidden){const next=governor.sample(elapsed);if(next){quality(next);if(mode==='diagram')return;}}try{frame(now);frames++;}catch(error){console.warn('Continuing with the animated filter diagram:',error.message);fallback();}});},
  // Refraction continues updating in Light mode, at one quarter of the render
  // cadence. Never leave an uninitialized texture or stop the model clock.
  capture(fn){if(mode==='3d'&&(captures++===0||tier==='high'||frames%(tier==='light'?4:2)===0))fn();},
  fallback,
  snapshot:()=>({id,ready:frames>0,mode,tier,ambient:!!ambient&&!ambientFailed,frames,clock,paused:!!getState().paused,governor:governor.snapshot(),diagram:diagram?.snapshot()})
 };
 window.filterAnimation=api;return api;
}
