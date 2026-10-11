// A renderer cannot finish its first view while its tab is suspended. Count
// foreground time without resetting the budget every time the user switches tabs.
export function createVisibleTimeout(doc,callback,duration,now=()=>performance.now()){
  let active=false,disposed=false,remaining=duration,started=0,timer;
  function pause(){
    if(timer===undefined)return;
    clearTimeout(timer);timer=undefined;
    remaining=Math.max(0,remaining-Math.max(0,now()-started));
  }
  function resume(){
    if(disposed||!active||doc.hidden||timer!==undefined)return;
    started=now();timer=setTimeout(()=>{
      timer=undefined;active=false;remaining=0;callback();
    },remaining);
  }
  function visibility(){pause();resume();}
  doc.addEventListener('visibilitychange',visibility);
  return {
    start(){if(disposed||active)return;remaining=duration;active=true;resume();},
    cancel(){pause();active=false;remaining=duration;},
    dispose(){pause();active=false;disposed=true;doc.removeEventListener('visibilitychange',visibility);},
  };
}
