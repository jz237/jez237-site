import {createNativeChampionshipStandingsView} from './native-championship-standings-view.js';
const labels={6:'POINTS TO QUALIFY',20:'ROUND RESULTS',21:'OVERALL STANDINGS',24:'ROUNDS',27:'RETIRED',
 31:'RANK',32:'RIDER',58:'POINTS',79:'QUALIFYING POSITION',80:'ANY POSITION',81:'1ST',82:'2ND',83:'3RD',84:'4TH'};

/** Authored high-resolution presentation of the verified semantic layout.
 * The source frame owns input, timing, scoring and transitions. */
export function createNativeChampionshipStandingsOverlay({document=globalThis.document,portrait,onContinue}={}){
 const root=document.createElement('section');root.setAttribute('aria-label','Championship standings');root.hidden=true;
 root.style.cssText='position:fixed;inset:0;z-index:18;display:none;pointer-events:none';
 const panel=document.createElement('div');panel.style.cssText='position:absolute;inset:0';
 const shade=document.createElement('div');shade.style.cssText='position:absolute;inset:0;background:#000;pointer-events:none';
 const button=document.createElement('button');button.textContent='Continue · Enter';
 button.style.cssText='position:absolute;bottom:max(12px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);pointer-events:auto;padding:10px 22px;border:1px solid #9dd8e9;border-radius:8px;background:#112c40;color:#effaff;font:600 15px Arial;cursor:pointer';
 root.append(panel,shade,button);document.body.append(root);button.onclick=()=>onContinue?.();
 const view=createNativeChampionshipStandingsView({parent:panel,labelForToken:token=>{
  if(!Object.hasOwn(labels,token))throw new RangeError(`Unknown standings label ${token}`);return labels[token];
 },renderRider:({avatarIndex,bounds,document:doc})=>{
  const rect=root.getBoundingClientRect(),scale=Math.min(rect.width/320,rect.height/240)*(doc.defaultView.devicePixelRatio||1);
  const image=doc.createElementNS('http://www.w3.org/2000/svg','image');
  for(const [key,value]of Object.entries({...bounds,preserveAspectRatio:'xMidYMid meet',href:portrait(avatarIndex,bounds.width*scale,bounds.height*scale)}))image.setAttribute(key,String(value));
  return image;
 }});
 let previous=null,dimensions='';
 return {root,update(state,started){
  const menu=state.nativeStandings,visible=started&&!!menu&&['standings','paused'].includes(state.phase);
  root.hidden=!visible;root.style.display=visible?'block':'none';if(!visible){previous=null;return;}
  const draw=menu.draw,rect=root.getBoundingClientRect(),size=`${rect.width}:${rect.height}:${document.defaultView.devicePixelRatio}`;
  if(draw!==previous||size!==dimensions){if(draw?.layout)view.render(draw.layout);else view.clear();previous=draw;dimensions=size;}
  shade.style.opacity=String(!draw||draw.kind==='black'?1:draw.view.fade.kind===1?Math.max(0,Math.min(1,draw.view.fade.rgba[3]/255)):0);
  button.hidden=state.phase!=='standings'||!menu.view?.canConfirm;
 },reset(){previous=null;view.clear();root.hidden=true;root.style.display='none';},destroy(){view.destroy();root.remove();}};
}
