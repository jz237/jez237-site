// BFCache is a pause, not destruction. Keep GPU ownership until a real unload,
// and do not let visibility events restart a renderer with a lost context.
export function createMapLifecycle({window:win,document:doc,canvas,pause,resume,dispose,
  contextLost=()=>{},contextRestored=()=>{}}){
  let cached=false,lost=false,disposed=false;
  const synchronize=()=>{
    if(disposed)return;
    if(cached||lost||doc.hidden)pause();else resume();
  };
  const hide=event=>{
    if(disposed)return;pause();
    if(event.persisted){cached=true;return;}
    disposed=true;
    for(const [target,type,handler] of bindings)target.removeEventListener(type,handler);
    dispose();
  };
  const show=event=>{if(event.persisted){cached=false;synchronize();}};
  const lose=event=>{
    event.preventDefault();if(disposed)return;
    lost=true;pause();contextLost();
  };
  const restore=()=>{if(disposed)return;lost=false;contextRestored();synchronize();};
  const bindings=[[doc,'visibilitychange',synchronize],[win,'pagehide',hide],[win,'pageshow',show],
    [canvas,'webglcontextlost',lose],[canvas,'webglcontextrestored',restore]];
  for(const [target,type,handler] of bindings)target.addEventListener(type,handler);
  synchronize();
}
