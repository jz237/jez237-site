import {createNativeEndingView} from './native-ending-view.js';
// RANK, RIDER, POINTS, RETIRE, ROUND n and FINAL ROUND are the original's words,
// read from its shared segment-1 label images; course names come from the
// game's course list. The ending's own segment-8 images (the warm-up row, the
// summary title, places by 7/4/2/1 award, the record badge and the
// class-opening offer) are not located, so those words follow each token's
// role in 602C.
const labels={0:'WARM-UP',31:'RANK',32:'RIDER',58:'POINTS',38:'CHAMPIONSHIP RESULTS',87:'FINAL ROUND',
 93:'1ST',94:'2ND',95:'3RD',96:'4TH',49:'RETIRE',98:'NEW',99:'NEW CHALLENGE OPENED'};
for(let i=0;i<8;i++)labels[71+i]='ROUND '+(i+1);

/** Authored high-resolution presentation of the original ending frames. The
 * source frame owns input, timing, scrolling and the exit destination. */
export function createNativeChampionshipEndingOverlay({document=globalThis.document,portrait,courseName,onSkip,onContinue}={}){
 const root=document.createElement('section');root.setAttribute('aria-label','Championship ending');root.hidden=true;
 root.style.cssText='position:fixed;inset:0;z-index:18;display:none;pointer-events:none';
 const panel=document.createElement('div');panel.style.cssText='position:absolute;inset:0';
 const shade=document.createElement('div');shade.style.cssText='position:absolute;inset:0;pointer-events:none;opacity:0';
 const button=document.createElement('button');
 button.style.cssText='position:absolute;bottom:max(12px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);pointer-events:auto;padding:10px 22px;border:1px solid #9dd8e9;border-radius:8px;background:#112c40;color:#effaff;font:600 15px Arial;cursor:pointer';
 root.append(panel,shade,button);document.body.append(root);
 button.onclick=()=>{if(button.dataset.action==='skip')onSkip?.();else onContinue?.();};
 const view=createNativeEndingView({parent:panel,labelForToken:token=>{
  if(token>=8&&token<=16)return courseName(token-8).toUpperCase();
  if(!Object.hasOwn(labels,token))throw new RangeError(`Unknown ending label ${token}`);return labels[token];
 },renderRider:({riderIndex,bounds,document:doc})=>{
  const rect=root.getBoundingClientRect(),scale=Math.min(rect.width/320,rect.height/240)*(doc.defaultView.devicePixelRatio||1);
  const image=doc.createElementNS('http://www.w3.org/2000/svg','image');
  for(const [key,value]of Object.entries({...bounds,preserveAspectRatio:'xMidYMid meet',href:portrait(riderIndex,bounds.width*scale,bounds.height*scale)}))image.setAttribute(key,String(value));
  return image;
 }});
 let previous=null,dimensions='';
 return {root,update(state,started){
  const menu=state.nativeEnding,visible=started&&!!menu&&['ending','paused'].includes(state.phase);
  root.hidden=!visible;root.style.display=visible?'block':'none';if(!visible){previous=null;return;}
  const draw=menu.draw,rect=root.getBoundingClientRect(),size=`${rect.width}:${rect.height}:${document.defaultView.devicePixelRatio}`;
  if(draw!==previous||size!==dimensions){if(draw?.ending)view.render(draw.ending);previous=draw;dimensions=size;}
  const fade=draw?.view?.fade??menu.view?.fade;
  shade.style.background=fade?.kind===7||draw?.kind==='white'?'#fff':'#000';
  shade.style.opacity=String(draw?.kind==='white'?1:fade?.kind?Math.max(0,Math.min(1,fade.rgba[3]/255)):0);
  const ceremony=!draw?.ending?.panelSlots?.length;
  button.dataset.action=ceremony?'skip':'continue';button.textContent=ceremony?'Skip ceremony':'Continue · Enter';
  button.hidden=state.phase!=='ending'||!ceremony&&!menu.view?.ready;
 },reset(){previous=null;view.clear();root.hidden=true;root.style.display='none';},destroy(){view.destroy();root.remove();}};
}
