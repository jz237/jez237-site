export class ReplayFrames {
 constructor(capacity=48){this.capacity=capacity;this.frames=[];}
 add(frame){const recycled=this.frames.length>=this.capacity?this.frames.shift():null;this.frames.push(frame);return recycled;}
 clear(){for(const frame of this.frames){if(frame.canvas)frame.canvas.width=1;}this.frames=[];}
}
export function createInstantReplay({dialog,canvas,toggle,watch,getState,setPaused,isPaused,onPlaybackChange=()=>{}}){
 const buffer=new ReplayFrames(48);let enabled=false,lastSample=0,lastTick=-1,priorKey=null,priorPhase='',priorCounter=false,pending=0,lastPlay=-Infinity,playing=false,started=0,wasPaused=false;
 try{enabled=localStorage.getItem('final-blow-instant-replays')==='true';}catch{}
 function sync(){toggle.textContent=`REPLAYS: ${enabled?'ON':'OFF'}`;toggle.setAttribute('aria-pressed',String(enabled));watch.disabled=buffer.frames.length<8;}
 function close(){if(!playing)return;playing=false;if(dialog.open)dialog.close();setPaused(wasPaused);onPlaybackChange(false);}
 function setEnabled(value){enabled=Boolean(value);if(!enabled){close();buffer.clear();pending=0;}try{localStorage.setItem('final-blow-instant-replays',String(enabled));}catch{}sync();}
 function play(now=performance.now()){
  if(playing||buffer.frames.length<8)return false;
  playing=true;started=now;lastPlay=now;pending=0;wasPaused=isPaused();setPaused(true);dialog.showModal();onPlaybackChange(true);return true;
 }
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('close',close);
 toggle.addEventListener('click',()=>setEnabled(!enabled));watch.addEventListener('click',()=>play());
 dialog.querySelector('button').addEventListener('click',close);
 function update(now,sources){
  const state=getState();
  if(state.key!==priorKey){close();buffer.clear();pending=0;priorPhase='';priorCounter=false;lastTick=-1;priorKey=state.key;sync();}
  if(!state.active){close();buffer.clear();priorPhase='';pending=0;sync();return;}
  if(playing){
   const index=Math.floor((now-started)/1000*12);
   if(index>=buffer.frames.length){close();return;}
   const frame=buffer.frames[index];canvas.width=frame.canvas.width;canvas.height=frame.canvas.height;
   canvas.getContext('2d').drawImage(frame.canvas,0,0);return;
  }
  if(!enabled)return;
  const counter=Boolean(state.counter);
  if((state.phase==='finish'&&priorPhase==='fight')||(state.phase==='roundover'&&priorPhase!=='roundover')||(counter&&!priorCounter)){
   if(now-lastPlay>12000)pending=now+300;
  }
  priorPhase=state.phase;priorCounter=counter;
  if(!isPaused() && state.tick!==lastTick && now-lastSample>=1000/24 && ['fight','finish'].includes(state.phase)){
   lastSample=now;lastTick=state.tick;
   const recycled=buffer.frames.length>=buffer.capacity?buffer.frames.shift():null;
   const picture=recycled?.canvas||document.createElement('canvas');picture.width=768;picture.height=432;
   const paint=picture.getContext('2d');paint.fillStyle='#080d15';paint.fillRect(0,0,768,432);
   for(const source of sources)if(source?.width&&source?.height&&!source.hidden&&getComputedStyle(source).display!=='none')paint.drawImage(source,0,0,768,432);
   paint.fillStyle='rgba(0,0,0,.8)';paint.fillRect(0,0,768,30);paint.fillStyle='#fff';paint.font='bold 14px system-ui';paint.fillText(state.caption,15,21);
   buffer.add({canvas:picture,tick:state.tick});sync();
  }
  if(pending&&now>=pending){pending=0;play(now);}
 }
 sync();return {update,play,close,setEnabled,get enabled(){return enabled;},snapshot:()=>({enabled,playing,frames:buffer.frames.length,firstTick:buffer.frames[0]?.tick,lastTick:buffer.frames.at(-1)?.tick,capacity:buffer.capacity})};
}
