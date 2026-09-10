export type PilotAction='patrol'|'intercept'|'fall'|'return'|'evade';
export type PilotFoe={id?:number;x:number;y:number;kind:number;alive:boolean;captive?:number;vy?:number;spawn?:number};
export type PilotWorld={x:number;y:number;dir:number;velocityX:number;world:number;carried:number;previous?:PilotFoe;foes:PilotFoe[];falls:{x:number;y:number;vy:number;index:number}[];hazards:{x:number;y:number}[];ground:(x:number)=>number;};
export type PilotDecision={action:PilotAction;x:number;y:number;dir:number;speed:number;fire:boolean;target?:PilotFoe;human?:number;};

/** Read-only decisions. The pilot cannot move enemies, invent a rescue, or catch a grounded human. */
export function decidePilot(w:PilotWorld):PilotDecision {
 const delta=(x:number)=>((x-w.x+w.world*1.5)%w.world)-w.world*.5;
 const facing=(x:number)=>Math.abs(delta(x))>45?Math.sign(delta(x)):w.dir;
 const falling=w.falls.map(h=>{
  const travel=Math.abs(delta(h.x))/390+.12;
  const landing=(w.ground(h.x)-15-h.y)/Math.max(100,h.vy);
  return{h,travel,landing};
 }).filter(c=>c.landing>c.travel-.1&&(!w.carried||c.travel<1.6))
   .sort((a,b)=>(a.landing-a.travel)-(b.landing-b.travel))[0];
 if(falling){const {h,travel}=falling;const t=Math.abs(delta(h.x))<95?0:Math.min(.4,travel);return{action:'fall',x:h.x,y:Math.min(w.ground(h.x)-35,h.y+h.vy*t+57.5*t*t-18),dir:facing(h.x),speed:390,fire:false,human:h.index};}
 if(w.carried){
  const landingX=w.x+w.velocityX*.12;
  return{action:'return',x:landingX,y:w.ground(landingX)-30,dir:w.dir,speed:180,fire:false};
 }
 const candidates=w.foes.filter(e=>e.alive&&(e.spawn??0)<=0);
 const rank=(e:PilotFoe)=>{
  const distance=Math.abs(delta(e.x));
  const rescue=e.captive!==undefined?Math.max(.15,(e.y-115)/400):1;
  return(distance+Math.abs(e.y-w.y)*.5+100)*rescue;
 };
 candidates.sort((a,b)=>rank(a)*(a===w.previous ? .8 : 1)-rank(b)*(b===w.previous ? .8 : 1));
 const target=candidates[0];
 if(target){
  const dx=delta(target.x),dir=facing(target.x),lead=Math.min(.5,Math.abs(dx)/1400);
  const aimY=target.y+(target.vy??0)*lead;
  const collision=w.hazards.find(e=>Math.abs(delta(e.x))<80&&Math.abs(e.y-w.y)<48);
  if(collision&&Math.abs(dx)<95){return{action:'evade',x:w.x+dir*180,y:w.y+(collision.y>=w.y?-105:105),dir,speed:390,fire:Math.abs(aimY-w.y)<11,target};}
  const carrier=target.captive!==undefined;const canRelease=!carrier||Math.abs(dx)<110||w.ground(target.x)-target.y>190;
  return{action:'intercept',x:target.x-dir*(carrier?65:185),y:aimY,dir,speed:340,fire:canRelease&&dx*dir>25&&dx*dir<1050&&Math.abs(aimY-w.y)<11,target};
 }
 return{action:'patrol',x:w.x+w.dir*400,y:280,dir:w.dir,speed:245,fire:false};
}
