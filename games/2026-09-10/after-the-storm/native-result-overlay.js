// Modern DOM presentation of the native post-race boundary. Source timers,
// controller edges and fade remain owned by the50ms race host. No render call
// advances them. Original textured widget drawing/menu loading is still separate.
export function createNativeResultOverlay(){
 const root=document.createElement('section');root.hidden=true;root.setAttribute('aria-label','Race finish');
 Object.assign(root.style,{position:'fixed',inset:'0',zIndex:'18',pointerEvents:'none',display:'none',
  alignItems:'center',justifyContent:'center',textAlign:'center',color:'#fff'});
 const shade=document.createElement('div');Object.assign(shade.style,{position:'absolute',inset:'0',background:'#000'});
 const panel=document.createElement('div');Object.assign(panel.style,{position:'relative',padding:'24px',
  textShadow:'0 3px 20px #001e29',fontFamily:'inherit'});
 const title=document.createElement('h2');Object.assign(title.style,{fontSize:'clamp(30px,6vw,72px)',margin:'0 0 12px',letterSpacing:'.08em'});
 const detail=document.createElement('p');Object.assign(detail.style,{fontSize:'clamp(14px,2vw,20px)',margin:'0 0 20px'});
 const button=document.createElement('button');button.textContent='Continue · Enter';
 Object.assign(button.style,{pointerEvents:'auto',padding:'12px 24px',borderRadius:'8px',font:'inherit',
  background:'#f2ce81',color:'#122d36',border:'0',cursor:'pointer'});
 panel.append(title,detail,button);root.append(shade,panel);document.body.append(root);
 const api={onContinue:null,update(state,started){
  const visible=started&&state.phase==='postrace';root.hidden=!visible;root.style.display=visible?'flex':'none';
  if(!visible)return;
  const result=state.nativeResult,versus=state.mode==='versus',dq=!!state.racers[0].dq;
  title.textContent=versus?(state.result.winner===null?'DRAW':`PLAYER ${state.result.winner+1} WINS`):dq?'RETIRED':'FINISH';
  detail.textContent=result?.canContinue?'Press Enter or Continue':dq?'Returning to race results…':
   versus?'Race complete':`Race complete · ${(state.result.time??0).toFixed(3)} s`;
  button.hidden=!result?.canContinue;
  const fade=state.nativeHost.lastHUD?.fade;
  shade.style.opacity=String(fade?.kind===1?Math.max(0,Math.min(1,fade.alpha/255)):0);
 }};
 button.onclick=()=>api.onContinue?.();return api;
}
